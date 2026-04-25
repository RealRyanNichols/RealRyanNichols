import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { buildRepWatchrTextReply } from "@/lib/quo-autoresponder";
import { REPWATCHR_PHONE_E164 } from "@/lib/repwatchr-contact";

export const runtime = "nodejs";

type QuoWebhookPayload = {
  id?: string;
  type?: string;
  data?: {
    object?: {
      body?: string;
      from?: string;
      to?: string;
      direction?: string;
      phoneNumberId?: string;
    };
  };
};

function verifyQuoSignature(rawBody: string, signatureHeader: string | null) {
  const signingKey = process.env.QUO_WEBHOOK_SIGNING_SECRET;
  if (!signingKey) return false;
  if (!signatureHeader) return false;

  const signatures = signatureHeader.split(",");
  return signatures.some((signature) => {
    const fields = signature.trim().split(";");
    const timestamp = fields[2];
    const providedDigest = fields[3];
    if (!timestamp || !providedDigest) return false;

    const ageMs = Math.abs(Date.now() - Number(timestamp));
    if (!Number.isFinite(ageMs) || ageMs > 5 * 60 * 1000) return false;

    const signedData = `${timestamp}.${rawBody}`;
    const computedDigest = crypto
      .createHmac("sha256", Buffer.from(signingKey, "base64"))
      .update(Buffer.from(signedData, "utf8"))
      .digest("base64");

    const provided = Buffer.from(providedDigest);
    const computed = Buffer.from(computedDigest);
    return provided.length === computed.length && crypto.timingSafeEqual(provided, computed);
  });
}

async function sendQuoMessage(to: string, content: string, phoneNumberId?: string) {
  const apiKey = process.env.QUO_API_KEY;
  if (!apiKey) return { sent: false, reason: "QUO_API_KEY is not configured." };

  const configuredPhoneNumberId = process.env.QUO_PHONE_NUMBER_ID ?? phoneNumberId;
  const from = process.env.QUO_FROM_NUMBER ?? REPWATCHR_PHONE_E164;

  const response = await fetch(process.env.QUO_MESSAGES_URL ?? "https://api.openphone.com/v1/messages", {
    method: "POST",
    headers: {
      authorization: apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      content,
      ...(configuredPhoneNumberId ? { phoneNumberId: configuredPhoneNumberId } : { from }),
      to: [to],
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    return { sent: false, reason: `Quo returned ${response.status}: ${details.slice(0, 200)}` };
  }

  return { sent: true };
}

async function buildReplyWithOptionalGideon(body: string) {
  const fallback = buildRepWatchrTextReply({ body });
  const endpoint = process.env.GIDEON_CHAT_URL;
  if (process.env.QUO_USE_GIDEON_AUTO_REPLY !== "true" || !endpoint) return fallback;

  try {
    const headers: Record<string, string> = {
      "content-type": "application/json",
    };
    const bearer = process.env.GIDEON_CHAT_BEARER ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (bearer) headers.authorization = `Bearer ${bearer}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        project: "repwatchr",
        tier: "sms",
        user_name: "RepWatchr SMS contact",
        user_context: {
          channel: "quo_sms",
          publicReply: true,
          instruction:
            "Reply by SMS in 480 characters or fewer. Do not give legal advice, do not invent facts, and ask for the missing location, official, school, source, or date when needed.",
        },
        message: body,
      }),
    });

    if (!response.ok) return fallback;
    const data = await response.json().catch(() => null);
    const reply = data?.reply ?? data?.content ?? data?.message;
    return typeof reply === "string" && reply.trim() ? reply.trim().slice(0, 480) : fallback;
  } catch {
    return fallback;
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signatureHeader = request.headers.get("openphone-signature");

  if (!verifyQuoSignature(rawBody, signatureHeader)) {
    return NextResponse.json({ error: "Invalid Quo signature." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as QuoWebhookPayload;
  if (payload.type !== "message.received") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const message = payload.data?.object;
  const from = message?.from;
  const body = message?.body?.trim() ?? "";

  if (!from || !body || message?.direction !== "incoming") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const reply = await buildReplyWithOptionalGideon(body);
  const delivery = await sendQuoMessage(from, reply, message.phoneNumberId);

  return NextResponse.json({ ok: true, replyQueued: delivery.sent, reason: delivery.reason ?? null });
}

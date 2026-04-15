import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { to, subject, body, eventId, area } = await request.json();

    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;

    if (!apiKey || !fromEmail) {
      return Response.json(
        { error: "SendGrid credentials not configured. Set SENDGRID_API_KEY and SENDGRID_FROM_EMAIL in .env" },
        { status: 400 }
      );
    }

    const sgRes = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: fromEmail, name: "Missouri Dent Bully" },
        subject,
        content: [{ type: "text/plain", value: body }],
      }),
    });

    if (!sgRes.ok) {
      const errText = await sgRes.text();
      return Response.json(
        { error: `SendGrid error: ${sgRes.status} - ${errText}` },
        { status: sgRes.status }
      );
    }

    await prisma.outreachLog.create({
      data: {
        eventId: eventId || null,
        method: "email",
        recipientCount: 1,
        area: area || "Unknown",
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}

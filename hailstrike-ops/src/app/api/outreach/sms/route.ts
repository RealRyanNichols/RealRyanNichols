import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { to, message, eventId, area } = await request.json();

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      return Response.json(
        { error: "Twilio credentials not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env" },
        { status: 400 }
      );
    }

    // Append opt-out text
    const fullMessage = `${message}\n\nReply STOP to opt out.`;

    const twilioRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        },
        body: new URLSearchParams({ To: to, From: fromNumber, Body: fullMessage }),
      }
    );

    const twilioData = await twilioRes.json();

    if (!twilioRes.ok) {
      return Response.json(
        { error: `Twilio error: ${twilioData.message || twilioRes.status}` },
        { status: twilioRes.status }
      );
    }

    // Log outreach
    await prisma.outreachLog.create({
      data: {
        eventId: eventId || null,
        method: "sms",
        recipientCount: 1,
        area: area || "Unknown",
      },
    });

    return Response.json({ success: true, sid: twilioData.sid });
  } catch (error) {
    console.error("SMS send error:", error);
    return Response.json({ error: "Failed to send SMS" }, { status: 500 });
  }
}

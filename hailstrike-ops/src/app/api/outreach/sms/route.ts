import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, message, eventId, area } = body;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json(
        {
          error: "Twilio not configured",
          message:
            "Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env",
        },
        { status: 400 }
      );
    }

    if (!to || !message) {
      return NextResponse.json(
        { error: "to and message are required" },
        { status: 400 }
      );
    }

    const recipients = Array.isArray(to) ? to : [to];
    const results = [];

    for (const phone of recipients) {
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
        const res = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: phone,
            From: fromNumber,
            Body: message,
          }),
        });

        const data = await res.json();
        results.push({
          phone,
          success: res.ok,
          sid: data.sid || null,
          error: data.message || null,
        });
      } catch (err) {
        results.push({
          phone,
          success: false,
          error: String(err),
        });
      }
    }

    // Log the outreach
    if (eventId) {
      await prisma.outreachLog.create({
        data: {
          eventId,
          method: "sms",
          recipientCount: recipients.length,
          area: area || "unknown",
        },
      });
    }

    return NextResponse.json({
      sent: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    });
  } catch (error) {
    console.error("SMS send error:", error);
    return NextResponse.json(
      { error: "Failed to send SMS" },
      { status: 500 }
    );
  }
}

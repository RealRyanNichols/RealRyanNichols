import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html, eventId, area } = body;

    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;

    if (!apiKey || !fromEmail) {
      return NextResponse.json(
        {
          error: "SendGrid not configured",
          message: "Set SENDGRID_API_KEY and SENDGRID_FROM_EMAIL in .env",
        },
        { status: 400 }
      );
    }

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "to, subject, and html are required" },
        { status: 400 }
      );
    }

    const recipients = Array.isArray(to) ? to : [to];
    const personalizations = recipients.map((email: string) => ({
      to: [{ email }],
    }));

    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations,
        from: { email: fromEmail, name: "Missouri Dent Bully - HailStrike Ops" },
        subject,
        content: [{ type: "text/html", value: html }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `SendGrid error: ${errText}` },
        { status: res.status }
      );
    }

    // Log the outreach
    if (eventId) {
      await prisma.outreachLog.create({
        data: {
          eventId,
          method: "email",
          recipientCount: recipients.length,
          area: area || "unknown",
        },
      });
    }

    return NextResponse.json({
      success: true,
      sent: recipients.length,
    });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}

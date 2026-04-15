import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get("eventId");

  const logs = await prisma.intelLog.findMany({
    where: eventId ? { eventId } : undefined,
    orderBy: { createdAt: "desc" },
    include: { event: true },
  });

  return NextResponse.json({ logs });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, sourceName, sourcePhone, callerName, notes } = body;

    if (!eventId || !sourceName || !callerName || !notes) {
      return NextResponse.json(
        { error: "eventId, sourceName, callerName, and notes are required" },
        { status: 400 }
      );
    }

    const log = await prisma.intelLog.create({
      data: {
        eventId,
        sourceName,
        sourcePhone: sourcePhone || null,
        callerName,
        notes,
      },
    });

    return NextResponse.json({ log }, { status: 201 });
  } catch (error) {
    console.error("Intel log create error:", error);
    return NextResponse.json(
      { error: "Failed to create intel log" },
      { status: 500 }
    );
  }
}

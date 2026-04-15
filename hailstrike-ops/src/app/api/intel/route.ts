import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get("eventId");

  const where = eventId ? { eventId } : {};
  const logs = await prisma.intelLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return Response.json({ logs });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, sourceName, sourcePhone, callerName, notes } = body;

    if (!eventId || !sourceName || !callerName || !notes) {
      return Response.json(
        { error: "Missing required fields: eventId, sourceName, callerName, notes" },
        { status: 400 }
      );
    }

    const log = await prisma.intelLog.create({
      data: { eventId, sourceName, sourcePhone, callerName, notes },
    });

    return Response.json({ log }, { status: 201 });
  } catch (error) {
    console.error("Intel log error:", error);
    return Response.json({ error: "Failed to create intel log" }, { status: 500 });
  }
}

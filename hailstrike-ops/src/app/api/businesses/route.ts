import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get("eventId");

  const businesses = await prisma.business.findMany({
    where: eventId ? { eventId } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ businesses });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventId,
      name,
      type,
      address,
      phone,
      email,
      website,
      ownerName,
      notes,
      hailExperience,
      carsPerMonth,
      industryMode,
      status,
    } = body;

    if (!eventId || !name || !address) {
      return NextResponse.json(
        { error: "eventId, name, and address are required" },
        { status: 400 }
      );
    }

    const business = await prisma.business.create({
      data: {
        eventId,
        name,
        type: type || "unknown",
        address,
        phone: phone || null,
        email: email || null,
        website: website || null,
        ownerName: ownerName || null,
        notes: notes || null,
        hailExperience: hailExperience || null,
        carsPerMonth: carsPerMonth ? parseInt(carsPerMonth, 10) : null,
        industryMode: industryMode || "auto",
        status: status || "prospect",
      },
    });

    return NextResponse.json({ business }, { status: 201 });
  } catch (error) {
    console.error("Business create error:", error);
    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 }
    );
  }
}

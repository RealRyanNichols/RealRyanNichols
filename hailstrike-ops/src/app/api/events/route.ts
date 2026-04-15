import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const events = await prisma.hailEvent.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          businesses: true,
          intelLogs: true,
          outreachLogs: true,
          adCampaigns: true,
        },
      },
    },
  });

  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const event = await prisma.hailEvent.create({
      data: {
        nwsAlertId: body.nwsAlertId || null,
        latitude: body.latitude,
        longitude: body.longitude,
        city: body.city || "Unknown",
        county: body.county || "Unknown",
        state: body.state || "Unknown",
        hailSize: body.hailSize || 0,
        source: body.source || "manual",
        sourceDetail: body.sourceDetail || null,
        damage: body.damage || "Unknown",
        windSpeed: body.windSpeed || null,
        verified: body.verified || false,
        reportCount: body.reportCount || 1,
        swathGeoJSON: body.swathGeoJSON
          ? JSON.stringify(body.swathGeoJSON)
          : null,
        avgHomeValue: body.avgHomeValue || null,
        medianIncome: body.medianIncome || null,
        population: body.population || null,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Event create error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

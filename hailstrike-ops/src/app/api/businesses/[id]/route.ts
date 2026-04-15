import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const business = await prisma.business.findUnique({ where: { id } });

  if (!business) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ business });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const business = await prisma.business.update({
      where: { id },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.ownerName !== undefined && { ownerName: body.ownerName }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.hailExperience !== undefined && {
          hailExperience: body.hailExperience,
        }),
        ...(body.carsPerMonth !== undefined && {
          carsPerMonth: body.carsPerMonth,
        }),
        ...(body.outreachMethod !== undefined && {
          outreachMethod: body.outreachMethod,
        }),
        ...(body.outreachSentAt !== undefined && {
          outreachSentAt: new Date(body.outreachSentAt),
        }),
      },
    });

    return NextResponse.json({ business });
  } catch (error) {
    console.error("Business update error:", error);
    return NextResponse.json(
      { error: "Failed to update business" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.business.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Business delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete business" },
      { status: 500 }
    );
  }
}

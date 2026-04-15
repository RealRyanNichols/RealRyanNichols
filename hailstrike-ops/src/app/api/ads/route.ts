import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";

export async function GET() {
  const campaigns = await prisma.adCampaign.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return Response.json({ campaigns });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventId,
      city,
      headline,
      adBody,
      lat,
      lng,
      radiusMiles,
      dailyBudget,
      industryMode,
      autoApproved,
    } = body;

    if (!eventId || !city || !headline || !adBody) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Build Meta targeting JSON
    const targeting = JSON.stringify({
      geo_locations: {
        custom_locations: [
          {
            latitude: lat,
            longitude: lng,
            radius: radiusMiles || 25,
            distance_unit: "mile",
          },
        ],
      },
      age_min: 25,
      age_max: 65,
      interests: [
        { id: "6003107902433", name: "Auto insurance" },
        { id: "6003139266461", name: "Automobile" },
      ],
    });

    const campaign = await prisma.adCampaign.create({
      data: {
        eventId,
        city,
        headline,
        body: adBody,
        targeting,
        radiusMiles: radiusMiles || 25,
        dailyBudget: dailyBudget || 50,
        industryMode: industryMode || "auto",
        autoApproved: autoApproved || false,
        status: autoApproved ? "active" : "pending",
      },
    });

    // If Meta credentials are configured and autoApproved, actually create the campaign
    const metaToken = process.env.META_ACCESS_TOKEN;
    const adAccountId = process.env.META_AD_ACCOUNT_ID;

    if (metaToken && adAccountId && autoApproved) {
      try {
        const metaRes = await fetch(
          `https://graph.facebook.com/v18.0/act_${adAccountId}/campaigns`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${metaToken}`,
            },
            body: JSON.stringify({
              name: `HailStrike - ${city} - ${new Date().toISOString().split("T")[0]}`,
              objective: "OUTCOME_LEADS",
              status: "PAUSED",
              special_ad_categories: [],
            }),
          }
        );

        if (metaRes.ok) {
          const metaData = await metaRes.json();
          await prisma.adCampaign.update({
            where: { id: campaign.id },
            data: { metaCampaignId: metaData.id, status: "active" },
          });
        }
      } catch (metaError) {
        console.error("Meta API error:", metaError);
      }
    }

    return Response.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error("Ad campaign error:", error);
    return Response.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}

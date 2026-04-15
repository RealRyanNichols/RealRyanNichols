import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get("eventId");

  const campaigns = await prisma.adCampaign.findMany({
    where: eventId ? { eventId } : undefined,
    orderBy: { createdAt: "desc" },
    include: { event: true },
  });

  return NextResponse.json({ campaigns });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventId,
      city,
      headline,
      adBody,
      targeting,
      radiusMiles,
      dailyBudget,
      autoApproved,
      industryMode,
      lat,
      lon,
    } = body;

    if (!eventId || !city || !headline || !adBody) {
      return NextResponse.json(
        { error: "eventId, city, headline, and adBody are required" },
        { status: 400 }
      );
    }

    // Create the campaign in our DB
    const campaign = await prisma.adCampaign.create({
      data: {
        eventId,
        city,
        headline,
        body: adBody,
        targeting: targeting || `${radiusMiles || 25}mi radius around ${city}`,
        radiusMiles: radiusMiles || 25,
        dailyBudget: dailyBudget || 50,
        autoApproved: autoApproved || false,
        industryMode: industryMode || "auto",
        status: autoApproved ? "active" : "pending",
      },
    });

    // If Meta API is configured and auto-approved, create the actual campaign
    const metaAccessToken = process.env.META_ACCESS_TOKEN;
    const adAccountId = process.env.META_AD_ACCOUNT_ID;

    if (metaAccessToken && adAccountId && autoApproved) {
      try {
        // Create Meta campaign
        const campaignRes = await fetch(
          `https://graph.facebook.com/v18.0/act_${adAccountId}/campaigns`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: `HailStrike - ${city} - ${new Date().toISOString().split("T")[0]}`,
              objective: "OUTCOME_LEADS",
              status: "PAUSED",
              special_ad_categories: [],
              access_token: metaAccessToken,
            }),
          }
        );

        const campaignData = await campaignRes.json();

        if (campaignData.id) {
          await prisma.adCampaign.update({
            where: { id: campaign.id },
            data: {
              metaCampaignId: campaignData.id,
              status: "active",
            },
          });

          // Create ad set with geo targeting
          await fetch(
            `https://graph.facebook.com/v18.0/act_${adAccountId}/adsets`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: `HailStrike AdSet - ${city}`,
                campaign_id: campaignData.id,
                daily_budget: Math.round(dailyBudget * 100),
                billing_event: "IMPRESSIONS",
                optimization_goal: "LEAD_GENERATION",
                bid_strategy: "LOWEST_COST_WITHOUT_CAP",
                targeting: {
                  geo_locations: {
                    custom_locations: [
                      {
                        latitude: lat,
                        longitude: lon,
                        radius: radiusMiles || 25,
                        distance_unit: "mile",
                      },
                    ],
                  },
                  age_min: 25,
                  age_max: 65,
                },
                status: "PAUSED",
                access_token: metaAccessToken,
              }),
            }
          );
        }
      } catch (metaError) {
        console.error("Meta API error:", metaError);
        // Continue — campaign is saved locally
      }
    }

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error("Ad campaign create error:", error);
    return NextResponse.json(
      { error: "Failed to create ad campaign" },
      { status: 500 }
    );
  }
}

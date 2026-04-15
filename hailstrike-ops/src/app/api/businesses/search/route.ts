import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lat, lon, radius = 50000, types = [] } = body;

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const hereApiKey = process.env.HERE_API_KEY;

    if (apiKey) {
      // Google Places API (New)
      const res = await fetch(
        "https://places.googleapis.com/v1/places:searchNearby",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "places.displayName,places.formattedAddress,places.location,places.internationalPhoneNumber,places.websiteUri,places.types",
          },
          body: JSON.stringify({
            includedTypes:
              types.length > 0
                ? types
                : [
                    "car_repair",
                    "car_dealer",
                    "car_wash",
                    "roofing_contractor",
                    "general_contractor",
                  ],
            maxResultCount: 20,
            locationRestriction: {
              circle: {
                center: { latitude: lat, longitude: lon },
                radius: Math.min(radius, 50000),
              },
            },
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        return NextResponse.json(
          { error: `Google Places API error: ${errText}` },
          { status: res.status }
        );
      }

      const data = await res.json();
      const businesses = (data.places || []).map(
        (p: Record<string, unknown>) => ({
          name: (p.displayName as Record<string, string>)?.text || "Unknown",
          type: ((p.types as string[]) || [])[0] || "business",
          address: p.formattedAddress || "",
          phone: p.internationalPhoneNumber || "",
          website: p.websiteUri || "",
          lat: (p.location as Record<string, number>)?.latitude,
          lon: (p.location as Record<string, number>)?.longitude,
        })
      );

      return NextResponse.json({ businesses, source: "google" });
    } else if (hereApiKey) {
      // HERE Search fallback
      const typeQuery = types.length > 0 ? types.join(",") : "auto repair,car dealer,roofing";
      const res = await fetch(
        `https://discover.search.hereapi.com/v1/browse?at=${lat},${lon}&limit=20&categories=${encodeURIComponent(typeQuery)}&apiKey=${hereApiKey}`
      );

      if (!res.ok) {
        return NextResponse.json(
          { error: `HERE API error: ${res.status}` },
          { status: res.status }
        );
      }

      const data = await res.json();
      const businesses = (data.items || []).map(
        (item: Record<string, unknown>) => ({
          name: item.title || "Unknown",
          type:
            ((item.categories as Array<Record<string, string>>) || [])[0]
              ?.name || "business",
          address:
            (item.address as Record<string, string>)?.label || "",
          phone:
            ((item.contacts as Array<Record<string, Array<Record<string, string>>>>) || [])[0]
              ?.phone?.[0]?.value || "",
          website:
            ((item.contacts as Array<Record<string, Array<Record<string, string>>>>) || [])[0]
              ?.www?.[0]?.value || "",
          lat: (item.position as Record<string, number>)?.lat,
          lon: (item.position as Record<string, number>)?.lng,
        })
      );

      return NextResponse.json({ businesses, source: "here" });
    } else {
      return NextResponse.json(
        {
          businesses: [],
          source: "none",
          message:
            "No API key configured. Set GOOGLE_PLACES_API_KEY or HERE_API_KEY in .env",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Business search error:", error);
    return NextResponse.json(
      { error: "Business search failed" },
      { status: 500 }
    );
  }
}

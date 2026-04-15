import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { lat, lng, radius, types } = await request.json();
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      // Fall back to HERE API if Google key not set
      const hereKey = process.env.HERE_API_KEY;
      if (hereKey) {
        return searchHERE(lat, lng, radius, types, hereKey);
      }
      return Response.json(
        { error: "No API key configured for business search. Set GOOGLE_PLACES_API_KEY or HERE_API_KEY in .env" },
        { status: 400 }
      );
    }

    const res = await fetch(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.displayName,places.formattedAddress,places.location,places.internationalPhoneNumber,places.websiteUri,places.primaryType",
        },
        body: JSON.stringify({
          includedTypes: types || ["car_repair", "car_dealer", "car_wash", "roofing_contractor", "general_contractor"],
          maxResultCount: 20,
          locationRestriction: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: Math.min(radius || 25000, 50000),
            },
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return Response.json(
        { error: `Google Places API error: ${res.status} - ${errText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const businesses = (data.places || []).map((p: Record<string, unknown>) => ({
      name: (p.displayName as { text: string })?.text || "Unknown",
      address: p.formattedAddress || "",
      phone: p.internationalPhoneNumber || "",
      website: p.websiteUri || "",
      type: p.primaryType || "business",
      lat: (p.location as { latitude: number })?.latitude,
      lng: (p.location as { longitude: number })?.longitude,
    }));

    return Response.json({ businesses });
  } catch (error) {
    console.error("Business search error:", error);
    return Response.json(
      { error: "Failed to search businesses" },
      { status: 500 }
    );
  }
}

async function searchHERE(lat: number, lng: number, radius: number, types: string[], apiKey: string) {
  const categoryMap: Record<string, string> = {
    car_repair: "700-7600-0116",
    car_dealer: "700-7600-0000",
    car_wash: "700-7600-0313",
    roofing_contractor: "700-7400-0000",
    general_contractor: "700-7400-0000",
  };

  const categories = (types || ["car_repair", "car_dealer"]).map(
    (t: string) => categoryMap[t] || "700-7400-0000"
  );

  const res = await fetch(
    `https://discover.search.hereapi.com/v1/browse?at=${lat},${lng}&limit=20&categories=${categories.join(",")}&in=circle:${lat},${lng};r=${radius || 25000}&apiKey=${apiKey}`
  );

  if (!res.ok) {
    return Response.json({ error: `HERE API error: ${res.status}` }, { status: res.status });
  }

  const data = await res.json();
  const businesses = (data.items || []).map((item: Record<string, unknown>) => ({
    name: item.title || "Unknown",
    address: (item.address as { label?: string })?.label || "",
    phone: (item.contacts as Array<{ phone?: Array<{ value: string }> }>)?.[0]?.phone?.[0]?.value || "",
    website: (item.contacts as Array<{ www?: Array<{ value: string }> }>)?.[0]?.www?.[0]?.value || "",
    type: "business",
    lat: (item.position as { lat: number })?.lat,
    lng: (item.position as { lng: number })?.lng,
  }));

  return Response.json({ businesses });
}

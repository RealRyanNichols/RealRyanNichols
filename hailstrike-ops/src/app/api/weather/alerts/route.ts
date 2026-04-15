import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.weather.gov/alerts/active?event=Severe%20Thunderstorm%20Warning",
      {
        headers: {
          "User-Agent": "(HailStrikeOps, ops@hailstrike.com)",
          Accept: "application/geo+json",
        },
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `NWS API returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    const hailAlerts = (data.features || []).filter(
      (f: Record<string, unknown>) => {
        const props = f.properties as Record<string, unknown>;
        const params = props?.parameters as Record<string, string[]> | undefined;
        return (
          params?.maxHailSize ||
          params?.hailThreat ||
          (props?.description as string)?.toLowerCase().includes("hail")
        );
      }
    );

    return NextResponse.json({
      type: "FeatureCollection",
      features: hailAlerts,
      metadata: {
        total: data.features?.length || 0,
        hailFiltered: hailAlerts.length,
        fetchedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("NWS alerts fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch NWS alerts" },
      { status: 500 }
    );
  }
}

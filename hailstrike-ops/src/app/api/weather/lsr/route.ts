import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(
      "https://mesonet.agron.iastate.edu/geojson/lsr.py?wfo=ALL",
      { next: { revalidate: 0 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `IEM returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Filter for hail reports only
    const hailReports = (data.features || []).filter(
      (f: Record<string, unknown>) => {
        const props = f.properties as Record<string, string> | undefined;
        return props?.typetext?.toLowerCase() === "hail";
      }
    );

    return NextResponse.json({
      type: "FeatureCollection",
      features: hailReports,
      count: hailReports.length,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("IEM LSR fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch IEM storm reports" },
      { status: 500 }
    );
  }
}

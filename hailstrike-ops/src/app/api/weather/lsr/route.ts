export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(
      "https://mesonet.agron.iastate.edu/geojson/lsr.py?wfo=ALL",
      { headers: { "User-Agent": "(HailStrikeOps, ops@hailstrike.com)" } }
    );

    if (!res.ok) {
      return Response.json(
        { error: `IEM returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Filter to hail reports only
    const hailFeatures = (data.features || []).filter(
      (f: { properties?: { typetext?: string } }) =>
        f.properties?.typetext?.toLowerCase().includes("hail")
    );

    return Response.json({
      type: "FeatureCollection",
      features: hailFeatures,
    });
  } catch (error) {
    console.error("IEM LSR fetch error:", error);
    return Response.json(
      { error: "Failed to fetch IEM local storm reports" },
      { status: 500 }
    );
  }
}

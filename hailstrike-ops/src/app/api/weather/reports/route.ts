export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(
      "https://www.spc.noaa.gov/climo/reports/today_hail.csv",
      { headers: { "User-Agent": "(HailStrikeOps, ops@hailstrike.com)" } }
    );

    if (!res.ok) {
      return Response.json(
        { error: `SPC returned ${res.status}` },
        { status: res.status }
      );
    }

    const text = await res.text();
    const lines = text.trim().split("\n");

    // Skip header line
    const reports = lines.slice(1).map((line) => {
      const parts = line.split(",");
      const time = parts[0]?.trim();
      const sizeHundredths = parseInt(parts[1]?.trim() || "0", 10);
      const size = sizeHundredths / 100;
      const location = parts[2]?.trim() || "";
      const county = parts[3]?.trim() || "";
      const state = parts[4]?.trim() || "";
      const lat = parseFloat(parts[5]?.trim() || "0");
      const lon = parseFloat(parts[6]?.trim() || "0");
      // Comments may contain commas, rejoin from index 7
      const comments = parts.slice(7).join(",").trim();

      return { time, size, location, county, state, lat, lon, comments };
    }).filter((r) => !isNaN(r.lat) && !isNaN(r.lon) && r.lat !== 0);

    return Response.json({ reports });
  } catch (error) {
    console.error("SPC reports fetch error:", error);
    return Response.json(
      { error: "Failed to fetch SPC reports" },
      { status: 500 }
    );
  }
}

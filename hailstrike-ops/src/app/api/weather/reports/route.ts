import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface SPCReport {
  time: string;
  size: number;
  location: string;
  county: string;
  state: string;
  lat: number;
  lon: number;
  comments: string;
}

export async function GET() {
  try {
    const res = await fetch(
      "https://www.spc.noaa.gov/climo/reports/today_hail.csv",
      { next: { revalidate: 0 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `SPC returned ${res.status}` },
        { status: res.status }
      );
    }

    const text = await res.text();
    const lines = text.trim().split("\n");

    // Skip header row
    const reports: SPCReport[] = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",");
      if (parts.length < 8) continue;

      const time = parts[0]?.trim();
      const sizeHundredths = parseInt(parts[1]?.trim(), 10);
      const location = parts[2]?.trim();
      const county = parts[3]?.trim();
      const state = parts[4]?.trim();
      const lat = parseFloat(parts[5]?.trim());
      const lon = parseFloat(parts[6]?.trim());
      // Comments may contain commas — rejoin from index 7
      const comments = parts.slice(7).join(",").trim();

      if (isNaN(lat) || isNaN(lon) || isNaN(sizeHundredths)) continue;

      reports.push({
        time,
        size: sizeHundredths / 100, // Convert hundredths to inches
        location,
        county,
        state,
        lat,
        lon, // Already negative for US
        comments,
      });
    }

    return NextResponse.json({
      reports,
      count: reports.length,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("SPC reports fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch SPC hail reports" },
      { status: 500 }
    );
  }
}

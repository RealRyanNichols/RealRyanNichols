import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const stateFips = searchParams.get("state") || "29"; // Missouri default
  const countyFips = searchParams.get("county");

  const apiKey = process.env.CENSUS_API_KEY;

  try {
    const countyFilter = countyFips ? countyFips : "*";
    const url = `https://api.census.gov/data/2022/acs/acs5?get=B25077_001E,B19013_001E,B01001_001E,NAME&for=county:${countyFilter}&in=state:${stateFips}${apiKey ? `&key=${apiKey}` : ""}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Census API returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    // First row is headers: ["B25077_001E","B19013_001E","B01001_001E","NAME","state","county"]
    const results = data.slice(1).map((row: string[]) => ({
      medianHomeValue: row[0] !== null ? parseInt(row[0], 10) : null,
      medianIncome: row[1] !== null ? parseInt(row[1], 10) : null,
      population: row[2] !== null ? parseInt(row[2], 10) : null,
      countyName: row[3],
      stateFips: row[4],
      countyFips: row[5],
    }));

    return NextResponse.json({ demographics: results });
  } catch (error) {
    console.error("Census API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch demographics" },
      { status: 500 }
    );
  }
}

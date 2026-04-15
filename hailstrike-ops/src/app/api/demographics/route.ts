import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const stateCode = searchParams.get("state") || "29"; // Default Missouri

    const apiKey = process.env.CENSUS_API_KEY;
    const keyParam = apiKey ? `&key=${apiKey}` : "";

    const res = await fetch(
      `https://api.census.gov/data/2022/acs/acs5?get=B25077_001E,B19013_001E,B01001_001E,NAME&for=county:*&in=state:${stateCode}${keyParam}`
    );

    if (!res.ok) {
      return Response.json(
        { error: `Census API returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    // First row is headers
    const headers = data[0];
    const rows = data.slice(1);

    const demographics = rows.map((row: string[]) => ({
      medianHomeValue: parseInt(row[0]) || 0,
      medianIncome: parseInt(row[1]) || 0,
      population: parseInt(row[2]) || 0,
      name: row[3] || "",
      stateCode: row[4] || "",
      countyCode: row[5] || "",
    }));

    return Response.json({ demographics, headers });
  } catch (error) {
    console.error("Census API error:", error);
    return Response.json(
      { error: "Failed to fetch demographics" },
      { status: 500 }
    );
  }
}

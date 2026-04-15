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
      }
    );

    if (!res.ok) {
      return Response.json(
        { error: `NWS API returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("NWS alerts fetch error:", error);
    return Response.json(
      { error: "Failed to fetch NWS alerts" },
      { status: 500 }
    );
  }
}

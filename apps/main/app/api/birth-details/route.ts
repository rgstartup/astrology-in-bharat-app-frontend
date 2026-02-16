import { NextResponse } from "next/server";

const CLIENT_ID = "0997d99e-d015-4a29-9cbb-a802a37acef5";
const CLIENT_SECRET = "QhRT3LPzVOhQQ5MMf3eOx8wdpJo164Djwadd3Uw9";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const datetime = searchParams.get("datetime");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const ayanamsa = searchParams.get("ayanamsa") || "1";

    console.log("Birth Details API Request Params:", {
      datetime,
      lat,
      lon,
      ayanamsa,
    });

    if (!datetime || !lat || !lon) {
      return NextResponse.json(
        { error: "Missing mandatory parameters: datetime, lat, lon" },
        { status: 400 }
      );
    }

    // 1. Get Access Token
    console.log("Fetching Prokerala Token...");
    const tokenResponse = await fetch("https://api.prokerala.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!,
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log("Token Response Status:", tokenResponse.status);

    if (!tokenData.access_token) {
      console.error("Authentication Failed:", tokenData);
      return NextResponse.json(
        { error: "Failed to authenticate with Prokerala" },
        { status: 500 }
      );
    }

    // 2. Fetch Birth Details
    const coordinates = `${lat},${lon}`;
    const params = new URLSearchParams({
      ayanamsa: String(ayanamsa),
      coordinates,
      datetime,
    });

    const dataResponse = await fetch(
      `https://api.prokerala.com/v2/astrology/birth-details?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/json",
        },
      }
    );

    const result = await dataResponse.json();
    console.log("Prokerala Birth Details Status:", dataResponse.status);
    console.log(
      "Prokerala API Response URL:",
      `https://api.prokerala.com/v2/astrology/birth-details?${params.toString()}`
    );

    if (!dataResponse.ok) {
      console.error("Prokerala API Error Result:", result);
      return NextResponse.json(
        { error: result.errors?.[0]?.detail || "API request failed" },
        { status: dataResponse.status }
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(
      "Birth Details API Error:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      { error: "Failed to fetch birth details" },
      { status: 500 }
    );
  }
}



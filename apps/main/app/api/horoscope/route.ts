// app/api/horoscope/route.ts
import { NextResponse } from "next/server";

const CLIENT_ID = "0997d99e-d015-4a29-9cbb-a802a37acef5";
const CLIENT_SECRET = "QhRT3LPzVOhQQ5MMf3eOx8wdpJo164Djwadd3Uw9";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sign = searchParams.get("sign");

  if (!sign)
    return NextResponse.json({ error: "Sign is required" }, { status: 400 });

  try {
    // 1. Get Access Token (Server-side)
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

    // 2. Fetch Horoscope Data
    const today = new Date().toISOString();
    const dataResponse = await fetch(
      `https://api.prokerala.com/v2/horoscope/daily/advanced?sign=${sign}&datetime=${today}&type=all`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/json",
        },
      }
    );

    const result = await dataResponse.json();

    // Response with CORS headers for safety
    return NextResponse.json(result, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cosmic data" },
      { status: 500 }
    );
  }
}



import { NextResponse } from "next/server";

const CLIENT_ID = "0997d99e-d015-4a29-9cbb-a802a37acef5";
const CLIENT_SECRET = "QhRT3LPzVOhQQ5MMf3eOx8wdpJo164Djwadd3Uw9";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const boy_dob = searchParams.get("boy_dob");
    const boy_lat = searchParams.get("boy_lat");
    const boy_lon = searchParams.get("boy_lon");
    const girl_dob = searchParams.get("girl_dob");
    const girl_lat = searchParams.get("girl_lat");
    const girl_lon = searchParams.get("girl_lon");

    console.log("=== Kundali Matching API Request Started ===");
    console.log("Parameters Received:", {
      boy_dob,
      boy_lat,
      boy_lon,
      girl_dob,
      girl_lat,
      girl_lon,
    });

    if (
      !boy_dob ||
      !boy_lat ||
      !boy_lon ||
      !girl_dob ||
      !girl_lat ||
      !girl_lon
    ) {
      console.error("Missing mandatory parameters");
      return NextResponse.json(
        { error: "Missing mandatory parameters for boy or girl" },
        { status: 400 }
      );
    }

    // 1. Get Access Token
    console.log("Step 1: Fetching Access Token...");
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
      console.error("Matching Auth Failed:", tokenData);
      return NextResponse.json(
        { error: "Failed to authenticate with Prokerala" },
        { status: 500 }
      );
    }
    console.log("Token acquired successfully.");

    // 2. Fetch Kundli Matching Data
    const boyCoords = `${boy_lat},${boy_lon}`;
    const girlCoords = `${girl_lat},${girl_lon}`;

    const params = new URLSearchParams({
      ayanamsa: "1",
      boy_dob: boy_dob,
      boy_coordinates: boyCoords,
      girl_dob: girl_dob,
      girl_coordinates: girlCoords,
    });

    const apiUrl = `https://api.prokerala.com/v2/astrology/kundli-matching?${params.toString()}`;
    console.log("Step 2: Calling Prokerala API...");
    console.log("API URL:", apiUrl);

    const dataResponse = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/json",
      },
    });

    // const result = await dataResponse.json(); <--for live data
    const result = {
      status: "ok",
      data: {
        girl_info: {
          koot: {
            varna: "Brahmin",
            vasya: "Jalachara",
            tara: "Janma",
            yoni: "Gau",
            graha_maitri: "Jupiter",
            gana: "Manushya",
            bhakoot: "Meena",
            nadi: "Madhya",
          },
          nakshatra: {
            id: 25,
            name: "Uttara Bhadrapada",
            lord: {
              id: 6,
              name: "Saturn",
              vedic_name: "Shani",
            },
            pada: 3,
          },
          rasi: {
            id: 11,
            name: "Meena",
            lord: {
              id: 2,
              name: "Mercury",
              vedic_name: "Budha",
            },
          },
        },
        boy_info: {
          koot: {
            varna: "Brahmin",
            vasya: "Jalachara",
            tara: "Janma",
            yoni: "Gau",
            graha_maitri: "Jupiter",
            gana: "Manushya",
            bhakoot: "Meena",
            nadi: "Madhya",
          },
          nakshatra: {
            id: 25,
            name: "Uttara Bhadrapada",
            lord: {
              id: 6,
              name: "Saturn",
              vedic_name: "Shani",
            },
            pada: 3,
          },
          rasi: {
            id: 11,
            name: "Meena",
            lord: {
              id: 2,
              name: "Mercury",
              vedic_name: "Budha",
            },
          },
        },
        message: {
          type: "bad",
          description:
            "Union is not recommended due to the presence of Nadi Maha Dosha.  Since Gun Milan Nadi Koot is given supreme priority during match making. The Boy and Girl are not affected by Mangal Dosha",
        },
        guna_milan: {
          total_points: 28,
          maximum_points: 36,
          ashtakoot: {
            varna: { score: 1, maximum_score: 1 },
            vasya: { score: 2, maximum_score: 2 },
            tara: { score: 1.5, maximum_score: 3 },
            yoni: { score: 4, maximum_score: 4 },
            graha_maitri: { score: 5, maximum_score: 5 },
            gana: { score: 1, maximum_score: 6 },
            bhakoot: { score: 7, maximum_score: 7 },
            nadi: { score: 6.5, maximum_score: 8 },
          },
        },
      },
    };
    console.log("Prokerala API Response Status:", dataResponse.status);

    if (!dataResponse.ok) {
      console.error("Prokerala Matching Error Result:", result);
      return NextResponse.json(
        { error: result.errors?.[0]?.detail || "API request failed" },
        { status: dataResponse.status }
      );
    }

    console.log("API Request Successful. Returning result.");
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(
      "Kundli Matching API Error:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      { error: "Failed to perform Kundli matching" },
      { status: 500 }
    );
  }
}

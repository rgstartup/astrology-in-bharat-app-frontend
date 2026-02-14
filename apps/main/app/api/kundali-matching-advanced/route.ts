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

    if (
      !boy_dob ||
      !boy_lat ||
      !boy_lon ||
      !girl_dob ||
      !girl_lat ||
      !girl_lon
    ) {
      return NextResponse.json(
        { error: "Missing mandatory parameters for boy or girl" },
        { status: 400 }
      );
    }

    // 1. Get Access Token
    console.log("Token Request Initiated...");
    const tokenResponse = await fetch("https://api.prokerala.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error("Matching Auth Failed:", tokenData);
      return NextResponse.json(
        { error: "Failed to authenticate with Prokerala" },
        { status: 500 }
      );
    }
    console.log("Token Received Successfully");

    // 2. Fetch Advanced Kundli Matching Data
    const boyCoords = `${boy_lat},${boy_lon}`;
    const girlCoords = `${girl_lat},${girl_lon}`;

    const params = new URLSearchParams({
      ayanamsa: "1",
      boy_dob: boy_dob,
      boy_coordinates: boyCoords,
      girl_dob: girl_dob,
      girl_coordinates: girlCoords,
    });

    console.log(
      "Fetching Prokerala Advanced Matching with params:",
      params.toString()
    );

    const dataResponse = await fetch(
      `https://api.prokerala.com/v2/astrology/kundli-matching/advanced?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/json",
        },
      }
    );

    // const result = await dataResponse.json(); <-- For live data
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
          guna: [
            {
              id: 1,
              name: "Varna",
              girl_koot: "Brahmin",
              boy_koot: "Brahmin",
              maximum_points: 1,
              obtained_points: 1,
              description:
                "Varna represents the working attitude and capacity.  The  bridegroom's capacity needs to be higher than that of the bride for smooth running of the family. The boy and the girl both belong to Brahmin Varna. This type of combination is very much favorable for a union. For this couple Varna Koot is Good.",
            },
            {
              id: 2,
              name: "Vasya",
              girl_koot: "Jalachara",
              boy_koot: "Jalachara",
              maximum_points: 2,
              obtained_points: 2,
              description:
                "Vasya was used to determine whether there will be a dedicated and compatible relationship between two people. The boy and the girl both belong to Jalachara Vasya. This is excellent match. For this couple Vasya Koot is Excellent.",
            },
            {
              id: 3,
              name: "Tara",
              girl_koot: "Janma",
              boy_koot: "Janma",
              maximum_points: 3,
              obtained_points: 3,
              description:
                "Tara is used to calculate the health and well-being of the bride and groom after marriage. The boy and the girl both belong to same Tara Group. The boy's nakshatra Uttara Bhadrapada is 0 th position from girl's nakshatra Uttara Bhadrapada and this is Benefic. At the same time The girl's nakshatra Uttara Bhadrapada is  0 th position from boy's nakshatra Uttara Bhadrapada and this is Benefic This is so far the best compatible match. For this couple Tara Koot is Excellent.",
            },
            {
              id: 4,
              name: "Yoni",
              girl_koot: "Gau",
              boy_koot: "Gau",
              maximum_points: 4,
              obtained_points: 4,
              description:
                "Yoni indicates the physical and sexual compatibility between a couple. The boy and the girl both belong to same Yoni Gau This is a warm and gratifying combination. For this couple Yoni Koot is Excellent.",
            },
            {
              id: 5,
              name: "Graha Maitri",
              girl_koot: "Jupiter",
              boy_koot: "Jupiter",
              maximum_points: 5,
              obtained_points: 5,
              description:
                "Graha Maitri is used to examine the strength of the love between the couple. This is achieved by comparing the sign lords of the moon in the chart of the bride and groom. The boy and the girl both belong to same Rasi Lord Jupiter. The boy and the girl both comes under the same Rasi Meena. This is one of the best compatible match. For this couple Graha Maitri Koot is Excellent.",
            },
            {
              id: 6,
              name: "Gana",
              girl_koot: "Manushya",
              boy_koot: "Manushya",
              maximum_points: 6,
              obtained_points: 6,
              description:
                "Gana is used to identify an individuals temperament. The boy and the girl both belong to same Gana Manushya. This is considered to be an excellent combination for gana match. For this couple Gana Koot is Excellent.",
            },
            {
              id: 7,
              name: "Bhakoot",
              girl_koot: "Meena",
              boy_koot: "Meena",
              maximum_points: 7,
              obtained_points: 7,
              description:
                "Bhakoot or Rashikoot testing is used to verify the overall health, welfare and prosperity of a family after marriage. It is believed that Bhakoot Dosha can affect the intimacy between the couple and cause delays in pregnancy. Zodiac sign for of the boy and the girl is Meena. This is an excellent combination from the happiness and prosperity point of view. For this couple Bhakoot Koot is Excellent.",
            },
            {
              id: 8,
              name: "Nadi",
              girl_koot: "Madhya",
              boy_koot: "Madhya",
              maximum_points: 8,
              obtained_points: 0,
              description:
                "Nadi testing is to check the genetic compatibility of the bride and groom to ensure they are capable of producing healthy children. Nadi Koot is given supreme priority during match making. The boy and the girl both belong to same Nadi Madhya. This is inauspicious combination. For this couple Nadi Koot is not Good.",
            },
          ],
        },
        girl_mangal_dosha_details: {
          has_dosha: false,
          has_exception: false,
          dosha_type: null,
          description: "The person is Not Manglik",
        },
        boy_mangal_dosha_details: {
          has_dosha: false,
          has_exception: false,
          dosha_type: null,
          description: "The person is Not Manglik",
        },
        exceptions: [],
      },
    };

    console.log("Prokerala API Response Status:", dataResponse.status);
    if (dataResponse.ok) {
      console.log(
        "Data Retrieved Successfully. Keys:",
        Object.keys(result.data || {})
      );
    }

    if (!dataResponse.ok) {
      console.error("Prokerala Advanced Matching Error Result:", result);
      return NextResponse.json(
        { error: result.errors?.[0]?.detail || "API request failed" },
        { status: dataResponse.status }
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(
      "Advanced Kundli Matching API Error:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      { error: "Failed to perform Advanced Kundli matching" },
      { status: 500 }
    );
  }
}

import {
  Sun, Moon, Zap, MessageCircle, Globe, Compass, Star, Skull, Ghost, MapPin
} from "lucide-react";
import { getErrorMessage } from "@repo/lib";

export interface PlanetFormData {
  year: number | string;
  month: number | string;
  date: number | string;
  hours: number | string;
  minutes: number | string;
  seconds?: number | string;
  latitude: string;
  longitude: string;
  timezone: number | string;
}

export interface PlanetPositionItem {
  name: string;
  fullDegree: number;
  normDegree: number;
  isRetro?: string | boolean;
  current_sign: number;
  house?: number;
  [key: string]: any;
}

// Planet Color and Icon Mapping
export const PLANET_META: Record<string, { color: string; icon: any }> = {
  "Sun": { color: "#FFD700", icon: Sun },
  "Moon": { color: "#94a3b8", icon: Moon },
  "Mars": { color: "#ef4444", icon: Zap },
  "Mercury": { color: "#06b6d4", icon: MessageCircle },
  "Jupiter": { color: "#f59e0b", icon: Globe },
  "Venus": { color: "#f472b6", icon: Star },
  "Saturn": { color: "#6366f1", icon: Compass },
  "Rahu": { color: "#475569", icon: Ghost },
  "Ketu": { color: "#334155", icon: Skull },
  "Ascendant": { color: "#b45309", icon: MapPin },
};

export const fetchPlanetPositions = async (
  formData: PlanetFormData,
  translations?: {
    invalidLocationResponse?: string;
    invalidApiResponse?: string;
    defaultApiError?: string;
  }
): Promise<{ data: PlanetPositionItem[]; error: string | null }> => {
  const lat = parseFloat(formData.latitude);
  const lon = parseFloat(formData.longitude);

  if (isNaN(lat) || isNaN(lon)) {
    return {
      data: [],
      error: translations?.invalidLocationResponse || "Invalid location coordinates provided.",
    };
  }

  const apiKey =
    process.env.NEXT_PUBLIC_FREE_ASTROLOGY_API_KEY || "YOUR_API_KEY_HERE";
  const url = `${process.env.NEXT_PUBLIC_CALCULATOR_URL || "https://json.freeastrologyapi.com"}/planets`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        year: parseInt(formData.year.toString()),
        month: parseInt(formData.month.toString()),
        date: parseInt(formData.date.toString()),
        hours: parseInt(formData.hours.toString()),
        minutes: parseInt(formData.minutes.toString()),
        seconds: parseInt((formData.seconds ?? 0).toString()),
        latitude: lat,
        longitude: lon,
        timezone: parseFloat(formData.timezone.toString()),
        settings: {
          observation_point: "topocentric",
          ayanamsha: "lahiri",
        },
      }),
    });

    const resData = await res.json();
    if (resData && resData.output) {
      const outputObj = resData.output[0];
      const formattedData = Object.values(outputObj).filter(
        (item: any) => item && typeof item === "object" && item.name
      ) as PlanetPositionItem[];
      return { data: formattedData, error: null };
    } else {
      return {
        data: [],
        error: translations?.invalidApiResponse || "Invalid response received from astrology server.",
      };
    }
  } catch (err: any) {
    console.error("API Error:", err);
    return {
      data: [],
      error: getErrorMessage(err) || translations?.defaultApiError || "Failed to calculate planetary positions.",
    };
  }
};

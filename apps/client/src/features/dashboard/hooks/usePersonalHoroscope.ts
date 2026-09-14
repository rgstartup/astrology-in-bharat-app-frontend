"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "next-intl";
import { fetchDailyHoroscope } from "../api/dashboard.api";
import { DEFAULT_HOROSCOPE_DATA } from "../data/horoscope.data";

export interface HoroscopeAspectScores {
  relationships: number;
  career: number;
  finance: number;
  wellbeing: number;
}

export interface HoroscopeData {
  sign: string;
  date: string;
  summary: string;
  scores: HoroscopeAspectScores;
  luckyNumber?: string | number;
  luckyColor?: string;
  luckyTime?: string;
  planetaryInfluence?: string;
  raw?: any;
}

export function usePersonalHoroscope(
  sign?: string,
  dateOffset: "yesterday" | "today" | "tomorrow" = "today"
) {
  const lang = useLocale();
  const effectiveSign = (sign || "gemini").toLowerCase();

  const [data, setData] = useState<HoroscopeData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchHoroscope = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const [res, err] = await fetchDailyHoroscope(effectiveSign, lang);

    if (err || !res?.data) {
      setData({
        ...DEFAULT_HOROSCOPE_DATA,
        sign: effectiveSign,
      });
      setError(err);
      setIsLoading(false);
      return;
    }

    const prediction = res.data.daily_predictions?.[0] || res.data;
    const predictionText =
      prediction?.prediction ||
      prediction?.overview ||
      prediction?.description ||
      "A harmonious day encouraging inner growth and thoughtful endeavors.";

    // Extract lucky attributes if available from the API response
    const luckyNumber =
      res.data?.lucky_number ||
      prediction?.lucky_number ||
      prediction?.luckyNumber ||
      7;
    const luckyColor =
      res.data?.lucky_color ||
      prediction?.lucky_color ||
      prediction?.luckyColor ||
      "Saffron & Yellow";
    const luckyTime =
      res.data?.lucky_time ||
      prediction?.lucky_time ||
      prediction?.luckyTime ||
      "09:15 AM - 11:30 AM";

    setData({
      sign: effectiveSign,
      date: prediction?.date || new Date().toISOString(),
      summary: predictionText,
      scores: {
        relationships:
          prediction?.scores?.love || prediction?.scores?.relationships || 84,
        career: prediction?.scores?.career || 76,
        finance: prediction?.scores?.finance || 71,
        wellbeing:
          prediction?.scores?.health || prediction?.scores?.wellbeing || 88,
      },
      luckyNumber,
      luckyColor,
      luckyTime,
      planetaryInfluence:
        prediction?.planetary_influence ||
        "Auspicious planetary alignment provides clarity, emotional harmony, and grounded focus.",
      raw: res.data,
    });
    setIsLoading(false);
  }, [effectiveSign, lang, dateOffset]);

  useEffect(() => {
    fetchHoroscope();
  }, [fetchHoroscope]);

  return { data, isLoading, error, refetch: fetchHoroscope };
}

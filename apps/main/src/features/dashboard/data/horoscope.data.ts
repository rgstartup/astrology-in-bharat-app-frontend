import type { HoroscopeData } from "../hooks/usePersonalHoroscope";

export const DEFAULT_HOROSCOPE_SCORES = {
  relationships: 82,
  career: 74,
  finance: 68,
  wellbeing: 89,
};

export const DEFAULT_HOROSCOPE_DATA: HoroscopeData = {
  sign: "gemini",
  date: new Date().toISOString(),
  summary:
    "A balanced day full of thoughtful decisions, positive communication, and opportunities for mindful progress.",
  scores: DEFAULT_HOROSCOPE_SCORES,
  luckyNumber: 7,
  luckyColor: "Emerald Green",
  luckyTime: "10:30 AM - 12:00 PM",
  planetaryInfluence:
    "Mercury transits favorable aspects fostering clarity in creative and personal deliberations.",
};

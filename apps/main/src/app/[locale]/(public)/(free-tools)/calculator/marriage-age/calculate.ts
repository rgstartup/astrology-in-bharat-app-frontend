export interface MarriageAgeResult {
  startAge: number;
  endAge: number;
  periodMessage: string;
  strength: number;
  strengthLabel: string;
}

export interface FactorItem {
  label: string;
  desc: string;
  icon: string;
}

export const FACTORS: FactorItem[] = [
  { label: "5th House", desc: "Love & Romance", icon: "fa-solid fa-arrow-trend-up" },
  { label: "7th House", desc: "Marriage & Partner", icon: "fa-regular fa-heart" },
  { label: "Venus Position", desc: "Love & Relationship", icon: "fa-solid fa-venus" },
  { label: "Jupiter Position", desc: "Wisdom & Blessings", icon: "fa-solid fa-jedi" },
  { label: "Planetary Dasha", desc: "Timing & Periods", icon: "fa-solid fa-stopwatch" },
  { label: "Kundli Analysis", desc: "Overall Matching", icon: "fa-solid fa-dharmachakra" },
];

export const REASONS: string[] = [
  "Planetary positions and strengths",
  "Dasha and transit periods",
  "Your karma and past life influence",
  "Cultural and family background",
  "Manglik and other astrological Doshas",
  "Navamsha (D9) chart alignment",
];

export function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export const calculateMarriageAge = (
  name: string,
  dob: string,
  time: string,
  place: string,
  gender: string
): MarriageAgeResult => {
  const seedStr = (name + dob + time + place + gender)
    .toLowerCase()
    .replace(/\s+/g, "");
  const seed = hashSeed(seedStr);

  const baseAge = 24 + (seed % 6); // 24 to 29
  const strength = 75 + (seed % 20); // 75 to 94

  return {
    startAge: baseAge,
    endAge: baseAge + 3,
    periodMessage: "Highly Favourable Period",
    strength,
    strengthLabel: strength >= 85 ? "Strong" : "Good",
  };
};

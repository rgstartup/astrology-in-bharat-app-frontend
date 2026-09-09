export interface ZodiacSign {
  name: string;
  emoji: string;
  element: string;
  dates: string;
}

export interface CompatLabelResult {
  label: string;
  color: string;
  bg: string;
}

export interface ZodiacCompatibilityResult {
  score: number;
  yourIdx: number;
  partnerIdx: number;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: "Aries", emoji: "♈", element: "Fire", dates: "Mar 21 – Apr 19" },
  { name: "Taurus", emoji: "♉", element: "Earth", dates: "Apr 20 – May 20" },
  { name: "Gemini", emoji: "♊", element: "Air", dates: "May 21 – Jun 20" },
  { name: "Cancer", emoji: "♋", element: "Water", dates: "Jun 21 – Jul 22" },
  { name: "Leo", emoji: "♌", element: "Fire", dates: "Jul 23 – Aug 22" },
  { name: "Virgo", emoji: "♍", element: "Earth", dates: "Aug 23 – Sep 22" },
  { name: "Libra", emoji: "♎", element: "Air", dates: "Sep 23 – Oct 22" },
  { name: "Scorpio", emoji: "♏", element: "Water", dates: "Oct 23 – Nov 21" },
  {
    name: "Sagittarius",
    emoji: "♐",
    element: "Fire",
    dates: "Nov 22 – Dec 21",
  },
  {
    name: "Capricorn",
    emoji: "♑",
    element: "Earth",
    dates: "Dec 22 – Jan 19",
  },
  { name: "Aquarius", emoji: "♒", element: "Air", dates: "Jan 20 – Feb 18" },
  { name: "Pisces", emoji: "♓", element: "Water", dates: "Feb 19 – Mar 20" },
];

// Compatibility matrix (index-based, 0=Aries...11=Pisces)
export const COMPAT_MATRIX: number[][] = [
  [95, 55, 70, 50, 90, 60, 75, 65, 85, 55, 70, 60], // Aries
  [55, 95, 55, 75, 65, 85, 70, 60, 55, 90, 55, 75], // Taurus
  [70, 55, 95, 55, 75, 60, 85, 55, 75, 55, 90, 60], // Gemini
  [50, 75, 55, 95, 55, 70, 55, 85, 55, 65, 55, 90], // Cancer
  [90, 65, 75, 55, 95, 55, 80, 70, 85, 55, 65, 55], // Leo
  [60, 85, 60, 70, 55, 95, 55, 65, 60, 85, 55, 70], // Virgo
  [75, 70, 85, 55, 80, 55, 95, 55, 75, 65, 85, 55], // Libra
  [65, 60, 55, 85, 70, 65, 55, 95, 55, 75, 55, 85], // Scorpio
  [85, 55, 75, 55, 85, 60, 75, 55, 95, 55, 75, 55], // Sagittarius
  [55, 90, 55, 65, 55, 85, 65, 75, 55, 95, 55, 75], // Capricorn
  [70, 55, 90, 55, 65, 55, 85, 55, 75, 55, 95, 60], // Aquarius
  [60, 75, 60, 90, 55, 70, 55, 85, 55, 75, 60, 95], // Pisces
];

export const ELEMENT_COLORS: Record<string, string> = {
  Fire: "text-red-500 bg-red-50 border-red-200",
  Earth: "text-green-600 bg-green-50 border-green-200",
  Air: "text-blue-500 bg-blue-50 border-blue-200",
  Water: "text-indigo-500 bg-indigo-50 border-indigo-200",
};

export const getCompatLabel = (score: number): CompatLabelResult => {
  if (score >= 85)
    return {
      label: "Excellent",
      color: "text-green-600",
      bg: "bg-green-50 border-green-200",
    };
  if (score >= 70)
    return {
      label: "Good",
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
    };
  if (score >= 55)
    return {
      label: "Average",
      color: "text-yellow-600",
      bg: "bg-yellow-50 border-yellow-200",
    };
  return {
    label: "Challenging",
    color: "text-red-500",
    bg: "bg-red-50 border-red-200",
  };
};

export const calculateZodiacCompatibility = (
  yourSign: string,
  partnerSign: string
): ZodiacCompatibilityResult => {
  const yourIdx = ZODIAC_SIGNS.findIndex((z) => z.name === yourSign);
  const partnerIdx = ZODIAC_SIGNS.findIndex((z) => z.name === partnerSign);
  const score = COMPAT_MATRIX[yourIdx]?.[partnerIdx] ?? 60;

  return {
    score,
    yourIdx: yourIdx >= 0 ? yourIdx : 0,
    partnerIdx: partnerIdx >= 0 ? partnerIdx : 0,
  };
};

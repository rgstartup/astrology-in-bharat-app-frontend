export interface NakshatraItem {
  name: string;
  lord: string;
  symbol: string;
  trait: string;
}

export interface NakshatraResult {
  index: number;
  nakshatra: NakshatraItem;
}

export const NAKSHATRAS: NakshatraItem[] = [
  { name: "Ashwini", lord: "Ketu", symbol: "Horse Head", trait: "Swift, energetic, pioneering spirit. Natural healer and initiator." },
  { name: "Bharani", lord: "Venus", symbol: "Yoni", trait: "Creative, determined, passionate. Strong sense of justice." },
  { name: "Krittika", lord: "Sun", symbol: "Razor/Flame", trait: "Sharp, courageous, purifying. Natural leader with fiery energy." },
  { name: "Rohini", lord: "Moon", symbol: "Chariot", trait: "Charming, creative, materialistic. Fertile and growth-oriented." },
  { name: "Mrigashira", lord: "Mars", symbol: "Deer Head", trait: "Gentle, curious, searching soul. Love for travel and exploration." },
  { name: "Ardra", lord: "Rahu", symbol: "Teardrop", trait: "Intense, transformative, intellectually sharp. Seeks truth." },
  { name: "Punarvasu", lord: "Jupiter", symbol: "Quiver of Arrows", trait: "Optimistic, nurturing, generous. Bounces back from adversity." },
  { name: "Pushya", lord: "Saturn", symbol: "Lotus", trait: "Nourishing, devoted, protective. The most auspicious nakshatra." },
  { name: "Ashlesha", lord: "Mercury", symbol: "Serpent", trait: "Penetrating mind, shrewd, mysterious. Deep intuition." },
  { name: "Magha", lord: "Ketu", symbol: "Throne", trait: "Regal, proud, ancestral. Strong connection to lineage and power." },
  { name: "Purva Phalguni", lord: "Venus", symbol: "Hammock", trait: "Charming, creative, love of beauty and pleasure." },
  { name: "Uttara Phalguni", lord: "Sun", symbol: "Bed", trait: "Service-oriented, friendly, reliable. Brings prosperity." },
  { name: "Hasta", lord: "Moon", symbol: "Hand", trait: "Skilled, humorous, resourceful. Excellent craftsman energy." },
  { name: "Chitra", lord: "Mars", symbol: "Pearl/Gem", trait: "Artistic, magnetic, perfectionistic. Love of beauty." },
  { name: "Swati", lord: "Rahu", symbol: "Young Plant", trait: "Independent, diplomatic, flexible. Like a grass in wind." },
  { name: "Vishakha", lord: "Jupiter", symbol: "Triumphal Arch", trait: "Goal-oriented, ambitious, determined. Focused on achievement." },
  { name: "Anuradha", lord: "Saturn", symbol: "Lotus", trait: "Devoted, friendly, organizational skills. Succeeds in groups." },
  { name: "Jyeshtha", lord: "Mercury", symbol: "Circular Amulet", trait: "Protective, responsible, eldest sibling energy. Occult interest." },
  { name: "Mula", lord: "Ketu", symbol: "Root/Bunch of Roots", trait: "Investigative, transformative, goes to the root of things." },
  { name: "Purva Ashadha", lord: "Venus", symbol: "Elephant Tusk", trait: "Invincible, proud, early victories. Strong persuasive power." },
  { name: "Uttara Ashadha", lord: "Sun", symbol: "Elephant Tusk", trait: "Righteous, responsible, universal appeal. Long-lasting success." },
  { name: "Shravana", lord: "Moon", symbol: "Ear/Three Footprints", trait: "Listener, learner, connects people. Knowledge and media." },
  { name: "Dhanishtha", lord: "Mars", symbol: "Drum", trait: "Abundant, musical, group-oriented. Wealth and prosperity." },
  { name: "Shatabhisha", lord: "Rahu", symbol: "Circle/Empty Circle", trait: "Healing, secretive, unique. Seeks solitude and mysticism." },
  { name: "Purva Bhadrapada", lord: "Jupiter", symbol: "Sword/Two-faced Man", trait: "Intense, idealistic, passionate. Transforms through fire." },
  { name: "Uttara Bhadrapada", lord: "Saturn", symbol: "Twins/Back Legs of Funeral Cot", trait: "Wise, disciplined, deeply spiritual. Gains through patience." },
  { name: "Revati", lord: "Mercury", symbol: "Fish/Drum", trait: "Nurturing, compassionate, journey-completion. Gentle soul." },
];

export const calculateNakshatra = (dob: string): number => {
  if (!dob) return 0;
  const d = new Date(dob);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  // Simple deterministic hash based on date
  const hash = (day * 7 + month * 13 + (year % 100) * 3) % 27;
  return hash;
};

export const getNakshatraResult = (dob: string): NakshatraResult => {
  const idx = calculateNakshatra(dob);
  return {
    index: idx,
    nakshatra: NAKSHATRAS[idx] || NAKSHATRAS[0]!,
  };
};

export interface NumberMeaning {
  title: string;
  desc: string;
  traits: string[];
}

export interface NameNumerologyResult {
  number: number;
  total: number;
  meaning: NumberMeaning;
}

export const letterValue = (ch: string): number => {
  const c = ch.toUpperCase();
  if (!/[A-Z]/.test(c)) return 0;
  if ("AJS".includes(c)) return 1;
  if ("BKT".includes(c)) return 2;
  if ("CLU".includes(c)) return 3;
  if ("DMV".includes(c)) return 4;
  if ("ENW".includes(c)) return 5;
  if ("FOX".includes(c)) return 6;
  if ("GPY".includes(c)) return 7;
  if ("HQZ".includes(c)) return 8;
  if ("IR".includes(c)) return 9;
  return 0;
};

export const reduceNumber = (n: number): number => {
  let current = n;
  while (current > 9 && current !== 11 && current !== 22) {
    current = String(current)
      .split("")
      .reduce((a, d) => a + Number(d), 0);
  }
  return current;
};

export const NUMBER_MEANINGS: Record<number, NumberMeaning> = {
  1:  { title: "The Leader",       desc: "Independent, original, and ambitious.",       traits: ["Leadership", "Independence", "Innovation"] },
  2:  { title: "The Diplomat",     desc: "Cooperative, sensitive, and harmonious.",      traits: ["Harmony", "Cooperation", "Empathy"] },
  3:  { title: "The Creative",     desc: "Expressive, joyful, and communicative.",       traits: ["Creativity", "Expression", "Joy"] },
  4:  { title: "The Builder",      desc: "Practical, hardworking, and dependable.",      traits: ["Discipline", "Stability", "Loyalty"] },
  5:  { title: "The Explorer",     desc: "Adventurous, versatile, and freedom-loving.",  traits: ["Freedom", "Adventure", "Versatility"] },
  6:  { title: "The Nurturer",     desc: "Responsible, loving, and protective.",         traits: ["Compassion", "Responsibility", "Love"] },
  7:  { title: "The Seeker",       desc: "Analytical, introspective, and spiritual.",    traits: ["Wisdom", "Intuition", "Analysis"] },
  8:  { title: "The Powerhouse",   desc: "Ambitious, authoritative, and goal-driven.",   traits: ["Power", "Success", "Abundance"] },
  9:  { title: "The Humanitarian", desc: "Compassionate, generous, and idealistic.",     traits: ["Generosity", "Wisdom", "Compassion"] },
  11: { title: "The Illuminator",  desc: "Highly intuitive, inspiring, and visionary.",  traits: ["Intuition", "Vision", "Inspiration"] },
  22: { title: "Master Builder",   desc: "Manifests grand visions into reality.",        traits: ["Mastery", "Vision", "Legacy"] },
};

export const calculateNameNumerology = (name: string): NameNumerologyResult => {
  let total = 0;
  for (const ch of name) total += letterValue(ch);
  const reduced = reduceNumber(total);

  return {
    number: reduced,
    total,
    meaning: NUMBER_MEANINGS[reduced] || NUMBER_MEANINGS[1]!,
  };
};

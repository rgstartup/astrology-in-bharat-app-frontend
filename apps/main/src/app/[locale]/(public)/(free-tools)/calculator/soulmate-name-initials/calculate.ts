export interface CalculationBasisItem {
  title: string;
  desc: string;
  icon: string;
}

export const CALCULATION_BASIS: CalculationBasisItem[] = [
  { title: "Numerology", desc: "Your name numbers and vibrations", icon: "fa-solid fa-1" },
  { title: "Birth Date", desc: "Your life path and destiny number", icon: "fa-regular fa-calendar" },
  { title: "Letters Energy", desc: "Alphabet energy and cosmic frequency", icon: "fa-solid fa-a" },
  { title: "Planetary Influence", desc: "Planet positions and their effects", icon: "fa-solid fa-earth-americas" },
];

export const SPECIAL_FEATURES: string[] = [
  "100% Personalized Calculation",
  "Advanced Numerology Algorithm",
  "Based on Vedic Principles",
  "High Accuracy & Reliability",
];

export function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export const calculateSoulmateInitials = (
  name: string,
  dob: string,
  gender: string = "male"
): string[] => {
  const seedStr = (name + dob + gender).toLowerCase().replace(/\s+/g, "");
  const seed = hashSeed(seedStr);

  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const initials: string[] = [];

  let currSeed = seed;
  while (initials.length < 5) {
    currSeed = hashSeed(currSeed.toString() + "next");
    const char = ALPHABET[currSeed % 26]!;
    if (!initials.includes(char)) {
      initials.push(char);
    }
  }

  return initials;
};

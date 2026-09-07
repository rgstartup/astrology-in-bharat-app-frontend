"use client";

import { useState, useMemo } from "react";

export type ZodiacSign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

export type ElementType = "Fire" | "Earth" | "Air" | "Water";

export type LuckyResult = {
  luckyNumber: number;
  luckyColor: string;
  secondaryColor: string;
  luckyDay: string;
  element: ElementType;
  dobNumber: number;
  nameNumber: number;
  message: string;
};

export const SIGNS: ZodiacSign[] = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const elementBySign = (sign: ZodiacSign): ElementType => {
  if (["Aries", "Leo", "Sagittarius"].includes(sign)) return "Fire";
  if (["Taurus", "Virgo", "Capricorn"].includes(sign)) return "Earth";
  if (["Gemini", "Libra", "Aquarius"].includes(sign)) return "Air";
  return "Water";
};

const normalizeName = (name: string) =>
  name.toLowerCase().trim().replace(/\s+/g, "").replace(/[^a-z]/g, "");

const stableSeedHash31 = (key: string): number => {
  let seed = 0;
  for (let i = 0; i < key.length; i++) {
    seed = seed * 31 + key.charCodeAt(i);
    seed = seed >>> 0;
  }
  return seed;
};

const reduceToSingleDigit = (n: number) => {
  while (n > 9) {
    n = String(n).split("").reduce((a, d) => a + Number(d), 0);
  }
  return n === 0 ? 1 : n;
};

const dobToDigitsSum = (dob: string) => {
  const digits = dob.replace(/[^0-9]/g, "");
  return digits.split("").reduce((a, d) => a + Number(d), 0);
};

const pythagoreanMap: Record<string, number> = {
  A: 1, J: 1, S: 1, B: 2, K: 2, T: 2, C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4, E: 5, N: 5, W: 5, F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7, H: 8, Q: 8, Z: 8, I: 9, R: 9,
};

const nameToNumber = (name: string) => {
  const cleaned = normalizeName(name).toUpperCase();
  let sum = 0;
  for (let i = 0; i < cleaned.length; i++) {
    sum += pythagoreanMap[cleaned[i]!] || 0;
  }
  return reduceToSingleDigit(sum);
};

const elementColorPools: Record<ElementType, string[]> = {
  Fire: ["Red", "Orange", "Gold", "Coral", "Amber"],
  Earth: ["Green", "Olive", "Brown", "Beige", "Forest Green"],
  Air: ["Sky Blue", "White", "Silver", "Mint", "Lavender"],
  Water: ["Blue", "Teal", "Sea Green", "Aqua", "Indigo"],
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const getElementMessage = (element: ElementType) => {
  if (element === "Fire") return "Your energy is bold and confident today. Use your lucky color to attract attention and positive action.";
  if (element === "Earth") return "Stability is your strength. Your lucky color supports calm decisions and steady progress.";
  if (element === "Air") return "Your mind is sharp and social. This lucky color boosts communication and clarity.";
  return "Your intuition is strong. This lucky color helps emotional balance and good vibes.";
};

export const useLuckyVibes = () => {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [zodiac, setZodiac] = useState<ZodiacSign>("Gemini");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LuckyResult | null>(null);

  const canCalculate = useMemo(() => fullName.trim().length > 0 && dob.trim().length > 0 && zodiac.trim().length > 0, [fullName, dob, zodiac]);

  const calculate = async () => {
    if (!canCalculate) return;
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 650));

    const element = elementBySign(zodiac);
    const combinedKey = `${normalizeName(fullName)}|${dob.trim()}|${zodiac.trim()}`;
    const seed = stableSeedHash31(combinedKey);
    const dobNumber = reduceToSingleDigit(dobToDigitsSum(dob));
    const nameNumber = nameToNumber(fullName);

    const raw = seed + dobNumber * 10 + nameNumber * 7;
    let luckyNumber = (raw % 9) + 1;
    if (element === "Fire" && luckyNumber % 2 === 0) luckyNumber = luckyNumber === 9 ? 1 : luckyNumber + 1;
    if (element === "Water" && luckyNumber === 9) luckyNumber = 7;

    const pool = elementColorPools[element];
    const luckyColor = pool[seed % pool.length]!;
    let secondaryColor = pool[(seed + nameNumber) % pool.length]!;
    if (secondaryColor === luckyColor) secondaryColor = pool[(seed + nameNumber + 1) % pool.length]!;

    setResult({
      luckyNumber,
      luckyColor,
      secondaryColor,
      luckyDay: days[(seed + dobNumber) % 7]!,
      element,
      dobNumber,
      nameNumber,
      message: getElementMessage(element),
    });
    setLoading(false);
  };

  return { fullName, setFullName, dob, setDob, zodiac, setZodiac, loading, result, canCalculate, calculate };
};

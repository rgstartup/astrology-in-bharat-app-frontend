"use client";

import { useMemo, useState } from "react";
import { ElementType, ZodiacSign, CompatibilityResult } from "@/lib/types/calculator";

export const SIGNS: ZodiacSign[] = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const signToElement = (sign: ZodiacSign): ElementType => {
  if (["Aries", "Leo", "Sagittarius"].includes(sign)) return "Fire";
  if (["Taurus", "Virgo", "Capricorn"].includes(sign)) return "Earth";
  if (["Gemini", "Libra", "Aquarius"].includes(sign)) return "Air";
  return "Water";
};


const hashSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const getBaseRange = (a: ElementType, b: ElementType) => {
  if (a === b) return { min: 80, max: 100 };
  const best = (a === "Fire" && b === "Air") || (a === "Air" && b === "Fire") || (a === "Earth" && b === "Water") || (a === "Water" && b === "Earth");
  if (best) return { min: 70, max: 95 };
  const challenging = (a === "Earth" && b === "Air") || (a === "Air" && b === "Earth") || (a === "Water" && b === "Fire") || (a === "Fire" && b === "Water");
  if (challenging) return { min: 40, max: 70 };
  return { min: 55, max: 85 };
};

const getCategory = (p: number) => {
  if (p <= 55) return "Challenging Match";
  if (p <= 70) return "Average Match";
  if (p <= 85) return "Good Match";
  return "Excellent Match";
};

const getMessage = (p: number) => {
  if (p <= 55) return "This match needs patience and emotional maturity. If you both communicate clearly, it can still work beautifully.";
  if (p <= 70) return "Good potential, but small misunderstandings may happen. With trust and effort, this bond can become stronger.";
  if (p <= 85) return "Strong compatibility! You both naturally support each other’s energy and mindset. A stable and happy connection is possible.";
  return "Excellent match! Your connection feels effortless, romantic, and balanced. Long-term potential looks very strong.";
};

const buildStrengthsChallenges = (yourElement: ElementType, partnerElement: ElementType, percentage: number) => {
  const strengths: string[] = [];
  const challenges: string[] = [];
  if (percentage >= 86) {
    strengths.push("Natural chemistry and emotional flow", "Strong long-term bonding potential", "High mutual respect and attraction");
    challenges.push("Avoid taking each other for granted", "Stay consistent during busy phases");
  } else if (percentage >= 71) {
    strengths.push("Supportive energy and stable connection", "Good balance between emotions and logic", "Trust can grow naturally over time");
    challenges.push("Small ego clashes may appear sometimes", "Overthinking can create confusion");
  } else if (percentage >= 56) {
    strengths.push("There is potential to build a strong bond", "Good learning and growth experience", "Connection improves with communication");
    challenges.push("Misunderstandings can happen easily", "One may feel emotionally unheard at times");
  } else {
    strengths.push("Strong attraction can still exist", "You can learn patience and maturity together", "A fresh approach can improve the bond");
    challenges.push("Clashes may happen due to different nature", "Emotional reactions may create distance");
  }
  const pair = `${yourElement}-${partnerElement}`;
  if (pair.includes("Fire") && pair.includes("Air")) strengths.unshift("Exciting energy, fun communication, and strong spark");
  if (pair.includes("Earth") && pair.includes("Water")) strengths.unshift("Emotional security + stability creates strong bonding");
  if (pair.includes("Fire") && pair.includes("Water")) challenges.unshift("Emotions vs actions can create mood swings");
  if (pair.includes("Earth") && pair.includes("Air")) challenges.unshift("Practical vs logical thinking may feel mismatched");
  return { strengths, challenges };
};

export const useZodiacCompatibility = () => {
  const [yourSign, setYourSign] = useState<ZodiacSign>("Leo");
  const [partnerSign, setPartnerSign] = useState<ZodiacSign>("Libra");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  const pairKey = useMemo(() => `${yourSign}|${partnerSign}`, [yourSign, partnerSign]);

  const handleSwap = () => {
    setYourSign(partnerSign);
    setPartnerSign(yourSign);
    setResult(null);
  };

  const calculate = async () => {
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 650));

    const yourElement = signToElement(yourSign);
    const partnerElement = signToElement(partnerSign);
    const { min, max } = getBaseRange(yourElement, partnerElement);
    const seed = hashSeed(pairKey);
    const percentage = min + (seed % (max - min + 1));
    const trust = clamp(percentage + ((seed % 11) - 5), 40, 100);
    const romance = clamp(percentage + (((seed >> 2) % 11) - 5), 40, 100);
    const communication = clamp(percentage + (((seed >> 4) % 11) - 5), 40, 100);

    const { strengths, challenges } = buildStrengthsChallenges(yourElement, partnerElement, percentage);

    setResult({
      percentage,
      category: getCategory(percentage),
      message: getMessage(percentage),
      trust,
      romance,
      communication,
      strengths,
      challenges,
      yourElement,
      partnerElement,
    });
    setLoading(false);
  };

  return {
    yourSign, setYourSign, partnerSign, setPartnerSign,
    loading, result, handleSwap, calculate
  };
};

"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaArrowRight as FaAr,
  FaSpinner as FaSp,
  FaExchangeAlt as FaEx,
  FaChevronRight as FaCr,
} from "react-icons/fa";

import { TbCrystalBall as TbCb } from "react-icons/tb";
import { GiLotus as GiL, GiSparkles as GiSpark } from "react-icons/gi";

import CalculatorHero from "./common/hero";

const FaArrowRight = FaAr as unknown as React.FC<{ size?: number; className?: string }>;
const FaSpinner = FaSp as unknown as React.FC<{ size?: number; className?: string }>;
const FaExchangeAlt = FaEx as unknown as React.FC<{ size?: number; className?: string }>;
const FaChevronRight = FaCr as unknown as React.FC<{ size?: number; className?: string }>;

const TbCrystalBall = TbCb as unknown as React.FC<{ size?: number; className?: string }>;
const GiLotus = GiL as unknown as React.FC<{ size?: number; className?: string }>;
const GiSparkles = GiSpark as unknown as React.FC<{ size?: number; className?: string }>;

type ElementType = "Fire" | "Earth" | "Air" | "Water";

type ZodiacSign =
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

type CompatibilityResult = {
  percentage: number;
  category: string;
  message: string;
  trust: number;
  romance: number;
  communication: number;
  strengths: string[];
  challenges: string[];
  yourElement: ElementType;
  partnerElement: ElementType;
};

const premiumCardStyles = `
  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(48, 17, 24, 0.1);
  }
  .text-burgundy { color: #301118; }
  .bg-burgundy { background-color: #301118; }
  .border-burgundy { border-color: #301118; }

  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow { animation: spin-slow 20s linear infinite; }
`;

const SIGNS: ZodiacSign[] = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const signToElement = (sign: ZodiacSign): ElementType => {
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
  // Same element
  if (a === b) return { min: 80, max: 100 };

  // Best natural matches
  const best =
    (a === "Fire" && b === "Air") ||
    (a === "Air" && b === "Fire") ||
    (a === "Earth" && b === "Water") ||
    (a === "Water" && b === "Earth");

  if (best) return { min: 70, max: 95 };

  // Challenging matches
  const challenging =
    (a === "Earth" && b === "Air") ||
    (a === "Air" && b === "Earth") ||
    (a === "Water" && b === "Fire") ||
    (a === "Fire" && b === "Water");

  if (challenging) return { min: 40, max: 70 };

  // Medium matches
  return { min: 55, max: 85 };
};

const getCategory = (p: number) => {
  if (p <= 55) return "Challenging Match";
  if (p <= 70) return "Average Match";
  if (p <= 85) return "Good Match";
  return "Excellent Match";
};

const getMessage = (p: number) => {
  if (p <= 55) {
    return "This match needs patience and emotional maturity. If you both communicate clearly, it can still work beautifully.";
  }
  if (p <= 70) {
    return "Good potential, but small misunderstandings may happen. With trust and effort, this bond can become stronger.";
  }
  if (p <= 85) {
    return "Strong compatibility! You both naturally support each other’s energy and mindset. A stable and happy connection is possible.";
  }
  return "Excellent match! Your connection feels effortless, romantic, and balanced. Long-term potential looks very strong.";
};

const buildStrengthsChallenges = (
  yourElement: ElementType,
  partnerElement: ElementType,
  percentage: number
) => {
  const strengths: string[] = [];
  const challenges: string[] = [];

  // Generic strengths based on score
  if (percentage >= 86) {
    strengths.push("Natural chemistry and emotional flow");
    strengths.push("Strong long-term bonding potential");
    strengths.push("High mutual respect and attraction");
    challenges.push("Avoid taking each other for granted");
    challenges.push("Stay consistent during busy phases");
  } else if (percentage >= 71) {
    strengths.push("Supportive energy and stable connection");
    strengths.push("Good balance between emotions and logic");
    strengths.push("Trust can grow naturally over time");
    challenges.push("Small ego clashes may appear sometimes");
    challenges.push("Overthinking can create confusion");
  } else if (percentage >= 56) {
    strengths.push("There is potential to build a strong bond");
    strengths.push("Good learning and growth experience");
    strengths.push("Connection improves with communication");
    challenges.push("Misunderstandings can happen easily");
    challenges.push("One may feel emotionally unheard at times");
  } else {
    strengths.push("Strong attraction can still exist");
    strengths.push("You can learn patience and maturity together");
    strengths.push("A fresh approach can improve the bond");
    challenges.push("Clashes may happen due to different nature");
    challenges.push("Emotional reactions may create distance");
  }

  // Element-specific flavor
  const pair = `${yourElement}-${partnerElement}`;
  if (pair.includes("Fire") && pair.includes("Air")) {
    strengths.unshift("Exciting energy, fun communication, and strong spark");
  }
  if (pair.includes("Earth") && pair.includes("Water")) {
    strengths.unshift("Emotional security + stability creates strong bonding");
  }
  if (pair.includes("Fire") && pair.includes("Water")) {
    challenges.unshift("Emotions vs actions can create mood swings");
  }
  if (pair.includes("Earth") && pair.includes("Air")) {
    challenges.unshift("Practical vs logical thinking may feel mismatched");
  }

  return { strengths, challenges };
};

const ZodiacCompatibilityCalculator: React.FC = () => {
  const [yourSign, setYourSign] = useState<ZodiacSign>("Leo");
  const [partnerSign, setPartnerSign] = useState<ZodiacSign>("Libra");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const pairKey = useMemo(() => {
    // deterministic but order matters for UI; logic uses both signs anyway
    return `${yourSign}|${partnerSign}`;
  }, [yourSign, partnerSign]);

  const handleSwap = () => {
    setYourSign(partnerSign);
    setPartnerSign(yourSign);
    setResult(null);
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();

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

    const category = getCategory(percentage);
    const message = getMessage(percentage);

    const { strengths, challenges } = buildStrengthsChallenges(yourElement, partnerElement, percentage);

    setResult({
      percentage,
      category,
      message,
      trust,
      romance,
      communication,
      strengths,
      challenges,
      yourElement,
      partnerElement,
    });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] selection:bg-primary/20">
      <style dangerouslySetInnerHTML={{ __html: premiumCardStyles }} />

      {/* Hero */}
      <CalculatorHero
        badgeText="Sign Based Compatibility"
        titleMain="Zodiac"
        titleAccent="Compatibility"
        paragraph="Choose both zodiac signs to get a deterministic compatibility percentage, category, and mini love scores."
      />

      {/* Form */}
      <section className="py-24 relative overflow-hidden">
        <div className="container px-6">
          <div className="glass-card rounded-[3rem] p-8 md:p-16 shadow-[0_20px_50px_rgba(48,17,24,0.1)] border-t-4 border-t-primary/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
              <GiLotus size={150} />
            </div>

            <div className="text-center mb-10">
              <h2 className="text-xl md:text-3xl font-black text-burgundy mb-2 tracking-tight">
                Zodiac Sign <span className="text-primary">Compatibility</span>
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-2"></div>
            </div>

            <form onSubmit={handleCalculate} className="max-w-4xl mx-auto">
              <div className="glass-card rounded-[2.5rem] p-6 md:p-10 shadow-[0_15px_40px_rgba(48,17,24,0.08)] border border-burgundy/5 relative overflow-hidden bg-white">
                <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-end">
                  {/* Your sign */}
                  <div>
                    <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                      Your Zodiac Sign
                    </label>
                    <select
                      value={yourSign}
                      onChange={(e) => setYourSign(e.target.value as ZodiacSign)}
                      style={{ borderRadius: "9999px" }}
                      className="w-full mt-2 bg-white border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-black focus:border-primary outline-none transition-all shadow-sm text-sm"
                    >
                      {SIGNS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <p className="m-0 mt-3 text-xs text-gray-400 italic">
                      Element: <span className="font-black">{signToElement(yourSign)}</span>
                    </p>
                  </div>

                  {/* Swap */}
                  <div className="flex justify-center md:justify-center">
                    <button
                      type="button"
                      onClick={handleSwap}
                      style={{ borderRadius: "9999px" }}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] border border-orange-100 hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      <FaExchangeAlt size={14} />
                      Swap
                    </button>
                  </div>

                  {/* Partner sign */}
                  <div>
                    <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                      Partner Zodiac Sign
                    </label>
                    <select
                      value={partnerSign}
                      onChange={(e) => setPartnerSign(e.target.value as ZodiacSign)}
                      style={{ borderRadius: "9999px" }}
                      className="w-full mt-2 bg-white border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-black focus:border-primary outline-none transition-all shadow-sm text-sm"
                    >
                      {SIGNS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <p className="m-0 mt-3 text-xs text-gray-400 italic">
                      Element: <span className="font-black">{signToElement(partnerSign)}</span>
                    </p>
                  </div>
                </div>

                {/* Button */}
                <div className="text-center mt-10">
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ borderRadius: "9999px" }}
                    className="relative group inline-flex items-center gap-3 bg-red-600 text-white px-10 py-4 font-black uppercase tracking-[2px] text-xs hover:bg-red-700 transition-all duration-500 shadow-xl disabled:opacity-50"
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : <TbCrystalBall size={18} />}
                    {loading ? "Calculating..." : "Check Compatibility"}
                    <FaArrowRight className="opacity-70 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="mt-6 flex justify-center">
                  <div className="w-full h-2 bg-red-500/20 rounded-full blur-lg translate-y-2 opacity-50"></div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Result */}
      <div ref={resultsRef}>
        {result && (
          <section className="py-24 bg-white relative overflow-hidden">
            <div className="container px-6">
              <div className="max-w-6xl mx-auto">
                <div className="glass-card rounded-[3.5rem] p-8 md:p-16 shadow-[0_30px_70px_rgba(48,17,24,0.15)] border border-burgundy/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                    <GiLotus size={300} className="animate-spin-slow" />
                  </div>

                  <div className="relative z-10">
                    <div className="text-center mb-16">
                      <span className="inline-block bg-primary/10 text-primary px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-[3px] mb-8">
                        Compatibility Result
                      </span>

                      <h2 className="text-4xl md:text-6xl font-black text-burgundy mb-6 tracking-tight">
                        {yourSign} <span className="text-primary">+</span> {partnerSign}
                      </h2>

                      <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-10"></div>

                      <div className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-[12px] font-black uppercase tracking-widest bg-burgundy text-white shadow-lg">
                        {result.category}
                        <FaChevronRight size={12} className="opacity-60" />
                        <span className="text-[#d4af37]">
                          {result.yourElement} + {result.partnerElement}
                        </span>
                      </div>
                    </div>

                    {/* Main Ring */}
                    <div className="flex flex-col items-center mb-14">
                      <div className="relative mb-10">
                        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white shadow-2xl flex items-center justify-center p-8 border-8 border-orange-50 relative group">
                          <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent animate-spin-slow opacity-20"></div>

                          <div className="text-center">
                            <span className="block text-7xl md:text-9xl font-black text-burgundy leading-none group-hover:scale-110 transition-transform duration-500">
                              {result.percentage}
                              <span className="text-4xl text-primary">%</span>
                            </span>
                            <span className="text-[12px] font-black uppercase tracking-[4px] text-primary mt-4 block">
                              Compatibility
                            </span>
                          </div>

                          <GiSparkles className="absolute -top-4 -right-4 text-primary text-5xl animate-bounce shadow-xl" />
                        </div>
                      </div>

                      {/* Message */}
                      <div className="max-w-3xl text-center">
                        <div className="bg-burgundy text-white p-10 rounded-[3rem] shadow-2xl relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary p-4 rounded-2xl shadow-lg">
                            <TbCrystalBall size={28} />
                          </div>

                          <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90 m-0">
                            "{result.message}"
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Mini Scores */}
                    <div className="grid md:grid-cols-3 gap-8 mb-14">
                      {[
                        { label: "Trust", value: result.trust },
                        { label: "Romance", value: result.romance },
                        { label: "Communication", value: result.communication },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="bg-[#fff9f6] rounded-[2.5rem] p-8 border border-orange-100 shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <p className="m-0 text-xs font-black uppercase tracking-widest text-gray-400">
                              {item.label}
                            </p>
                            <p className="m-0 text-sm font-black text-burgundy">{item.value}%</p>
                          </div>

                          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-700"
                              style={{ width: `${item.value}%` }}
                            />
                          </div>

                          <p className="m-0 mt-4 text-xs text-gray-500 italic">
                            Balanced score based on your compatibility range.
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Strengths & Challenges */}
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-orange-50">
                        <h3 className="text-xl font-black text-burgundy mb-6">
                          Strengths
                        </h3>
                        <ul className="space-y-3 m-0 p-0 list-none">
                          {result.strengths.map((s, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-sm text-gray-600"
                            >
                              <span className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                              <span className="italic">{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-orange-50">
                        <h3 className="text-xl font-black text-burgundy mb-6">
                          Challenges
                        </h3>
                        <ul className="space-y-3 m-0 p-0 list-none">
                          {result.challenges.map((c, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-sm text-gray-600"
                            >
                              <span className="mt-1 w-2 h-2 rounded-full bg-burgundy flex-shrink-0" />
                              <span className="italic">{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Footer Badge */}
                    <div className="mt-14 flex justify-center">
                      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-orange-100">
                        <span className="text-[10px] font-black uppercase tracking-[4px] text-primary">
                          Deterministic Result • Same Signs = Same Output
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ZodiacCompatibilityCalculator;



"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaArrowRight as FaAr,
  FaSpinner as FaSp,
  FaPalette as FaPal,
  FaHashtag as FaHash,
  FaCalendarAlt as FaCal,
} from "react-icons/fa";

import { TbCrystalBall as TbCb } from "react-icons/tb";
import { GiLotus as GiL, GiSparkles as GiSpark } from "react-icons/gi";

import CalculatorHero from "./common/hero";

const FaArrowRight = FaAr as unknown as React.FC<{ size?: number; className?: string }>;
const FaSpinner = FaSp as unknown as React.FC<{ size?: number; className?: string }>;
const FaPalette = FaPal as unknown as React.FC<{ size?: number; className?: string }>;
const FaHashtag = FaHash as unknown as React.FC<{ size?: number; className?: string }>;
const FaCalendarAlt = FaCal as unknown as React.FC<{ size?: number; className?: string }>;

const TbCrystalBall = TbCb as unknown as React.FC<{ size?: number; className?: string }>;
const GiLotus = GiL as unknown as React.FC<{ size?: number; className?: string }>;
const GiSparkles = GiSpark as unknown as React.FC<{ size?: number; className?: string }>;

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

type ElementType = "Fire" | "Earth" | "Air" | "Water";

type LuckyResult = {
  luckyNumber: number; // 1–9
  luckyColor: string;
  secondaryColor: string;
  luckyDay: string;
  element: ElementType;
  dobNumber: number;
  nameNumber: number;
  message: string;
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

const elementBySign = (sign: ZodiacSign): ElementType => {
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
    seed = seed >>> 0; // keep unsigned 32-bit
  }
  return seed;
};

const reduceToSingleDigit = (n: number) => {
  // keep 11/22 optional? (you asked optional, but output wants 1–9)
  // We'll reduce strictly to 1–9 for this calculator.
  while (n > 9) {
    n = String(n)
      .split("")
      .reduce((a, d) => a + Number(d), 0);
  }
  return n === 0 ? 1 : n;
};

const dobToDigitsSum = (dob: string) => {
  // dob format: YYYY-MM-DD
  const digits = dob.replace(/[^0-9]/g, "");
  const sum = digits.split("").reduce((a, d) => a + Number(d), 0);
  return sum;
};

const pythagoreanMap: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

const nameToNumber = (name: string) => {
  const cleaned = normalizeName(name).toUpperCase();
  let sum = 0;
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    sum += pythagoreanMap[ch as string] || 0;
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
  if (element === "Fire")
    return "Your energy is bold and confident today. Use your lucky color to attract attention and positive action.";
  if (element === "Earth")
    return "Stability is your strength. Your lucky color supports calm decisions and steady progress.";
  if (element === "Air")
    return "Your mind is sharp and social. This lucky color boosts communication and clarity.";
  return "Your intuition is strong. This lucky color helps emotional balance and good vibes.";
};

const LuckyColorNumberCalculator: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [zodiac, setZodiac] = useState<ZodiacSign>("Gemini");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LuckyResult | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const canCalculate = useMemo(() => {
    return fullName.trim().length > 0 && dob.trim().length > 0 && zodiac.trim().length > 0;
  }, [fullName, dob, zodiac]);

  const combinedKey = useMemo(() => {
    const n = normalizeName(fullName);
    const d = dob.trim();
    const z = zodiac.trim();
    return `${n}|${d}|${z}`;
  }, [fullName, dob, zodiac]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) return;

    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 650));

    const element = elementBySign(zodiac);

    // Step 2 seed
    const seed = stableSeedHash31(combinedKey);

    // Step 3 DOB number
    const dobSum = dobToDigitsSum(dob);
    const dobNumber = reduceToSingleDigit(dobSum);

    // Step 4 Name number
    const nameNumber = nameToNumber(fullName);

    // Step 6 Lucky number
    const raw = seed + dobNumber * 10 + nameNumber * 7;
    let luckyNumber = (raw % 9) + 1;

    // Optional element adjustment
    if (element === "Fire") {
      if (luckyNumber % 2 === 0) luckyNumber = luckyNumber === 9 ? 1 : luckyNumber + 1;
    }
    if (element === "Water") {
      if (luckyNumber === 9) luckyNumber = 7;
    }

    // Step 7 Lucky colors
    const pool = elementColorPools[element];
    const luckyColor = pool[seed % pool.length];

    let secondaryColor = pool[(seed + nameNumber) % pool.length];
    if (secondaryColor === luckyColor) {
      secondaryColor = pool[(seed + nameNumber + 1) % pool.length];
    }

    // Step 8 Lucky day
    const luckyDay = days[(seed + dobNumber) % 7];

    const message = getElementMessage(element);

    setResult({
      luckyNumber,
      luckyColor: luckyColor!,
      secondaryColor: secondaryColor!,
      luckyDay: luckyDay!,
      element,
      dobNumber,
      nameNumber,
      message,
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
        badgeText="Lucky Vibes Generator"
        titleMain="Lucky"
        titleAccent="Color & Number"
        paragraph="Enter your name, date of birth, and zodiac sign to get your lucky number, colors, and lucky day."
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
                Lucky Color <span className="text-primary">&</span> Lucky Number
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-2"></div>
            </div>

            <form onSubmit={handleCalculate} className="max-w-4xl mx-auto">
              <div className="glass-card rounded-[2.5rem] p-6 md:p-10 shadow-[0_15px_40px_rgba(48,17,24,0.08)] border border-burgundy/5 relative overflow-hidden bg-white space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                      Full Name (Required)
                    </label>
                    <input
                      type="text"
                      required
                      style={{ borderRadius: "9999px" }}
                      className="w-full mt-2 bg-[#fdf2f2] border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-red-500 outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                      placeholder="Type your full name..."
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  {/* DOB */}
                  <div>
                    <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                      Date of Birth (Required)
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="date"
                        required
                        style={{ borderRadius: "9999px" }}
                        className="w-full bg-white border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-primary outline-none transition-all shadow-sm text-sm"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-burgundy/30">
                        <FaCalendarAlt size={14} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Zodiac */}
                <div>
                  <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                    Zodiac Sign (Required)
                  </label>
                  <select
                    value={zodiac}
                    onChange={(e) => setZodiac(e.target.value as ZodiacSign)}
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
                    Element: <span className="font-black">{elementBySign(zodiac)}</span>
                  </p>
                </div>

                {/* Button */}
                <div className="text-center pt-4">
                  <button
                    type="submit"
                    disabled={loading || !canCalculate}
                    style={{ borderRadius: "9999px" }}
                    className="relative group inline-flex items-center gap-3 bg-red-600 text-white px-10 py-4 font-black uppercase tracking-[2px] text-xs hover:bg-red-700 transition-all duration-500 shadow-xl disabled:opacity-50"
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : <TbCrystalBall size={18} />}
                    {loading ? "Generating..." : "Get Lucky Results"}
                    <FaArrowRight className="opacity-70 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <div className="w-full h-2 bg-red-500/20 rounded-full blur-lg translate-y-2 opacity-50"></div>
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
                        Lucky Results
                      </span>

                      <h2 className="text-4xl md:text-6xl font-black text-burgundy mb-6 tracking-tight">
                        Your <span className="text-primary">Lucky</span> Vibes
                      </h2>

                      <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-16"></div>
                    </div>

                    {/* Lucky Number Ring */}
                    <div className="flex flex-col items-center mb-14">
                      <div className="relative mb-10">
                        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white shadow-2xl flex items-center justify-center p-8 border-8 border-orange-50 relative group">
                          <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent animate-spin-slow opacity-20"></div>

                          <div className="text-center">
                            <span className="block text-7xl md:text-9xl font-black text-burgundy leading-none group-hover:scale-110 transition-transform duration-500">
                              {result.luckyNumber}
                            </span>
                            <span className="text-[12px] font-black uppercase tracking-[4px] text-primary mt-4 block">
                              Lucky Number
                            </span>
                          </div>

                          <FaHashtag className="absolute -top-4 -right-4 text-primary text-5xl animate-bounce shadow-xl" />
                        </div>
                      </div>

                      {/* Message */}
                      <div className="max-w-3xl text-center">
                        <div className="bg-burgundy text-white p-10 rounded-[3rem] shadow-2xl relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary p-4 rounded-2xl shadow-lg">
                            <GiSparkles size={28} />
                          </div>

                          <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90 m-0">
                            "{result.message}"
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cards */}
                    <div className="grid md:grid-cols-3 gap-8">
                      {/* Lucky Color */}
                      <div className="bg-[#fff9f6] rounded-[2.5rem] p-8 border border-orange-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <FaPalette className="text-primary" size={20} />
                          </div>
                          <div>
                            <p className="m-0 text-xs font-black uppercase tracking-widest text-gray-400">
                              Lucky Color
                            </p>
                            <p className="m-0 text-xl font-black text-burgundy">{result.luckyColor}</p>
                          </div>
                        </div>

                        <p className="m-0 text-sm text-gray-500 italic">
                          Secondary: <span className="font-black text-burgundy">{result.secondaryColor}</span>
                        </p>
                      </div>

                      {/* Lucky Day */}
                      <div className="bg-[#fff9f6] rounded-[2.5rem] p-8 border border-orange-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <FaCalendarAlt className="text-primary" size={20} />
                          </div>
                          <div>
                            <p className="m-0 text-xs font-black uppercase tracking-widest text-gray-400">
                              Lucky Day
                            </p>
                            <p className="m-0 text-xl font-black text-burgundy">{result.luckyDay}</p>
                          </div>
                        </div>

                        <p className="m-0 text-sm text-gray-500 italic">
                          Element: <span className="font-black text-burgundy">{result.element}</span>
                        </p>
                      </div>

                      {/* Numerology */}
                      <div className="bg-[#fff9f6] rounded-[2.5rem] p-8 border border-orange-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <TbCrystalBall className="text-primary" size={22} />
                          </div>
                          <div>
                            <p className="m-0 text-xs font-black uppercase tracking-widest text-gray-400">
                              Numerology Base
                            </p>
                            <p className="m-0 text-xl font-black text-burgundy">DOB + Name</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="px-4 py-2 rounded-full bg-white border border-orange-100 text-[10px] font-black uppercase tracking-widest text-burgundy">
                            DOB Number: {result.dobNumber}
                          </span>
                          <span className="px-4 py-2 rounded-full bg-white border border-orange-100 text-[10px] font-black uppercase tracking-widest text-burgundy">
                            Name Number: {result.nameNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer badge */}
                    <div className="mt-14 flex justify-center">
                      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-orange-100">
                        <span className="text-[10px] font-black uppercase tracking-[4px] text-primary">
                          Deterministic • Same Input = Same Lucky Result
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

export default LuckyColorNumberCalculator;

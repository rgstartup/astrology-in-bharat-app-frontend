"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaHeart as FaH,
  FaUser as FaU,
  FaArrowRight as FaAr,
  FaSpinner as FaSp,
  FaFire as FaFi,
} from "react-icons/fa";

import { TbCrystalBall as TbCb } from "react-icons/tb";
import { GiLotus as GiL, GiSparkles as GiSpark } from "react-icons/gi";

import CalculatorHero from "./common/hero";

const FaHeart = FaH as unknown as React.FC<{ size?: number; className?: string }>;
const FaUser = FaU as unknown as React.FC<{ size?: number; className?: string }>;
const FaArrowRight = FaAr as unknown as React.FC<{ size?: number; className?: string }>;
const FaSpinner = FaSp as unknown as React.FC<{ size?: number; className?: string }>;
const FaFire = FaFi as unknown as React.FC<{ size?: number; className?: string }>;

const TbCrystalBall = TbCb as unknown as React.FC<{ size?: number; className?: string }>;
const GiLotus = GiL as unknown as React.FC<{ size?: number; className?: string }>;
const GiSparkles = GiSpark as unknown as React.FC<{ size?: number; className?: string }>;

type FlamesLetter = "F" | "L" | "A" | "M" | "E" | "S";

type FlamesResult = {
  letter: FlamesLetter;
  word: string;
  count: number;
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

const normalizeName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "") // remove spaces
    .replace(/[^a-z0-9]/g, ""); // remove special chars
};

const flamesMap: Record<FlamesLetter, { word: string; message: string }> = {
  F: {
    word: "Friends",
    message: "Strong friendship vibes. Best support system for each other.",
  },
  L: {
    word: "Love",
    message: "Romantic energy is high. This match can turn serious.",
  },
  A: {
    word: "Affection",
    message: "Caring and emotional bonding is strong between you two.",
  },
  M: {
    word: "Marriage",
    message: "Long-term potential is strong. Family-style bonding is seen.",
  },
  E: {
    word: "Enemy",
    message: "Too many clashes. Better to avoid ego fights and misunderstandings.",
  },
  S: {
    word: "Sister",
    message: "Pure bond and respect. More like a protective connection.",
  },
};

// Remove common letters one-by-one matching
const getRemainingLetterCount = (boy: string, girl: string): number => {
  const boyArr = boy.split("");
  const girlArr = girl.split("");

  for (let i = 0; i < boyArr.length; i++) {
    const ch = boyArr[i];
    const idx = girlArr.indexOf(ch);
    if (idx !== -1) {
      // remove from both
      boyArr[i] = "";
      girlArr[idx] = "";
    }
  }

  const remainingBoy = boyArr.filter(Boolean).length;
  const remainingGirl = girlArr.filter(Boolean).length;

  return remainingBoy + remainingGirl;
};

// Circular elimination using count
const getFlamesLetter = (count: number): FlamesLetter => {
  let flames: FlamesLetter[] = ["F", "L", "A", "M", "E", "S"];

  // Edge case: if count is 0, treat as 1 to avoid infinite loop
  let step = count === 0 ? 1 : count;

  while (flames.length > 1) {
    const removeIndex = (step - 1) % flames.length;
    flames.splice(removeIndex, 1);
    flames = [...flames.slice(removeIndex), ...flames.slice(0, removeIndex)];
  }

  return flames[0];
};

const FlamesCalculator: React.FC = () => {
  const [boyName, setBoyName] = useState<string>("");
  const [girlName, setGirlName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<FlamesResult | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const normalized = useMemo(() => {
    return {
      boy: normalizeName(boyName),
      girl: normalizeName(girlName),
    };
  }, [boyName, girlName]);

  const canCalculate = useMemo(() => {
    return normalized.boy.length > 0 && normalized.girl.length > 0;
  }, [normalized.boy, normalized.girl]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) return;

    setLoading(true);
    setResult(null);

    // premium feel
    await new Promise((r) => setTimeout(r, 650));

    const count = getRemainingLetterCount(normalized.boy, normalized.girl);
    const letter = getFlamesLetter(count);
    const word = flamesMap[letter].word;
    const message = flamesMap[letter].message;

    setResult({ letter, word, count, message });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] selection:bg-[#fd6410]/20">
      <style dangerouslySetInnerHTML={{ __html: premiumCardStyles }} />

      {/* Reusable Hero */}
      <CalculatorHero
        badgeText="Classic FLAMES Match"
        titleMain="FLAMES"
        titleAccent="Calculator"
        paragraph="Enter two names and discover your fun FLAMES destiny using the classic elimination method."
      />

      {/* Form Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container px-6">
          <div className="glass-card rounded-[3rem] p-8 md:p-16 shadow-[0_20px_50px_rgba(48,17,24,0.1)] border-t-4 border-t-[#fd6410]/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
              <GiLotus size={150} />
            </div>

            <div className="text-center mb-10">
              <h2 className="text-xl md:text-3xl font-black text-burgundy mb-2 tracking-tight">
                Find Your <span className="text-[#fd6410]">FLAMES</span> Result
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#fd6410] to-transparent mx-auto mt-2"></div>
            </div>

            <form onSubmit={handleCalculate} className="max-w-3xl mx-auto">
              <div className="glass-card rounded-[2.5rem] p-6 md:p-10 shadow-[0_15px_40px_rgba(48,17,24,0.08)] border border-burgundy/5 relative overflow-hidden bg-white">
                <div className="flex flex-col md:flex-row items-center gap-0 md:gap-4 relative">
                  {/* Boy */}
                  <div className="flex-1 w-full space-y-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                        Boy Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          style={{ borderRadius: "9999px" }}
                          className="w-full bg-[#fdf2f2] border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-red-500 outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                          placeholder="Type boy name..."
                          value={boyName}
                          onChange={(e) => setBoyName(e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-burgundy/30">
                          <FaUser size={14} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden md:flex flex-col items-center justify-center px-4 relative h-full self-stretch">
                    <div className="w-[1px] bg-gray-100 h-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-9 h-9 bg-white rounded-full shadow-md border border-burgundy/5 flex items-center justify-center">
                        <FaHeart className="text-red-500" size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="md:hidden flex items-center justify-center py-6">
                    <div className="w-9 h-9 bg-white rounded-full shadow-md border border-burgundy/5 flex items-center justify-center">
                      <FaHeart className="text-red-500" size={14} />
                    </div>
                  </div>

                  {/* Girl */}
                  <div className="flex-1 w-full space-y-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                        Girl Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          style={{ borderRadius: "9999px" }}
                          className="w-full bg-[#fdf2f2] border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-red-500 outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                          placeholder="Type girl name..."
                          value={girlName}
                          onChange={(e) => setGirlName(e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-burgundy/30">
                          <FaUser size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-10">
                  <button
                    type="submit"
                    disabled={loading || !canCalculate}
                    style={{ borderRadius: "9999px" }}
                    className="relative group inline-flex items-center gap-3 bg-red-600 text-white px-10 py-4 font-black uppercase tracking-[2px] text-xs hover:bg-red-700 transition-all duration-500 shadow-xl disabled:opacity-50"
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <TbCrystalBall size={18} />
                    )}
                    {loading ? "Calculating..." : "Calculate FLAMES"}
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

      {/* Result Section */}
      <div ref={resultsRef}>
        {result && (
          <section className="py-24 bg-white relative overflow-hidden">
            <div className="container px-6">
              <div className="max-w-5xl mx-auto">
                <div className="glass-card rounded-[3.5rem] p-8 md:p-16 shadow-[0_30px_70px_rgba(48,17,24,0.15)] border border-burgundy/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                    <GiLotus size={300} className="animate-spin-slow" />
                  </div>

                  <div className="relative z-10">
                    <div className="text-center mb-16">
                      <span className="inline-block bg-[#fd6410]/10 text-[#fd6410] px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-[3px] mb-8">
                        FLAMES Result
                      </span>

                      <h2 className="text-4xl md:text-6xl font-black text-burgundy mb-6 tracking-tight">
                        Your <span className="text-[#fd6410]">{result.word}</span>
                      </h2>

                      <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#fd6410] to-transparent mx-auto mb-16"></div>
                    </div>

                    <div className="flex flex-col items-center">
                      {/* Result Ring */}
                      <div className="relative mb-16">
                        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white shadow-2xl flex items-center justify-center p-8 border-8 border-orange-50 relative group">
                          <div className="absolute inset-0 rounded-full border-8 border-[#fd6410] border-t-transparent animate-spin-slow opacity-20"></div>

                          <div className="text-center">
                            <span className="block text-7xl md:text-9xl font-black text-burgundy leading-none group-hover:scale-110 transition-transform duration-500">
                              {result.letter}
                            </span>
                            <span className="text-[12px] font-black uppercase tracking-[4px] text-[#fd6410] mt-4 block">
                              {result.word}
                            </span>
                          </div>

                          <FaFire className="absolute -top-4 -right-4 text-[#fd6410] text-5xl animate-bounce shadow-xl" />
                        </div>
                      </div>

                      {/* Message */}
                      <div className="max-w-2xl text-center mb-14">
                        <div className="bg-burgundy text-white p-10 rounded-[3rem] shadow-2xl relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fd6410] p-4 rounded-2xl shadow-lg">
                            <GiSparkles size={28} />
                          </div>

                          <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90 m-0">
                            "{result.message}"
                          </p>

                          <p className="text-xs text-orange-100/50 font-bold uppercase tracking-[3px] mt-6 m-0">
                            Remaining Letters Count: <span className="text-white">{result.count}</span>
                          </p>
                        </div>
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

export default FlamesCalculator;

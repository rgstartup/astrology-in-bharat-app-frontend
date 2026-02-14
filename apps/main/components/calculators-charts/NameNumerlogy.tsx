"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaUser as FaU,
  FaArrowRight as FaAr,
  FaSpinner as FaSp,
  FaStar as FaS,
} from "react-icons/fa";

import { TbCrystalBall as TbCb } from "react-icons/tb";
import { GiLotus as GiL, GiSparkles as GiSpark } from "react-icons/gi";

import CalculatorHero from "./common/hero";

const FaUser = FaU as unknown as React.FC<{ size?: number; className?: string }>;
const FaArrowRight = FaAr as unknown as React.FC<{ size?: number; className?: string }>;
const FaSpinner = FaSp as unknown as React.FC<{ size?: number; className?: string }>;
const FaStar = FaS as unknown as React.FC<{ size?: number; className?: string }>;

const TbCrystalBall = TbCb as unknown as React.FC<{ size?: number; className?: string }>;
const GiLotus = GiL as unknown as React.FC<{ size?: number; className?: string }>;
const GiSparkles = GiSpark as unknown as React.FC<{ size?: number; className?: string }>;

type NameNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 22;

type NameResult = {
  nameNumber: NameNumber;
  vibe: string;
  totalBeforeReduce: number;
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

const vibeMap: Record<number, string> = {
  1: "Leader",
  2: "Calm",
  3: "Creative",
  4: "Practical",
  5: "Energetic",
  6: "Caring",
  7: "Deep thinker",
  8: "Ambitious",
  9: "Helpful",
  11: "Visionary (Master)",
  22: "Master Builder",
};

const isMasterNumber = (n: number) => n === 11 || n === 22;

// A–Z to 1–9 (Pythagorean)
const letterValue = (ch: string): number => {
  const c = ch.toUpperCase();
  if (!/[A-Z]/.test(c)) return 0;

  // 1: A J S
  if ("AJS".includes(c)) return 1;
  // 2: B K T
  if ("BKT".includes(c)) return 2;
  // 3: C L U
  if ("CLU".includes(c)) return 3;
  // 4: D M V
  if ("DMV".includes(c)) return 4;
  // 5: E N W
  if ("ENW".includes(c)) return 5;
  // 6: F O X
  if ("FOX".includes(c)) return 6;
  // 7: G P Y
  if ("GPY".includes(c)) return 7;
  // 8: H Q Z
  if ("HQZ".includes(c)) return 8;
  // 9: I R
  if ("IR".includes(c)) return 9;

  return 0;
};

const sumDigits = (n: number): number => {
  return String(n)
    .split("")
    .reduce((acc, d) => acc + Number(d), 0);
};

const reduceNumber = (n: number): NameNumber => {
  let current = n;

  while (current > 9 && !isMasterNumber(current)) {
    current = sumDigits(current);
  }

  // final must be 1–9 or master
  return current as NameNumber;
};

const NameNumerologyCalculator: React.FC = () => {
  const [fullName, setFullName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<NameResult | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const normalizedName = useMemo(() => {
    return fullName.trim();
  }, [fullName]);

  const canCalculate = useMemo(() => {
    return normalizedName.length > 0;
  }, [normalizedName]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) return;

    setLoading(true);
    setResult(null);

    // premium feel
    await new Promise((r) => setTimeout(r, 650));

    // Sum values of all letters
    let total = 0;
    for (const ch of normalizedName) {
      total += letterValue(ch);
    }

    const reduced = reduceNumber(total);
    const vibe = vibeMap[reduced] || "Balanced";

    setResult({
      nameNumber: reduced,
      vibe,
      totalBeforeReduce: total,
    });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] selection:bg-[#fd6410]/20">
      <style dangerouslySetInnerHTML={{ __html: premiumCardStyles }} />

      {/* Hero */}
      <CalculatorHero
        badgeText="Pythagorean Numerology"
        titleMain="Name"
        titleAccent="Numerology"
        paragraph="Enter your full name to reveal your Name Number and your personality vibe based on classic Pythagorean numerology."
      />

      {/* Form */}
      <section className="py-24 relative overflow-hidden">
        <div className="container px-6">
          <div className="glass-card rounded-[3rem] p-8 md:p-16 shadow-[0_20px_50px_rgba(48,17,24,0.1)] border-t-4 border-t-[#fd6410]/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
              <GiLotus size={150} />
            </div>

            <div className="text-center mb-10">
              <h2 className="text-xl md:text-3xl font-black text-burgundy mb-2 tracking-tight">
                Find Your <span className="text-[#fd6410]">Name Number</span>
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#fd6410] to-transparent mx-auto mt-2"></div>
            </div>

            <form onSubmit={handleCalculate} className="max-w-3xl mx-auto">
              <div className="glass-card rounded-[2.5rem] p-6 md:p-10 shadow-[0_15px_40px_rgba(48,17,24,0.08)] border border-burgundy/5 relative overflow-hidden bg-white space-y-6">
                {/* Full Name */}
                <div>
                  <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                    Full Name (Required)
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="text"
                      required
                      style={{ borderRadius: "9999px" }}
                      className="w-full bg-[#fdf2f2] border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-red-500 outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                      placeholder="Type your full name..."
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-burgundy/30">
                      <FaUser size={14} />
                    </div>
                  </div>

                  <p className="m-0 mt-3 text-xs text-gray-400 italic">
                    Only letters are counted. Spaces and symbols are ignored.
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
                    {loading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <TbCrystalBall size={18} />
                    )}
                    {loading ? "Calculating..." : "Calculate Name Number"}
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
              <div className="max-w-5xl mx-auto">
                <div className="glass-card rounded-[3.5rem] p-8 md:p-16 shadow-[0_30px_70px_rgba(48,17,24,0.15)] border border-burgundy/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                    <GiLotus size={300} className="animate-spin-slow" />
                  </div>

                  <div className="relative z-10">
                    <div className="text-center mb-16">
                      <span className="inline-block bg-[#fd6410]/10 text-[#fd6410] px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-[3px] mb-8">
                        Your Numerology Result
                      </span>

                      <h2 className="text-4xl md:text-6xl font-black text-burgundy mb-6 tracking-tight">
                        Name <span className="text-[#fd6410]">Number</span>
                      </h2>

                      <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#fd6410] to-transparent mx-auto mb-16"></div>
                    </div>

                    <div className="flex flex-col items-center">
                      {/* Ring */}
                      <div className="relative mb-16">
                        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white shadow-2xl flex items-center justify-center p-8 border-8 border-orange-50 relative group">
                          <div className="absolute inset-0 rounded-full border-8 border-[#fd6410] border-t-transparent animate-spin-slow opacity-20"></div>

                          <div className="text-center">
                            <span className="block text-7xl md:text-9xl font-black text-burgundy leading-none group-hover:scale-110 transition-transform duration-500">
                              {result.nameNumber}
                            </span>
                            <span className="text-[12px] font-black uppercase tracking-[4px] text-[#fd6410] mt-4 block">
                              Your vibe: {result.vibe}
                            </span>
                          </div>

                          <FaStar className="absolute -top-4 -right-4 text-[#fd6410] text-5xl animate-bounce shadow-xl" />
                        </div>
                      </div>

                      {/* Message */}
                      <div className="max-w-2xl text-center">
                        <div className="bg-burgundy text-white p-10 rounded-[3rem] shadow-2xl relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fd6410] p-4 rounded-2xl shadow-lg">
                            <GiSparkles size={28} />
                          </div>

                          <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90 m-0">
                            Your vibe:{" "}
                            <span className="font-black text-white">
                              {result.vibe}
                            </span>
                          </p>

                          <p className="m-0 mt-6 text-sm text-orange-100/60 italic">
                            Total letters score:{" "}
                            <span className="font-black text-white">
                              {result.totalBeforeReduce}
                            </span>
                          </p>

                          <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-[4px] text-orange-100/70">
                              Pythagorean Numerology System
                            </span>
                          </div>
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

export default NameNumerologyCalculator;

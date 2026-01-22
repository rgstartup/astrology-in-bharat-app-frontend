"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaUser as FaU,
  FaArrowRight as FaAr,
  FaSpinner as FaSp,
  FaRing as FaR,
  FaRegCalendarAlt as FaCal,
} from "react-icons/fa";

import { TbCrystalBall as TbCb } from "react-icons/tb";
import { GiLotus as GiL, GiSparkles as GiSpark } from "react-icons/gi";

import CalculatorHero from "./common/hero";

const FaUser = FaU as unknown as React.FC<{ size?: number; className?: string }>;
const FaArrowRight = FaAr as unknown as React.FC<{ size?: number; className?: string }>;
const FaSpinner = FaSp as unknown as React.FC<{ size?: number; className?: string }>;
const FaRing = FaR as unknown as React.FC<{ size?: number; className?: string }>;
const FaCalendar = FaCal as unknown as React.FC<{ size?: number; className?: string }>;

const TbCrystalBall = TbCb as unknown as React.FC<{ size?: number; className?: string }>;
const GiLotus = GiL as unknown as React.FC<{ size?: number; className?: string }>;
const GiSparkles = GiSpark as unknown as React.FC<{ size?: number; className?: string }>;

type MarriageResult = {
  startAge: number;
  endAge: number;
  bestYear: number;
  hasDob: boolean;
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
  return name.trim().toLowerCase();
};

const hashSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getBirthYearFromDob = (dob: string): number | null => {
  // dob expected "YYYY-MM-DD"
  if (!dob) return null;
  const year = Number(dob.split("-")[0]);
  if (!year || Number.isNaN(year)) return null;
  return year;
};

const MarriageAgeCalculator: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [dob, setDob] = useState<string>(""); // optional
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<MarriageResult | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const normalizedName = useMemo(() => normalizeName(name), [name]);

  const canCalculate = useMemo(() => {
    return normalizedName.length > 0;
  }, [normalizedName]);

  const stableKey = useMemo(() => {
    // key = name + "|" + dob(optional)
    const safeDob = dob ? dob : "";
    return `${normalizedName}|${safeDob}`;
  }, [normalizedName, dob]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) return;

    setLoading(true);
    setResult(null);

    // premium feel
    await new Promise((r) => setTimeout(r, 650));

    const seed = hashSeed(stableKey);

    // startAge = 22 + (seed % 8) -> 22–29
    const startAge = 22 + (seed % 8);

    // endAge = startAge + 2 + (seed % 3) -> +2 to +4
    const endAge = startAge + 2 + (seed % 3);

    const currentYear = new Date().getFullYear();
    const birthYear = getBirthYearFromDob(dob);

    let bestYear = currentYear + (seed % 5); // default if no dob
    let hasDob = false;

    if (birthYear) {
      hasDob = true;
      // bestYear = birthYear + startAge + (seed % 2)
      bestYear = birthYear + startAge + (seed % 2);
    }

    setResult({ startAge, endAge, bestYear, hasDob });

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
        badgeText="Entertainment Prediction"
        titleMain="Marriage"
        titleAccent="Age Calculator"
        paragraph="Enter your name and optionally your DOB to get a fun marriage age window and best year prediction."
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
                Find Your <span className="text-[#fd6410]">Marriage Window</span>
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#fd6410] to-transparent mx-auto mt-2"></div>
            </div>

            <form onSubmit={handleCalculate} className="max-w-3xl mx-auto">
              <div className="glass-card rounded-[2.5rem] p-6 md:p-10 shadow-[0_15px_40px_rgba(48,17,24,0.08)] border border-burgundy/5 relative overflow-hidden bg-white space-y-6">
                {/* Name */}
                <div>
                  <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                    Name (Required)
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="text"
                      required
                      style={{ borderRadius: "9999px" }}
                      className="w-full bg-[#fdf2f2] border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-red-500 outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                      placeholder="Type your name..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-burgundy/30">
                      <FaUser size={14} />
                    </div>
                  </div>
                </div>

                {/* DOB Optional */}
                <div>
                  <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                    DOB (Optional)
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="date"
                      style={{ borderRadius: "9999px" }}
                      className="w-full bg-white border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-[#fd6410] outline-none transition-all shadow-sm text-sm"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-burgundy/30">
                      <FaCalendar size={14} />
                    </div>
                  </div>

                  <p className="m-0 mt-3 text-xs text-gray-400 italic">
                    Tip: Adding DOB gives a more personalized best year.
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
                    {loading ? "Predicting..." : "Calculate Marriage Age"}
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
                        Your Prediction
                      </span>

                      <h2 className="text-4xl md:text-6xl font-black text-burgundy mb-6 tracking-tight">
                        Marriage <span className="text-[#fd6410]">Window</span>
                      </h2>

                      <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#fd6410] to-transparent mx-auto mb-16"></div>
                    </div>

                    <div className="flex flex-col items-center">
                      {/* Ring */}
                      <div className="relative mb-16">
                        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white shadow-2xl flex items-center justify-center p-8 border-8 border-orange-50 relative group">
                          <div className="absolute inset-0 rounded-full border-8 border-[#fd6410] border-t-transparent animate-spin-slow opacity-20"></div>

                          <div className="text-center">
                            <span className="block text-5xl md:text-7xl font-black text-burgundy leading-none group-hover:scale-110 transition-transform duration-500">
                              {result.startAge}–{result.endAge}
                            </span>
                            <span className="text-[12px] font-black uppercase tracking-[4px] text-[#fd6410] mt-4 block">
                              Age Window
                            </span>
                          </div>

                          <FaRing className="absolute -top-4 -right-4 text-[#fd6410] text-5xl animate-bounce shadow-xl" />
                        </div>
                      </div>

                      {/* Text Results */}
                      <div className="max-w-2xl text-center">
                        <div className="bg-burgundy text-white p-10 rounded-[3rem] shadow-2xl relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fd6410] p-4 rounded-2xl shadow-lg">
                            <GiSparkles size={28} />
                          </div>

                          <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90 m-0">
                            Your marriage window:{" "}
                            <span className="font-black text-white">
                              {result.startAge}–{result.endAge}
                            </span>
                          </p>

                          <p className="text-lg md:text-xl font-light italic leading-relaxed text-orange-100/80 mt-6 m-0">
                            Best year:{" "}
                            <span className="font-black text-white">
                              {result.bestYear}
                            </span>
                          </p>

                          <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-[4px] text-orange-100/70">
                              For fun & entertainment only
                            </span>
                          </div>

                          {!result.hasDob && (
                            <p className="m-0 mt-6 text-xs text-orange-100/50 italic">
                              Note: Add DOB for a more personalized best year.
                            </p>
                          )}
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

export default MarriageAgeCalculator;

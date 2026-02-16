"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaHeartBroken as FaHB,
  FaHeart as FaH,
  FaArrowRight as FaAr,
  FaSpinner as FaSp,
  FaUser as FaU,
} from "react-icons/fa";

import { TbCrystalBall as TbCb } from "react-icons/tb";
import { GiLotus as GiL, GiSparkles as GiSpark } from "react-icons/gi";

import CalculatorHero from "./common/hero";

const FaHeartBroken = FaHB as unknown as React.FC<{ size?: number; className?: string }>;
const FaHeart = FaH as unknown as React.FC<{ size?: number; className?: string }>;
const FaArrowRight = FaAr as unknown as React.FC<{ size?: number; className?: string }>;
const FaSpinner = FaSp as unknown as React.FC<{ size?: number; className?: string }>;
const FaUser = FaU as unknown as React.FC<{ size?: number; className?: string }>;

const TbCrystalBall = TbCb as unknown as React.FC<{ size?: number; className?: string }>;
const GiLotus = GiL as unknown as React.FC<{ size?: number; className?: string }>;
const GiSparkles = GiSpark as unknown as React.FC<{ size?: number; className?: string }>;

type Result = {
  patchup: number; // 40–90
  breakup: number; // 5–60
  advice: string;
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

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const normalizeName = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z]/g, "");
};

const hashSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getAdvice = (patchup: number) => {
  if (patchup >= 70) return "Small issues can be fixed easily. Talk calmly.";
  if (patchup >= 50) return "Mixed phase. Communication will decide the future.";
  return "Emotions may clash. Give space and avoid ego fights.";
};

const BreakupPatchupCalculator: React.FC = () => {
  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");

  // required but not used in logic
  const [yourAge, setYourAge] = useState<string>("");
  const [partnerAge, setPartnerAge] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const canCalculate = useMemo(() => {
    return (
      yourName.trim().length > 0 &&
      partnerName.trim().length > 0 &&
      yourAge.trim().length > 0 &&
      partnerAge.trim().length > 0
    );
  }, [yourName, partnerName, yourAge, partnerAge]);

  const stableKey = useMemo(() => {
    const n1 = normalizeName(yourName);
    const n2 = normalizeName(partnerName);
    return [n1, n2].sort().join("|");
  }, [yourName, partnerName]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) return;

    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 650));

    const seed = hashSeed(stableKey);

    const patchup = (seed % 51) + 40; // 40–90
    const breakup = clamp(100 - patchup + ((seed % 11) - 5), 5, 60); // 5–60

    const advice = getAdvice(patchup);

    setResult({ patchup, breakup, advice });

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
        badgeText="Fun Relationship Insight"
        titleMain="Breakup"
        titleAccent="Patchup"
        paragraph="Enter both names and ages to reveal breakup vs patchup chances with quick advice."
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
                Breakup vs <span className="text-primary">Patchup</span> Chance
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-2"></div>
            </div>

            <form onSubmit={handleCalculate} className="max-w-4xl mx-auto">
              <div className="glass-card rounded-[2.5rem] p-6 md:p-10 shadow-[0_15px_40px_rgba(48,17,24,0.08)] border border-burgundy/5 relative overflow-hidden bg-white space-y-6">
                {/* Names */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                      Your Name
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="text"
                        required
                        style={{ borderRadius: "9999px" }}
                        className="w-full bg-[#fdf2f2] border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-red-500 outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                        placeholder="Type your name..."
                        value={yourName}
                        onChange={(e) => setYourName(e.target.value)}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-burgundy/30">
                        <FaUser size={14} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                      Partner Name
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="text"
                        required
                        style={{ borderRadius: "9999px" }}
                        className="w-full bg-[#fdf2f2] border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-red-500 outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                        placeholder="Type partner name..."
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-burgundy/30">
                        <FaUser size={14} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ages */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                      Your Age
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={99}
                      style={{ borderRadius: "9999px" }}
                      className="w-full mt-2 bg-white border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-[#fd6410] outline-none transition-all shadow-sm text-sm"
                      placeholder="e.g. 22"
                      value={yourAge}
                      onChange={(e) => setYourAge(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                      Partner Age
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={99}
                      style={{ borderRadius: "9999px" }}
                      className="w-full mt-2 bg-white border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-[#fd6410] outline-none transition-all shadow-sm text-sm"
                      placeholder="e.g. 24"
                      value={partnerAge}
                      onChange={(e) => setPartnerAge(e.target.value)}
                    />
                  </div>
                </div>

                <p className="m-0 text-center text-xs text-gray-400 italic">
                  Ages are required for form completeness, but the result is calculated from names only.
                </p>

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
                    {loading ? "Calculating..." : "Check Chances"}
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
                      <span className="inline-block bg-primary/10 text-primary px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-[3px] mb-8">
                        Chances Result
                      </span>

                      <h2 className="text-4xl md:text-6xl font-black text-burgundy mb-6 tracking-tight">
                        Breakup / <span className="text-primary">Patchup</span>
                      </h2>

                      <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-16"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                      {/* Patchup */}
                      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-orange-50">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
                            <FaHeart className="text-green-600" size={22} />
                          </div>
                          <div>
                            <p className="m-0 text-xs font-black uppercase tracking-widest text-gray-400">
                              Patchup Chance
                            </p>
                            <h3 className="m-0 text-3xl font-black text-burgundy">
                              {result.patchup}%
                            </h3>
                          </div>
                        </div>

                        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all duration-700"
                            style={{ width: `${result.patchup}%` }}
                          />
                        </div>
                      </div>

                      {/* Breakup */}
                      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-orange-50">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                            <FaHeartBroken className="text-red-600" size={22} />
                          </div>
                          <div>
                            <p className="m-0 text-xs font-black uppercase tracking-widest text-gray-400">
                              Breakup Chance
                            </p>
                            <h3 className="m-0 text-3xl font-black text-burgundy">
                              {result.breakup}%
                            </h3>
                          </div>
                        </div>

                        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full transition-all duration-700"
                            style={{ width: `${result.breakup}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Advice */}
                    <div className="mt-14 text-center">
                      <div className="bg-burgundy text-white p-10 rounded-[3rem] shadow-2xl relative max-w-3xl mx-auto">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary p-4 rounded-2xl shadow-lg">
                          <GiSparkles size={28} />
                        </div>

                        <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90 m-0">
                          "{result.advice}"
                        </p>

                        <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                          <span className="text-[10px] font-black uppercase tracking-[4px] text-orange-100/70">
                            For fun & entertainment only
                          </span>
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

export default BreakupPatchupCalculator;



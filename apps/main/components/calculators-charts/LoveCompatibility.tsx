"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaHeart as FaH,
  FaUser as FaU,
  FaArrowRight as FaAr,
  FaStar as FaS,
  FaBalanceScale as FaBs,
  FaSpinner as FaSp,
} from "react-icons/fa";

import { TbCrystalBall as TbCb } from "react-icons/tb";
import { GiLotus as GiL, GiSparkles as GiSpark } from "react-icons/gi";

import CalculatorHero from "./common/hero";

const FaHeart = FaH as unknown as React.FC<{ size?: number; className?: string }>;
const FaUser = FaU as unknown as React.FC<{ size?: number; className?: string }>;
const FaArrowRight = FaAr as unknown as React.FC<{ size?: number; className?: string }>;
const FaStar = FaS as unknown as React.FC<{ size?: number; className?: string }>;
const FaBalanceScale = FaBs as unknown as React.FC<{ size?: number; className?: string }>;
const FaSpinner = FaSp as unknown as React.FC<{ size?: number; className?: string }>;

const TbCrystalBall = TbCb as unknown as React.FC<{ size?: number; className?: string }>;
const GiLotus = GiL as unknown as React.FC<{ size?: number; className?: string }>;
const GiSparkles = GiSpark as unknown as React.FC<{ size?: number; className?: string }>;

type ResultType = {
  love: number;
  trust: number;
  romance: number;
  communication: number;
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
`;

const normalizeName = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
};

const clamp = (num: number, min: number, max: number) =>
  Math.max(min, Math.min(max, num));

const hashSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // 32-bit
  }
  return Math.abs(hash);
};

const getMessageByLove = (love: number): string => {
  if (love >= 40 && love <= 55) {
    return "This connection has potential. With patience and clear communication, it can grow stronger.";
  }
  if (love >= 56 && love <= 70) {
    return "Good match! You both can build trust and create a stable bond with time.";
  }
  if (love >= 71 && love <= 85) {
    return "Strong compatibility! Emotional understanding and attraction are naturally high.";
  }
  return "Excellent match! Your bond feels deep, supportive, and long-term focused.";
};

type ProgressBarProps = {
  label: string;
  value: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <p className="m-0 text-[11px] font-black uppercase tracking-[3px] text-burgundy/50">
          {label}
        </p>
        <p className="m-0 text-[11px] font-black uppercase tracking-[3px] text-primary">
          {value}%
        </p>
      </div>

      <div className="w-full h-3 rounded-full bg-primary/10 overflow-hidden border border-orange-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

const LoveCompatibilityCalcultor: React.FC = () => {
  const [maleName, setMaleName] = useState<string>("");
  const [femaleName, setFemaleName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ResultType | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  // useMemo: normalized values
  const normalized = useMemo(() => {
    const n1 = normalizeName(maleName);
    const n2 = normalizeName(femaleName);
    return { n1, n2 };
  }, [maleName, femaleName]);

  // useMemo: canCalculate
  const canCalculate = useMemo(() => {
    return normalized.n1.length > 0 && normalized.n2.length > 0;
  }, [normalized.n1, normalized.n2]);

  // useMemo: stable key (swap safe)
  const stableKey = useMemo(() => {
    if (!canCalculate) return "";
    return [normalized.n1, normalized.n2].sort().join("|");
  }, [normalized.n1, normalized.n2, canCalculate]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) return;

    setLoading(true);
    setResult(null);

    // Premium feel (frontend only)
    await new Promise((r) => setTimeout(r, 650));

    const seed = hashSeed(stableKey);

    // Love (40–100)
    const love = (seed % 61) + 40;

    // Subscores close to love
    const trust = clamp(love + ((seed % 21) - 10), 0, 100);
    const romance = clamp(love + (((seed >> 2) % 21) - 10), 0, 100);
    const communication = clamp(love + (((seed >> 4) % 21) - 10), 0, 100);

    const message = getMessageByLove(love);

    setResult({ love, trust, romance, communication, message });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] selection:bg-primary/20">
      <style dangerouslySetInnerHTML={{ __html: premiumCardStyles }} />

      {/* Reusable Hero */}
      <CalculatorHero
        badgeText="Name Based Love Match"
        titleMain="Love"
        titleAccent="Compatibility"
        paragraph="Enter two names and reveal a cosmic love percentage with trust, romance, and communication insights."
      />

      {/* Form Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container px-6">
          <div className="glass-card rounded-[3rem] p-8 md:p-16 shadow-[0_20px_50px_rgba(48,17,24,0.1)] border-t-4 border-t-primary/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
              <GiLotus size={150} />
            </div>

            <div className="text-center mb-10">
              <h2 className="text-xl md:text-3xl font-black text-burgundy mb-2 tracking-tight">
                Find Love{" "}
                <span className="text-red-500 underline decoration-red-100 decoration-2 underline-offset-4">
                  (Percentage)%
                </span>{" "}
                Between
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-2"></div>
            </div>

            <form onSubmit={handleCalculate} className="max-w-3xl mx-auto">
              <div className="glass-card rounded-[2.5rem] p-6 md:p-10 shadow-[0_15px_40px_rgba(48,17,24,0.08)] border border-burgundy/5 relative overflow-hidden bg-white">
                <div className="flex flex-col md:flex-row items-center gap-0 md:gap-4 relative">
                  {/* Male */}
                  <div className="flex-1 w-full space-y-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                        Male Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          style={{ borderRadius: "9999px" }}
                          className="w-full bg-[#fdf2f2] border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-red-500 outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                          placeholder="Type male name..."
                          value={maleName}
                          onChange={(e) => setMaleName(e.target.value)}
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

                  {/* Female */}
                  <div className="flex-1 w-full space-y-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                        Female Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          style={{ borderRadius: "9999px" }}
                          className="w-full bg-[#fdf2f2] border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-red-500 outline-none transition-all placeholder:text-gray-300 shadow-sm text-sm"
                          placeholder="Type female name..."
                          value={femaleName}
                          onChange={(e) => setFemaleName(e.target.value)}
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
                    {loading ? "Calculating..." : "Calculate Love %"}
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
                      <span className="inline-block bg-primary/10 text-primary px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-[3px] mb-8">
                        Match Results
                      </span>

                      <h2 className="text-4xl md:text-6xl font-black text-burgundy mb-6 tracking-tight">
                        Your <span className="text-primary">Love Score</span>
                      </h2>

                      <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-16"></div>
                    </div>

                    <div className="flex flex-col items-center">
                      {/* Love Ring */}
                      <div className="relative mb-16">
                        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white shadow-2xl flex items-center justify-center p-8 border-8 border-orange-50 relative group">
                          <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent animate-spin-slow opacity-20"></div>

                          <div className="text-center">
                            <span className="block text-7xl md:text-9xl font-black text-burgundy leading-none group-hover:scale-110 transition-transform duration-500">
                              {result.love}
                              <span className="text-4xl text-primary">%</span>
                            </span>
                            <span className="text-[12px] font-black uppercase tracking-[4px] text-primary mt-4 block">
                              Cosmic Bond
                            </span>
                          </div>

                          <FaHeart className="absolute -top-4 -right-4 text-pink-500 text-5xl animate-bounce shadow-xl" />
                        </div>
                      </div>

                      {/* Message */}
                      <div className="max-w-2xl text-center mb-14">
                        <div className="bg-burgundy text-white p-10 rounded-[3rem] shadow-2xl relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary p-4 rounded-2xl shadow-lg">
                            <GiSparkles size={28} />
                          </div>

                          <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90 m-0">
                            "{result.message}"
                          </p>
                        </div>
                      </div>

                      {/* Breakdown */}
                      <div className="w-full max-w-3xl bg-[#fff9f6] rounded-[3rem] p-8 md:p-12 border border-orange-100">
                        <div className="flex items-center justify-between mb-10">
                          <h4 className="text-xl font-black text-burgundy tracking-tight m-0">
                            Relationship Breakdown
                          </h4>
                          <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-orange-50 flex items-center gap-2">
                            <FaStar className="text-primary" size={14} />
                            <span className="text-xs font-black text-primary uppercase tracking-widest">
                              Premium Insight
                            </span>
                          </div>
                        </div>

                        <div className="space-y-8">
                          <ProgressBar label="Trust" value={result.trust} />
                          <ProgressBar label="Romance" value={result.romance} />
                          <ProgressBar label="Communication" value={result.communication} />
                        </div>

                        <div className="mt-10 flex items-start gap-4 bg-white rounded-2xl p-6 border border-orange-50 shadow-sm">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <FaBalanceScale size={18} />
                          </div>
                          <div>
                            <p className="m-0 text-sm font-black text-burgundy">
                              Tip to strengthen your bond
                            </p>
                            <p className="m-0 text-sm text-gray-500 italic leading-relaxed">
                              Small efforts daily matter more than big promises. Keep communication honest and consistent.
                            </p>
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

export default LoveCompatibilityCalcultor;

"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaHeart as FaH,
  FaArrowRight as FaAr,
  FaSpinner as FaSp,
  FaUser as FaU,
  FaRegCalendarAlt as FaCal,
  FaShieldAlt as FaShield,
} from "react-icons/fa";

import { TbCrystalBall as TbCb } from "react-icons/tb";
import { GiLotus as GiL, GiSparkles as GiSpark } from "react-icons/gi";

import CalculatorHero from "./common/hero";

const FaHeart = FaH as unknown as React.FC<{ size?: number; className?: string }>;
const FaArrowRight = FaAr as unknown as React.FC<{ size?: number; className?: string }>;
const FaSpinner = FaSp as unknown as React.FC<{ size?: number; className?: string }>;
const FaUser = FaU as unknown as React.FC<{ size?: number; className?: string }>;
const FaCalendar = FaCal as unknown as React.FC<{ size?: number; className?: string }>;
const FaShieldAlt = FaShield as unknown as React.FC<{ size?: number; className?: string }>;

const TbCrystalBall = TbCb as unknown as React.FC<{ size?: number; className?: string }>;
const GiLotus = GiL as unknown as React.FC<{ size?: number; className?: string }>;
const GiSparkles = GiSpark as unknown as React.FC<{ size?: number; className?: string }>;

type LoyaltyResult = {
  loyalty: number; // 50–100
  reason: string;
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

const hashSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const normalizeName = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z]/g, ""); // keep only letters
};

const getReasonByScore = (score: number) => {
  if (score >= 50 && score <= 65) {
    return "Loyal but needs reassurance and clarity.";
  }
  if (score >= 66 && score <= 80) {
    return "Strong loyalty signs. Trust is naturally good.";
  }
  return "Very loyal energy. Protective and committed vibe.";
};

const LoyalPartnerCalculator: React.FC = () => {
  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");

  // required inputs but not used
  const [yourDob, setYourDob] = useState("");
  const [partnerDob, setPartnerDob] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LoyaltyResult | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const canCalculate = useMemo(() => {
    return (
      yourName.trim().length > 0 &&
      partnerName.trim().length > 0 &&
      yourDob.trim().length > 0 &&
      partnerDob.trim().length > 0
    );
  }, [yourName, partnerName, yourDob, partnerDob]);

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

    // premium feel delay
    await new Promise((r) => setTimeout(r, 650));

    const seed = hashSeed(stableKey);
    const loyalty = (seed % 51) + 50; // 50–100
    const reason = getReasonByScore(loyalty);

    setResult({ loyalty, reason });

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
        badgeText="Trust & Loyalty Insight"
        titleMain="Loyal"
        titleAccent="Partner"
        paragraph="Enter both names and DOBs to reveal a fun loyalty percentage and a quick trust message."
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
                Check Your <span className="text-primary">Loyalty Energy</span>
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

                {/* DOBs (required but not used) */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                      Your DOB (Required)
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="date"
                        required
                        style={{ borderRadius: "9999px" }}
                        className="w-full bg-white border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-primary outline-none transition-all shadow-sm text-sm"
                        value={yourDob}
                        onChange={(e) => setYourDob(e.target.value)}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-burgundy/30">
                        <FaCalendar size={14} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                      Partner DOB (Required)
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="date"
                        required
                        style={{ borderRadius: "9999px" }}
                        className="w-full bg-white border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-primary outline-none transition-all shadow-sm text-sm"
                        value={partnerDob}
                        onChange={(e) => setPartnerDob(e.target.value)}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-burgundy/30">
                        <FaCalendar size={14} />
                      </div>
                    </div>
                  </div>
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
                      <FaShieldAlt size={16} />
                    )}
                    {loading ? "Checking..." : "Check Loyalty %"}
                    <FaArrowRight className="opacity-70 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <p className="m-0 text-center text-xs text-gray-400 italic">
                  DOB inputs are required for form completeness, but this calculator uses only names for loyalty seed.
                </p>
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
                        Loyalty Result
                      </span>

                      <h2 className="text-4xl md:text-6xl font-black text-burgundy mb-6 tracking-tight">
                        Loyalty <span className="text-primary">Score</span>
                      </h2>

                      <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-16"></div>
                    </div>

                    <div className="flex flex-col items-center">
                      {/* Ring */}
                      <div className="relative mb-16">
                        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white shadow-2xl flex items-center justify-center p-8 border-8 border-orange-50 relative group">
                          <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent animate-spin-slow opacity-20"></div>

                          <div className="text-center">
                            <span className="block text-7xl md:text-9xl font-black text-burgundy leading-none group-hover:scale-110 transition-transform duration-500">
                              {result.loyalty}
                              <span className="text-4xl text-primary">%</span>
                            </span>
                            <span className="text-[12px] font-black uppercase tracking-[4px] text-primary mt-4 block">
                              Loyalty Energy
                            </span>
                          </div>

                          <FaHeart className="absolute -top-4 -right-4 text-pink-500 text-5xl animate-bounce shadow-xl" />
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="max-w-2xl text-center">
                        <div className="bg-burgundy text-white p-10 rounded-[3rem] shadow-2xl relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary p-4 rounded-2xl shadow-lg">
                            <TbCrystalBall size={28} />
                          </div>

                          <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90 m-0">
                            "{result.reason}"
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
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default LoyalPartnerCalculator;



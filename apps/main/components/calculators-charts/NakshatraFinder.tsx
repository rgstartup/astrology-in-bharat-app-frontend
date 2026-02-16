"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaArrowRight as FaAr,
  FaSpinner as FaSp,
  FaRegCalendarAlt as FaCal,
  FaRegClock as FaCl,
} from "react-icons/fa";

import { TbCrystalBall as TbCb } from "react-icons/tb";
import { GiLotus as GiL, GiSparkles as GiSpark } from "react-icons/gi";

import CalculatorHero from "./common/hero";

const FaArrowRight = FaAr as unknown as React.FC<{ size?: number; className?: string }>;
const FaSpinner = FaSp as unknown as React.FC<{ size?: number; className?: string }>;
const FaCalendar = FaCal as unknown as React.FC<{ size?: number; className?: string }>;
const FaClock = FaCl as unknown as React.FC<{ size?: number; className?: string }>;

const TbCrystalBall = TbCb as unknown as React.FC<{ size?: number; className?: string }>;
const GiLotus = GiL as unknown as React.FC<{ size?: number; className?: string }>;
const GiSparkles = GiSpark as unknown as React.FC<{ size?: number; className?: string }>;

type NakshatraResult = {
  name: string;
  nature: string;
  index: number;
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

const nakshatras: { name: string; nature: string }[] = [
  { name: "Ashwini", nature: "Fast, energetic, healing nature. Quick decision maker with a bold spirit." },
  { name: "Bharani", nature: "Strong will, intense emotions, and transformation energy. Deep responsibility vibes." },
  { name: "Krittika", nature: "Sharp, fearless, and goal-focused. Natural leader with a powerful presence." },
  { name: "Rohini", nature: "Charming, creative, and comfort-loving. Strong attraction and emotional warmth." },
  { name: "Mrigashira", nature: "Curious, playful, and always searching for meaning. Intelligent and adaptable." },
  { name: "Ardra", nature: "Intense thinker with strong emotions. Powerful growth after challenges." },
  { name: "Punarvasu", nature: "Optimistic, pure-hearted, and calm. Brings stability and fresh starts." },
  { name: "Pushya", nature: "Supportive, disciplined, and nurturing. Strong spiritual and family values." },
  { name: "Ashlesha", nature: "Mystical, strategic, and emotionally deep. Highly intuitive and protective." },
  { name: "Magha", nature: "Royal mindset, proud, and traditional. Strong respect for ancestors and legacy." },
  { name: "Purva Phalguni", nature: "Romantic, fun-loving, and artistic. Loves luxury, creativity, and comfort." },
  { name: "Uttara Phalguni", nature: "Reliable, loyal, and partnership-focused. Strong responsibility and leadership." },
  { name: "Hasta", nature: "Skillful, clever, and practical. Great communication and hardworking energy." },
  { name: "Chitra", nature: "Creative, stylish, and ambitious. Strong desire to build something unique." },
  { name: "Swati", nature: "Independent, flexible, and freedom-loving. Balanced mindset and diplomatic nature." },
  { name: "Vishakha", nature: "Goal-driven, determined, and competitive. Strong focus on success and growth." },
  { name: "Anuradha", nature: "Loyal, friendly, and spiritually aligned. Strong bonding and supportive nature." },
  { name: "Jyeshtha", nature: "Protective, powerful, and mature. Strong leadership with deep emotions." },
  { name: "Mula", nature: "Truth seeker, intense, and transformational. Removes negativity and rebuilds stronger." },
  { name: "Purva Ashadha", nature: "Confident, persuasive, and proud. Strong belief system and unstoppable energy." },
  { name: "Uttara Ashadha", nature: "Disciplined, responsible, and victory-minded. Strong ethics and leadership." },
  { name: "Shravana", nature: "Wise listener, calm, and learning-focused. Strong spiritual intelligence." },
  { name: "Dhanishta", nature: "Ambitious, energetic, and socially active. Strong rhythm, music, and success vibes." },
  { name: "Shatabhisha", nature: "Mysterious, healing, and independent. Deep thinker with strong intuition." },
  { name: "Purva Bhadrapada", nature: "Intense, visionary, and spiritual. Powerful transformation and inner strength." },
  { name: "Uttara Bhadrapada", nature: "Calm, wise, and stable. Strong patience, maturity, and spiritual depth." },
  { name: "Revati", nature: "Gentle, caring, and protective. Brings emotional peace and guidance energy." },
];

const NakshatraFinder: React.FC = () => {
  const [dob, setDob] = useState<string>("");
  const [birthTime, setBirthTime] = useState<string>(""); // optional
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<NakshatraResult | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const canCalculate = useMemo(() => dob.length > 0, [dob]);

  const stableKey = useMemo(() => {
    return `${dob}|${birthTime || ""}`;
  }, [dob, birthTime]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) return;

    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 650));

    const seed = hashSeed(stableKey);

    const index = seed % 27;
    const selected = nakshatras[index];

    setResult({
      name: selected!.name,
      nature: selected!.nature,
      index,
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
        badgeText="Approximate Finder"
        titleMain="Nakshatra"
        titleAccent="Finder"
        paragraph="Enter your date of birth and optional birth time to get an approximate Nakshatra prediction with nature insights."
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
                Find Your <span className="text-primary">Nakshatra</span>
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-2"></div>
            </div>

            <form onSubmit={handleCalculate} className="max-w-3xl mx-auto">
              <div className="glass-card rounded-[2.5rem] p-6 md:p-10 shadow-[0_15px_40px_rgba(48,17,24,0.08)] border border-burgundy/5 relative overflow-hidden bg-white space-y-6">
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
                      <FaCalendar size={14} />
                    </div>
                  </div>
                </div>

                {/* Birth Time */}
                <div>
                  <label className="text-sm font-bold text-burgundy/60 uppercase tracking-widest pl-1">
                    Birth Time (Optional)
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="time"
                      style={{ borderRadius: "9999px" }}
                      className="w-full bg-white border-2 border-burgundy/5 px-5 py-3.5 text-burgundy font-bold focus:border-primary outline-none transition-all shadow-sm text-sm"
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-burgundy/30">
                      <FaClock size={14} />
                    </div>
                  </div>

                  <p className="m-0 mt-3 text-xs text-gray-400 italic">
                    Adding time can slightly change the seed, but result is still approximate.
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
                    {loading ? "Finding..." : "Find Nakshatra"}
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
                        Your Nakshatra Result
                      </span>

                      <h2 className="text-4xl md:text-6xl font-black text-burgundy mb-6 tracking-tight">
                        Nakshatra <span className="text-primary">Name</span>
                      </h2>

                      <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-16"></div>
                    </div>

                    <div className="flex flex-col items-center">
                      {/* Ring */}
                      <div className="relative mb-16">
                        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white shadow-2xl flex items-center justify-center p-8 border-8 border-orange-50 relative group">
                          <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent animate-spin-slow opacity-20"></div>

                          <div className="text-center">
                            <span className="block text-4xl md:text-6xl font-black text-burgundy leading-none group-hover:scale-110 transition-transform duration-500">
                              {result.name}
                            </span>
                            <span className="text-[12px] font-black uppercase tracking-[4px] text-primary mt-4 block">
                              Nakshatra #{result.index + 1} / 27
                            </span>
                          </div>

                          <GiSparkles className="absolute -top-4 -right-4 text-primary text-5xl animate-bounce shadow-xl" />
                        </div>
                      </div>

                      {/* Nature Text */}
                      <div className="max-w-2xl text-center">
                        <div className="bg-burgundy text-white p-10 rounded-[3rem] shadow-2xl relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary p-4 rounded-2xl shadow-lg">
                            <TbCrystalBall size={28} />
                          </div>

                          <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90 m-0">
                            {result.nature}
                          </p>

                          <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-[4px] text-orange-100/70">
                              Approximate result (DOB-only)
                            </span>
                          </div>

                          <p className="m-0 mt-6 text-xs text-orange-100/50 italic">
                            For accurate Nakshatra, Moon position (kundli calculation) is required.
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

export default NakshatraFinder;

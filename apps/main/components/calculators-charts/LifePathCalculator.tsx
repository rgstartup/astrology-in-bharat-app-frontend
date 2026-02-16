"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaArrowRight as FaAr,
  FaSpinner as FaSp,
  FaRegCalendarAlt as FaCal,
  FaStar as FaS,
} from "react-icons/fa";

import { TbCrystalBall as TbCb } from "react-icons/tb";
import { GiLotus as GiL, GiSparkles as GiSpark } from "react-icons/gi";

import CalculatorHero from "./common/hero";

const FaArrowRight = FaAr as unknown as React.FC<{ size?: number; className?: string }>;
const FaSpinner = FaSp as unknown as React.FC<{ size?: number; className?: string }>;
const FaCalendar = FaCal as unknown as React.FC<{ size?: number; className?: string }>;
const FaStar = FaS as unknown as React.FC<{ size?: number; className?: string }>;

const TbCrystalBall = TbCb as unknown as React.FC<{ size?: number; className?: string }>;
const GiLotus = GiL as unknown as React.FC<{ size?: number; className?: string }>;
const GiSparkles = GiSpark as unknown as React.FC<{ size?: number; className?: string }>;

type LifePathNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 22 | 33;

type LifePathResult = {
  lifePath: LifePathNumber;
  title: string;
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

const lifePathMap: Record<LifePathNumber, { title: string; message: string }> = {
  1: { title: "Leader", message: "Independent, strong will, and born to take initiative. Career hint: leadership, business, management." },
  2: { title: "Peace Maker", message: "Emotionally intelligent, supportive, and cooperative. Career hint: counseling, HR, teamwork roles." },
  3: { title: "Creative Soul", message: "Expressive, social, and full of artistic energy. Career hint: media, writing, design, communication." },
  4: { title: "Builder", message: "Practical, disciplined, and stable mindset. Career hint: engineering, planning, operations, systems." },
  5: { title: "Freedom Lover", message: "Adventurous, energetic, and loves change. Career hint: travel, sales, marketing, entrepreneurship." },
  6: { title: "Caretaker", message: "Caring, responsible, and family-focused. Career hint: teaching, healthcare, service-based fields." },
  7: { title: "Spiritual Thinker", message: "Deep thinker, researcher, and spiritually aware. Career hint: analysis, research, IT, psychology." },
  8: { title: "Achiever", message: "Ambitious with strong money/power management energy. Career hint: finance, leadership, corporate growth." },
  9: { title: "Humanitarian", message: "Emotional depth, compassion, and big-hearted nature. Career hint: NGO, healing, public service, arts." },
  11: { title: "Intuitive Visionary", message: "Inspirational, intuitive, and spiritually gifted. Career hint: mentoring, creative leadership, guidance roles." },
  22: { title: "Master Builder", message: "Big achievements, long-term success, and powerful execution. Career hint: large projects, business empires, systems." },
  33: { title: "Compassionate Healer", message: "Teacher energy, healing nature, and strong emotional wisdom. Career hint: spiritual teaching, healing, coaching." },
};

const isMasterNumber = (n: number) => n === 11 || n === 22 || n === 33;

const sumDigits = (numOrStr: number | string): number => {
  const s = String(numOrStr).replace(/\D/g, "");
  let sum = 0;
  for (const ch of s) sum += Number(ch);
  return sum;
};

const reduceLifePath = (n: number): LifePathNumber => {
  let current = n;

  while (current > 9 && !isMasterNumber(current)) {
    current = sumDigits(current);
  }

  // At this point current is 1-9 or master
  return current as LifePathNumber;
};

const NumerologyLifePathCalculator: React.FC = () => {
  const [dob, setDob] = useState<string>(""); // required
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<LifePathResult | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const canCalculate = useMemo(() => {
    return dob.length > 0;
  }, [dob]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) return;

    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 650));

    // Convert DOB to digits (DDMMYYYY)
    // input format: YYYY-MM-DD
    const digits = dob.replace(/-/g, ""); // YYYYMMDD
    const yyyy = digits.slice(0, 4);
    const mm = digits.slice(4, 6);
    const dd = digits.slice(6, 8);

    const ddmmyyyy = `${dd}${mm}${yyyy}`;

    // Sum all digits
    const total = sumDigits(ddmmyyyy);

    // Reduce to single digit except master numbers
    const lifePath = reduceLifePath(total);

    const info = lifePathMap[lifePath];

    setResult({
      lifePath,
      title: info.title,
      message: info.message,
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
        badgeText="Real Numerology Calculator"
        titleMain="Life Path"
        titleAccent="Number"
        paragraph="Enter your date of birth to discover your Life Path Number and a quick personality + career hint."
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
                Numerology <span className="text-primary">Life Path</span> Calculator
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
                    {loading ? "Calculating..." : "Calculate Life Path"}
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
                        Your Numerology Result
                      </span>

                      <h2 className="text-4xl md:text-6xl font-black text-burgundy mb-6 tracking-tight">
                        Life Path <span className="text-primary">Number</span>
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
                              {result.lifePath}
                            </span>
                            <span className="text-[12px] font-black uppercase tracking-[4px] text-primary mt-4 block">
                              {result.title}
                            </span>
                          </div>

                          <FaStar className="absolute -top-4 -right-4 text-primary text-5xl animate-bounce shadow-xl" />
                        </div>
                      </div>

                      {/* Message */}
                      <div className="max-w-2xl text-center">
                        <div className="bg-burgundy text-white p-10 rounded-[3rem] shadow-2xl relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary p-4 rounded-2xl shadow-lg">
                            <GiSparkles size={28} />
                          </div>

                          <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90 m-0">
                            {result.message}
                          </p>

                          <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-[4px] text-orange-100/70">
                              Based on Real Numerology Reduction
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

export default NumerologyLifePathCalculator;



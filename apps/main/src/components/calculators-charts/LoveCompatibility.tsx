"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaHeart,
  FaArrowRight,
  FaStar,
  FaBalanceScale,
} from "react-icons/fa";

import { GiLotus, GiSparkles } from "react-icons/gi";

import CalculatorHero from "./common/hero";
import LoveCompatibilityForm from "./LoveCompatibilityForm.component";

import { useLanguageStore } from "@repo/store";
import { loveCompatibilityTranslations } from "@/lib/translations/calculators/love-compatibility";

import { LoveCompatibilityResult as ResultType } from "@/lib/types";

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
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
};

const clamp = (num: number, min: number, max: number) =>
  Math.max(min, Math.min(max, num));

const hashSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getMessageByLove = (love: number, t: any): string => {
  if (love >= 40 && love <= 55) {
    return t.results.messages.potential;
  }
  if (love >= 56 && love <= 70) {
    return t.results.messages.good;
  }
  if (love >= 71 && love <= 85) {
    return t.results.messages.strong;
  }
  return t.results.messages.excellent;
};

import { CalculatorProgressBarProps as ProgressBarProps } from "@/lib/types";

const ProgressBar: React.FC<ProgressBarProps & { fontStyle?: any }> = ({ label, value, fontStyle }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <p className="m-0 text-[11px] font-black uppercase tracking-[3px] text-[#301118]/50" style={fontStyle}>
          {label}
        </p>
        <p className="m-0 text-[11px] font-black uppercase tracking-[3px] text-orange-500">
          {value}%
        </p>
      </div>

      <div className="w-full h-3 rounded-full bg-orange-500/10 overflow-hidden border border-orange-100">
        <div
          className="h-full rounded-full bg-orange-500 transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

const LoveCompatibilityCalcultor: React.FC = () => {
  const { lang, toggleLang } = useLanguageStore();
  const t = loveCompatibilityTranslations[lang as "en" | "hi"] || loveCompatibilityTranslations.en;
  const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  const [maleName, setMaleName] = useState<string>("");
  const [femaleName, setFemaleName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ResultType | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const normalized = useMemo(() => {
    const n1 = normalizeName(maleName);
    const n2 = normalizeName(femaleName);
    return { n1, n2 };
  }, [maleName, femaleName]);

  const canCalculate = useMemo(() => {
    return normalized.n1.length > 0 && normalized.n2.length > 0;
  }, [normalized.n1, normalized.n2]);

  const stableKey = useMemo(() => {
    if (!canCalculate) return "";
    return [normalized.n1, normalized.n2].sort().join("|");
  }, [normalized.n1, normalized.n2, canCalculate]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) return;

    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 650));

    const seed = hashSeed(stableKey);

    const love = (seed % 61) + 40;
    const trust = clamp(love + ((seed % 21) - 10), 0, 100);
    const romance = clamp(love + (((seed >> 2) % 21) - 10), 0, 100);
    const communication = clamp(love + (((seed >> 4) % 21) - 10), 0, 100);

    const message = getMessageByLove(love, t);

    setResult({ love, trust, romance, communication, message });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] selection:bg-primary/20">
      <style dangerouslySetInnerHTML={{ __html: premiumCardStyles }} />

      {/* Hero */}
      <section className="relative">
        <CalculatorHero
          badgeText={t.hero.badge}
          titleMain={t.hero.titleMain}
          titleAccent={t.hero.titleAccent}
          paragraph={t.hero.paragraph}
        />
      </section>

      {/* Main Content Area */}
      <section className="py-12 md:py-24 relative overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="glass-card rounded-[2rem] md:rounded-[4rem] p-6 md:p-12 lg:p-16 shadow-[0_20px_60px_rgba(48,17,24,0.12)] border-t-4 border-t-orange-500/50 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
              <GiLotus size={150} />
            </div>

            <div className="text-center mb-10 md:mb-16 relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-[#301118] mb-2 tracking-tight" style={fontStyle}>
                {t.form.title.replace("{percentage}", t.form.percentage)}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mt-4"></div>
            </div>

            <div className={`grid gap-12 lg:gap-16 items-center ${result ? 'lg:grid-cols-2' : 'max-w-xl mx-auto'}`}>
              
              {/* Form Side */}
              <div className="relative z-10 w-full">
                <LoveCompatibilityForm
                  maleName={maleName}
                  setMaleName={setMaleName}
                  femaleName={femaleName}
                  setFemaleName={setFemaleName}
                  loading={loading}
                  canCalculate={canCalculate}
                  handleCalculate={handleCalculate}
                  t={t}
                  fontStyle={fontStyle}
                />
              </div>

              {/* Result Side */}
              {result && (
                <div ref={resultsRef} className="animate-in fade-in slide-in-from-right-8 duration-700 w-full h-full flex flex-col">
                  <div className="bg-gradient-to-br from-[#301118] to-[#1a090d] rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden border border-orange-500/20 text-center flex-1 flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                      <GiLotus size={200} className="text-orange-500 animate-spin-slow" />
                    </div>

                    <div className="relative z-10">
                      <span className="inline-block bg-orange-500/20 text-orange-400 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[3px] mb-8" style={fontStyle}>
                        {t.results.badge}
                      </span>

                      <div className="flex justify-center mb-10">
                         <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-orange-500/30 flex items-center justify-center relative bg-[#301118] group">
                            <div className="absolute inset-0 rounded-full border-8 border-orange-500 border-t-transparent animate-spin-slow opacity-50"></div>
                            <div className="text-center">
                              <span className="block text-5xl md:text-7xl font-black text-white leading-none group-hover:scale-110 transition-transform duration-500">
                                {result.love}
                                <span className="text-2xl text-orange-500">%</span>
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-[2px] text-orange-400 mt-2 block" style={fontStyle}>
                                {t.results.cosmicBond}
                              </span>
                            </div>
                            <FaHeart className="absolute -top-3 -right-3 text-pink-500 text-4xl animate-bounce shadow-xl" />
                         </div>
                      </div>

                      <div className="mb-8">
                        <div className="bg-white/5 border border-white/10 text-white p-6 rounded-3xl shadow-xl relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 p-3 rounded-xl shadow-lg">
                            <GiSparkles size={20} className="text-[#301118]" />
                          </div>
                          <p className="text-base md:text-lg font-light italic leading-relaxed text-orange-100/90 m-0 mt-2" style={fontStyle}>
                            "{result.message}"
                          </p>
                        </div>
                      </div>

                      <div className="w-full bg-white/5 rounded-3xl p-6 border border-orange-500/10 text-left">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-base font-black text-white tracking-tight m-0" style={fontStyle}>
                            {t.results.breakdownTitle}
                          </h4>
                          <div className="px-3 py-1 bg-orange-500/20 rounded-lg shadow-sm border border-orange-500/30 flex items-center gap-1.5">
                            <FaStar className="text-orange-400" size={10} />
                            <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest" style={fontStyle}>
                              {t.results.premiumInsight}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <ProgressBar label={t.results.trust} value={result.trust} fontStyle={fontStyle} />
                          <ProgressBar label={t.results.romance} value={result.romance} fontStyle={fontStyle} />
                          <ProgressBar label={t.results.communication} value={result.communication} fontStyle={fontStyle} />
                        </div>

                        <div className="mt-10 flex items-start gap-4 bg-white rounded-2xl p-6 border border-orange-50 shadow-sm">
                          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <FaBalanceScale size={18} />
                          </div>
                          <div>
                            <p className="m-0 text-sm font-black text-[#301118]" style={fontStyle}>
                              {t.results.tipTitle}
                            </p>
                            <p className="m-0 text-sm text-gray-500 italic leading-relaxed" style={fontStyle}>
                              {t.results.tipDesc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoveCompatibilityCalcultor;

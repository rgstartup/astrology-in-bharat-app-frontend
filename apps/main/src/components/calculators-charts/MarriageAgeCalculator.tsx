"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaUser,
  FaArrowRight,
  FaSpinner,
  FaRing,
  FaRegCalendarAlt as FaCalendar,
} from "react-icons/fa";

import { TbCrystalBall } from "react-icons/tb";
import { GiLotus, GiSparkles } from "react-icons/gi";

import CalculatorHero from "./common/hero";
import MarriageAgeForm from "./MarriageAgeForm.component";
import { useLanguageStore } from "@repo/store";
import { marriageAgeTranslations } from "@/lib/translations/calculators/marriage-age";

import { MarriageResult } from "@/lib/types/calculator";

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
  if (!dob) return null;
  const year = Number(dob.split("-")[0]);
  if (!year || Number.isNaN(year)) return null;
  return year;
};

const MarriageAgeCalculator: React.FC = () => {
  const { lang, toggleLang } = useLanguageStore();
  const t = marriageAgeTranslations[lang as "en" | "hi"] || marriageAgeTranslations.en;
  const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  const [name, setName] = useState<string>("");
  const [dob, setDob] = useState<string>(""); // optional
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<MarriageResult | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const normalizedNameValue = useMemo(() => normalizeName(name), [name]);

  const canCalculate = useMemo(() => {
    return normalizedNameValue.length > 0;
  }, [normalizedNameValue]);

  const stableKey = useMemo(() => {
    const safeDob = dob ? dob : "";
    return `${normalizedNameValue}|${safeDob}`;
  }, [normalizedNameValue, dob]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) return;

    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 650));

    const seed = hashSeed(stableKey);
    const startAge = 22 + (seed % 8);
    const endAge = startAge + 2 + (seed % 3);

    const currentYear = new Date().getFullYear();
    const birthYear = getBirthYearFromDob(dob);

    let bestYear = currentYear + (seed % 5);
    let hasDobValue = false;

    if (birthYear) {
      hasDobValue = true;
      bestYear = birthYear + startAge + (seed % 2);
    }

    setResult({ startAge, endAge, bestYear, hasDob: hasDobValue });

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
                {t.form.title} <span className="text-orange-500">{t.form.titleAccent}</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mt-4"></div>
            </div>

            <div className={`grid gap-12 lg:gap-16 items-center ${result ? 'lg:grid-cols-2' : 'max-w-xl mx-auto'}`}>
              
              {/* Form Side */}
              <div className="relative z-10 w-full">
                <MarriageAgeForm
                  name={name}
                  setName={setName}
                  dob={dob}
                  setDob={setDob}
                  loading={loading}
                  canCalculate={canCalculate}
                  handleCalculate={handleCalculate}
                  t={t.form}
                  fontStyle={fontStyle}
                />
              </div>

              {/* Result Side */}
              {result && (
                <div ref={resultsRef} className="animate-in fade-in slide-in-from-right-8 duration-700 w-full h-full flex flex-col">
                  <div className="bg-gradient-to-br from-[#301118] to-[#1a090d] rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden border border-orange-500/20 text-center flex-1 flex flex-col justify-center">
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 opacity-10 pointer-events-none">
                      <GiLotus size={200} className="text-orange-500 animate-spin-slow" />
                    </div>
                    
                    <div className="relative z-10">
                      <span className="inline-block bg-orange-500/20 text-orange-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[3px] mb-8" style={fontStyle}>
                        {t.results.badge}
                      </span>

                      <div className="flex justify-center mb-10">
                         <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-orange-500/30 flex items-center justify-center relative bg-[#301118]">
                            <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin-slow"></div>
                            <div>
                              <span className="block text-4xl md:text-5xl font-black text-white leading-none">
                                {result.startAge}–{result.endAge}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-[2px] text-orange-400 mt-2 block" style={fontStyle}>
                                {t.results.ageWindow}
                              </span>
                            </div>
                            <div className="absolute -top-3 -right-3 bg-[#301118] p-2 rounded-full border border-orange-500/30 shadow-xl">
                              <FaRing className="text-orange-500 text-2xl animate-bounce" />
                            </div>
                         </div>
                      </div>

                      <p className="text-lg md:text-xl font-light italic leading-relaxed text-orange-100/90 mb-4 m-0" style={fontStyle}>
                        {t.results.windowLabel} <span className="font-black text-white ml-2">{result.startAge}–{result.endAge}</span>
                      </p>

                      <p className="text-base md:text-lg font-light italic leading-relaxed text-orange-100/70 mb-8 m-0" style={fontStyle}>
                        {t.results.bestYearLabel} <span className="font-black text-white ml-2">{result.bestYear}</span>
                      </p>

                      <div className="mt-auto">
                        <span className="inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[3px] text-orange-100/50" style={fontStyle}>
                          {t.results.disclaimer}
                        </span>
                        {!result.hasDob && (
                          <p className="m-0 mt-4 text-[10px] text-orange-100/40 italic" style={fontStyle}>
                            {t.results.dobNote}
                          </p>
                        )}
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

export default MarriageAgeCalculator;



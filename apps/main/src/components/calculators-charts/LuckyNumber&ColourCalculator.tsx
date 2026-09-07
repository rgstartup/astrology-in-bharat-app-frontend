"use client";

import React, { useRef } from "react";
import CalculatorHero from "./common/hero";
import LuckyVibesForm from "./LuckyVibesForm";
import LuckyVibesResult from "./LuckyVibesResult";
import { useLuckyVibes } from "./useLuckyVibes";
import { useLanguageStore } from "@repo/store";
import { homeTranslations } from "@/lib/translations/home";
import { GiLotus } from "react-icons/gi";

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

const LuckyColorNumberCalculator: React.FC = () => {
  const {
    fullName,
    setFullName,
    dob,
    setDob,
    zodiac,
    setZodiac,
    loading,
    result,
    canCalculate,
    calculate,
  } = useLuckyVibes();

  const { lang } = useLanguageStore();
  const translationSet = (homeTranslations[lang as "en" | "hi"] || homeTranslations.en) as any;
  const t = translationSet.calculators.luckyVibes;
  const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    await calculate();
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#fffaf7] selection:bg-orange-500/20">
      <style dangerouslySetInnerHTML={{ __html: premiumCardStyles }} />

      <section className="relative">
        <CalculatorHero
          badgeText={t.hero.badge}
          titleMain={t.hero.titleMain}
          titleAccent={t.hero.titleAccent}
          paragraph={t.hero.description}
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
                {t.form.title}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mt-4"></div>
            </div>

            <div className={`grid gap-12 lg:gap-16 items-center ${result ? 'lg:grid-cols-2' : 'max-w-xl mx-auto'}`}>
              
              {/* Form Side */}
              <div className="relative z-10 w-full">
                <LuckyVibesForm
                  fullName={fullName}
                  dob={dob}
                  zodiac={zodiac}
                  loading={loading}
                  canCalculate={canCalculate}
                  setFullName={setFullName}
                  setDob={setDob}
                  setZodiac={setZodiac}
                  handleCalculate={handleCalculate}
                />
              </div>

              {/* Result Side */}
              {result && (
                <div ref={resultsRef} className="animate-in fade-in slide-in-from-right-8 duration-700 w-full h-full flex flex-col">
                  <LuckyVibesResult result={result} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LuckyColorNumberCalculator;

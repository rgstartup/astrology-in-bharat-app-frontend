"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaUser,
  FaArrowRight,
  FaSpinner,
  FaStar,
} from "react-icons/fa";

import { TbCrystalBall } from "react-icons/tb";
import { GiLotus, GiSparkles } from "react-icons/gi";

import CalculatorHero from "./common/hero";
import NameNumerologyForm from "./NameNumerologyForm.component";
import { useLanguageStore } from "@repo/store";
import { nameNumerologyTranslations } from "@/lib/translations/calculators/name-numerology";

import { NameNumber, NameResult } from "@/lib/types/calculator";

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
  .animate-spin-slow { animation: spin-slow 2s linear infinite; }
`;

const isMasterNumber = (n: number) => n === 11 || n === 22;

// A–Z to 1–9 (Pythagorean)
const letterValue = (ch: string): number => {
  const c = ch.toUpperCase();
  if (!/[A-Z]/.test(c)) return 0;

  if ("AJS".includes(c)) return 1;
  if ("BKT".includes(c)) return 2;
  if ("CLU".includes(c)) return 3;
  if ("DMV".includes(c)) return 4;
  if ("ENW".includes(c)) return 5;
  if ("FOX".includes(c)) return 6;
  if ("GPY".includes(c)) return 7;
  if ("HQZ".includes(c)) return 8;
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

  return current as NameNumber;
};

const NameNumerologyCalculator: React.FC = () => {
  const { lang, toggleLang } = useLanguageStore();
  const t = nameNumerologyTranslations[lang as "en" | "hi"] || nameNumerologyTranslations.en;
  const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  const [fullName, setFullName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<NameResult | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const normalizedNameValue = useMemo(() => {
    return fullName.trim();
  }, [fullName]);

  const canCalculate = useMemo(() => {
    return normalizedNameValue.length > 0;
  }, [normalizedNameValue]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) return;

    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 650));

    let total = 0;
    for (const ch of normalizedNameValue) {
      total += letterValue(ch);
    }

    const reduced = reduceNumber(total);
    const vibe = (t.results.vibes as any)[reduced] || t.results.vibes.default;

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

      <NameNumerologyForm
        fullName={fullName}
        setFullName={setFullName}
        loading={loading}
        canCalculate={canCalculate}
        handleCalculate={handleCalculate}
        t={t.form}
        fontStyle={fontStyle}
      />

      {/* Result */}
      <div ref={resultsRef}>
        {result && (
          <section className="py-24 bg-white relative overflow-hidden">
            <div className="container px-6">
              <div className="max-w-5xl mx-auto">
                <div className="glass-card rounded-[4rem] p-8 md:p-16 shadow-[0_30px_80px_rgba(48,17,24,0.18)] border border-burgundy/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                    <GiLotus size={300} className="animate-spin-slow" />
                  </div>

                  <div className="relative z-10">
                    <div className="text-center mb-16">
                      <span className="inline-block bg-primary/10 text-primary px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-[3px] mb-8" style={fontStyle}>
                        {t.results.badge}
                      </span>

                      <h2 className="text-4xl md:text-6xl font-black text-burgundy mb-6 tracking-tight" style={fontStyle}>
                        {t.results.title} <span className="text-primary">{t.results.titleAccent}</span>
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
                              {result.nameNumber}
                            </span>
                            <span className="text-[12px] font-black uppercase tracking-[4px] text-primary mt-4 block" style={fontStyle}>
                              {t.results.vibeLabel} {result.vibe}
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

                          <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90 m-0" style={fontStyle}>
                            {t.results.vibeLabel}{" "}
                            <span className="font-black text-white ml-2">
                              {result.vibe}
                            </span>
                          </p>

                          <p className="m-0 mt-6 text-sm text-orange-100/60 italic" style={fontStyle}>
                            {t.results.scoreLabel}{" "}
                            <span className="font-black text-white ml-1">
                              {result.totalBeforeReduce}
                            </span>
                          </p>

                          <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-[4px] text-orange-100/70" style={fontStyle}>
                              {t.results.system}
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




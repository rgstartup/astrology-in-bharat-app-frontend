"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaArrowRight,
  FaSpinner,
  FaRegCalendarAlt as FaCalendar,
  FaStar,
} from "react-icons/fa";

import { TbCrystalBall } from "react-icons/tb";
import { GiLotus, GiSparkles } from "react-icons/gi";

import CalculatorHero from "./common/hero";
import LifePathForm from "./LifePathForm.component";
import { useLanguageStore } from "@repo/store";
import { lifePathTranslations } from "@/lib/translations/calculators/life-path";

import { LifePathNumber, LifePathResult } from "@/lib/types";

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
  const { lang } = useLanguageStore();
  const t = lifePathTranslations[lang as "en" | "hi"] || lifePathTranslations.en;
  const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

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

    const info = t.results.meanings[lifePath as keyof typeof t.results.meanings];

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
        badgeText={t.hero.badge}
        titleMain={t.hero.titleMain}
        titleAccent={t.hero.titleAccent}
        paragraph={t.hero.paragraph}
      />

      <LifePathForm
        dob={dob}
        setDob={setDob}
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
                              {result.lifePath}
                            </span>
                            <span className="text-[12px] font-black uppercase tracking-[4px] text-primary mt-4 block" style={fontStyle}>
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

                          <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90 m-0" style={fontStyle}>
                            {result.message}
                          </p>

                          <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-[4px] text-orange-100/70" style={fontStyle}>
                              {t.results.disclaimer}
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

"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaHeart,
  FaArrowRight,
  FaSpinner,
  FaUser,
  FaRegCalendarAlt as FaCalendar,
  FaShieldAlt,
} from "react-icons/fa";

import { TbCrystalBall } from "react-icons/tb";
import { GiLotus, GiSparkles } from "react-icons/gi";

import CalculatorHero from "./common/hero";
import LoyalPartnerForm from "./LoyalPartnerForm.component";
import { useLanguageStore } from "@repo/store";
import { loyalPartnerTranslations } from "@/lib/translations/calculators/loyal-partner";

import { LoyaltyResult } from "@/lib/types/calculator";

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
    .replace(/[^a-z]/g, "");
};

const getReasonByScore = (score: number, t: any) => {
  if (score >= 50 && score <= 65) {
    return t.results.reasons.low;
  }
  if (score >= 66 && score <= 80) {
    return t.results.reasons.medium;
  }
  return t.results.reasons.high;
};

const LoyalPartnerCalculator: React.FC = () => {
  const { lang, toggleLang } = useLanguageStore();
  const t = loyalPartnerTranslations[lang as "en" | "hi"] || loyalPartnerTranslations.en;
  const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");

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

    await new Promise((r) => setTimeout(r, 650));

    const seed = hashSeed(stableKey);
    const loyalty = (seed % 51) + 50; // 50–100
    const reason = getReasonByScore(loyalty, t);

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
      <section className="relative">
        <CalculatorHero
          badgeText={t.hero.badge}
          titleMain={t.hero.titleMain}
          titleAccent={t.hero.titleAccent}
          paragraph={t.hero.paragraph}
        />

        
      </section>

      <LoyalPartnerForm
        yourName={yourName}
        setYourName={setYourName}
        partnerName={partnerName}
        setPartnerName={setPartnerName}
        yourDob={yourDob}
        setYourDob={setYourDob}
        partnerDob={partnerDob}
        setPartnerDob={setPartnerDob}
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
                              {result.loyalty}
                              <span className="text-4xl text-primary">%</span>
                            </span>
                            <span className="text-[12px] font-black uppercase tracking-[4px] text-primary mt-4 block" style={fontStyle}>
                              {t.results.energyLabel}
                            </span>
                          </div>

                          <FaHeart className="absolute -top-4 -right-4 text-pink-500 text-5xl animate-bounce shadow-xl" />
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="max-w-2xl text-center">
                        <div className="bg-burgundy text-white p-10 rounded-[3rem] shadow-2xl relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary p-4 rounded-2xl shadow-lg">
                            <GiSparkles size={28} />
                          </div>

                          <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90 m-0" style={fontStyle}>
                            "{result.reason}"
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

export default LoyalPartnerCalculator;



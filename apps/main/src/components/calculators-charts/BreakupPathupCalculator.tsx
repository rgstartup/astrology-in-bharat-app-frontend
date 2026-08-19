"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaHeartBroken,
  FaHeart,
  FaArrowRight,
  FaSpinner,
  FaUser,
} from "react-icons/fa";

import { TbCrystalBall } from "react-icons/tb";
import { GiLotus, GiSparkles } from "react-icons/gi";

import CalculatorHero from "./common/hero";
import BreakupPatchupForm from "./BreakupPatchupForm.component";

import { BreakupPatchupResult } from "@/lib/types";
import { useLanguageStore } from "@repo/store";
import { breakupPatchupTranslations } from "@/lib/translations/calculators/breakup-patchup";

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

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const normalizeName = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z]/g, "");
};

const hashSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const BreakupPatchupCalculator: React.FC = () => {
  const { lang } = useLanguageStore();
  const t = breakupPatchupTranslations[lang as keyof typeof breakupPatchupTranslations] || breakupPatchupTranslations.en;
  const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");

  // required but not used in logic
  const [yourAge, setYourAge] = useState<string>("");
  const [partnerAge, setPartnerAge] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BreakupPatchupResult | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const canCalculate = useMemo(() => {
    return (
      yourName.trim().length > 0 &&
      partnerName.trim().length > 0 &&
      yourAge.trim().length > 0 &&
      partnerAge.trim().length > 0
    );
  }, [yourName, partnerName, yourAge, partnerAge]);

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

    const patchup = (seed % 51) + 40; // 40–90
    const breakup = clamp(100 - patchup + ((seed % 11) - 5), 5, 60); // 5–60

    const advice = patchup >= 70 ? t.results.advice.high : (patchup >= 50 ? t.results.advice.medium : t.results.advice.low);

    setResult({ patchup, breakup, advice });

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

      <BreakupPatchupForm
        yourName={yourName}
        setYourName={setYourName}
        partnerName={partnerName}
        setPartnerName={setPartnerName}
        yourAge={yourAge}
        setYourAge={setYourAge}
        partnerAge={partnerAge}
        setPartnerAge={setPartnerAge}
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

                    <div className="grid md:grid-cols-2 gap-10">
                      {/* Patchup */}
                      <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-orange-50">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
                            <FaHeart className="text-green-600" size={22} />
                          </div>
                          <div>
                            <p className="m-0 text-xs font-black uppercase tracking-widest text-gray-400" style={fontStyle}>
                              {t.results.patchupLabel}
                            </p>
                            <h3 className="m-0 text-3xl font-black text-burgundy">
                              {result.patchup}%
                            </h3>
                          </div>
                        </div>

                        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all duration-700"
                            style={{ width: `${result.patchup}%` }}
                          />
                        </div>
                      </div>

                      {/* Breakup */}
                      <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-orange-50">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                            <FaHeartBroken className="text-red-600" size={22} />
                          </div>
                          <div>
                            <p className="m-0 text-xs font-black uppercase tracking-widest text-gray-400" style={fontStyle}>
                              {t.results.breakupLabel}
                            </p>
                            <h3 className="m-0 text-3xl font-black text-burgundy">
                              {result.breakup}%
                            </h3>
                          </div>
                        </div>

                        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full transition-all duration-700"
                            style={{ width: `${result.breakup}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Advice */}
                    <div className="mt-14 text-center">
                      <div className="bg-burgundy text-white p-10 rounded-[3rem] shadow-2xl relative max-w-3xl mx-auto">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary p-4 rounded-2xl shadow-lg">
                          <GiSparkles size={28} />
                        </div>

                        <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90 m-0" style={fontStyle}>
                          "{result.advice}"
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
          </section>
        )}
      </div>
    </div>
  );
};

export default BreakupPatchupCalculator;

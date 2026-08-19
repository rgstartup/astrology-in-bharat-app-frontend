"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaUser,
  FaArrowRight,
  FaSpinner,
  FaRegCalendarAlt as FaCalendar,
} from "react-icons/fa";

import { TbCrystalBall } from "react-icons/tb";
import { GiLotus, GiSparkles } from "react-icons/gi";

import CalculatorHero from "./common/hero";
import SoulmateNameInitialsForm from "./SoulmateNameInitialsForm.component";
import { useLanguageStore } from "@repo/store";
import { soulmateInitialsTranslations } from "@/lib/translations/calculators/soulmate-initials";

import { SoulmateResult } from "@/lib/types/calculator";

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
  .animate-spin-fast { animation: spin-slow 3s linear infinite; }
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

const letters = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

const pickUniqueInitials = (seed: number): string[] => {
  const i1 = letters[seed % 26] as string;
  let i2 = letters[(seed + 7) % 26] as string;
  let i3 = letters[(seed + 19) % 26] as string;

  // Ensure no duplicates (if duplicate, shift by +1)
  const shift = (ch: string) => {
    const idx = letters.indexOf(ch);
    return letters[(idx + 1) % 26] as string;
  };

  if (i2 === i1) i2 = shift(i2);
  if (i3 === i1) i3 = shift(i3);
  if (i3 === i2) i3 = shift(i3);

  // still edge-case possible if shift causes collision again
  // (rare, but we guarantee uniqueness safely)
  const unique = new Set<string>();
  const final: string[] = [];

  for (const x of [i1, i2, i3]) {
    let val = x;
    while (unique.has(val)) {
      val = shift(val)!;
    }
    unique.add(val!);
    final.push(val!);
  }

  return final;
};

const SoulmateInitialFinder: React.FC = () => {
  const { lang } = useLanguageStore();
  const t = soulmateInitialsTranslations[lang as "en" | "hi"] || soulmateInitialsTranslations.en;
  const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  const [name, setName] = useState<string>("");
  const [dob, setDob] = useState<string>(""); // optional
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SoulmateResult | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const normalizedName = useMemo(() => normalizeName(name), [name]);

  const canCalculate = useMemo(() => {
    return normalizedName.length > 0;
  }, [normalizedName]);

  const stableKey = useMemo(() => {
    // seed = hash(name + "|" + dob)
    return `${normalizedName}|${dob || ""}`;
  }, [normalizedName, dob]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) return;

    setLoading(true);
    setResult(null);

    // premium feel
    await new Promise((r) => setTimeout(r, 650));

    const seed = hashSeed(stableKey);

    const initials = pickUniqueInitials(seed);

    const monthIndex = seed % 12; // 0–11
    const luckyMonth = t.months[monthIndex];

    setResult({ initials, luckyMonth: luckyMonth as string });

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

      <SoulmateNameInitialsForm
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

      {/* Results */}
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
                            <span className="block text-4xl md:text-6xl font-black text-burgundy leading-none group-hover:scale-110 transition-transform duration-500">
                              {result.initials.join(", ")}
                            </span>
                            <span className="text-[12px] font-black uppercase tracking-[4px] text-primary mt-4 block" style={fontStyle}>
                              {t.results.possibleInitials}
                            </span>
                          </div>

                          <GiSparkles className="absolute -top-4 -right-4 text-primary text-5xl animate-bounce shadow-xl" />
                        </div>
                      </div>

                      {/* Lucky Month */}
                      <div className="max-w-2xl text-center">
                        <div className="bg-burgundy text-white p-10 rounded-[3rem] shadow-2xl relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary p-4 rounded-2xl shadow-lg">
                            <TbCrystalBall size={28} />
                          </div>

                          <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90 m-0" style={fontStyle}>
                            {t.results.message}{" "}
                            <span className="font-black text-white not-italic">
                              {result.initials.join(", ")}
                            </span>
                          </p>

                          <p className="text-lg md:text-xl font-light italic leading-relaxed text-orange-100/80 mt-6 m-0" style={fontStyle}>
                            {t.results.luckyMonth}{" "}
                            <span className="font-black text-white not-italic">
                              {result.luckyMonth}
                            </span>
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

export default SoulmateInitialFinder;

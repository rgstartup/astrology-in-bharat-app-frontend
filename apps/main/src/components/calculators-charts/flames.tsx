"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaHeart,
  FaUser,
  FaArrowRight,
  FaSpinner,
  FaFire,
} from "react-icons/fa";

import { TbCrystalBall } from "react-icons/tb";
import { GiLotus, GiSparkles } from "react-icons/gi";

import CalculatorHero from "./common/hero";
import FlamesForm from "./FlamesForm.component";
import { useLanguageStore } from "@repo/store";
import { flamesTranslations } from "@/lib/translations/calculators/flames";
import { FlamesLetter, FlamesResult } from "@/lib/types/calculator";

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
  return name
    .toLowerCase()
    .replace(/\s+/g, "") // remove spaces
    .replace(/[^a-z0-9]/g, ""); // remove special chars
};

// Remove common letters one-by-one matching
const getRemainingLetterCount = (boy: string, girl: string): number => {
  const boyArr = boy.split("");
  const girlArr = girl.split("");

  for (let i = 0; i < boyArr.length; i++) {
    const ch = boyArr[i] as string;
    const idx = girlArr.indexOf(ch);
    if (idx !== -1) {
      boyArr[i] = "";
      girlArr[idx] = "";
    }
  }

  const remainingBoy = boyArr.filter(Boolean).length;
  const remainingGirl = girlArr.filter(Boolean).length;

  return remainingBoy + remainingGirl;
};

// Circular elimination using count
const getFlamesLetter = (count: number): FlamesLetter => {
  let flames: FlamesLetter[] = ["F", "L", "A", "M", "E", "S"];
  let step = count === 0 ? 1 : count;

  while (flames.length > 1) {
    const removeIndex = (step - 1) % flames.length;
    flames.splice(removeIndex, 1);
    flames = [...flames.slice(removeIndex), ...flames.slice(0, removeIndex)];
  }

  return flames[0]!;
};

const FlamesCalculator: React.FC = () => {
  const { lang } = useLanguageStore();
  const t = flamesTranslations[lang as keyof typeof flamesTranslations] || flamesTranslations.en;
  const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  const [boyName, setBoyName] = useState<string>("");
  const [girlName, setGirlName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<FlamesResult | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const normalized = useMemo(() => {
    return {
      boy: normalizeName(boyName),
      girl: normalizeName(girlName),
    };
  }, [boyName, girlName]);

  const canCalculate = useMemo(() => {
    return normalized.boy.length > 0 && normalized.girl.length > 0;
  }, [normalized.boy, normalized.girl]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) return;

    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 650));

    const count = getRemainingLetterCount(normalized.boy, normalized.girl);
    const letter = getFlamesLetter(count);
    const word = t.results.meanings[letter].word;
    const message = t.results.meanings[letter].message;

    setResult({ letter, word, count, message });

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

      <FlamesForm
        boyName={boyName}
        setBoyName={setBoyName}
        girlName={girlName}
        setGirlName={setGirlName}
        loading={loading}
        canCalculate={canCalculate}
        handleCalculate={handleCalculate}
        t={t.form}
        fontStyle={fontStyle}
      />

      {/* Result Section */}
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
                        {t.results.titlePrefix} <span className="text-primary">{result.word}</span>
                      </h2>

                      <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-16"></div>
                    </div>

                    <div className="flex flex-col items-center">
                      {/* Result Ring */}
                      <div className="relative mb-16">
                        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white shadow-2xl flex items-center justify-center p-8 border-8 border-orange-50 relative group">
                          <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent animate-spin-slow opacity-20"></div>

                          <div className="text-center">
                            <span className="block text-7xl md:text-9xl font-black text-burgundy leading-none group-hover:scale-110 transition-transform duration-500">
                              {result.letter}
                            </span>
                            <span className="text-[12px] font-black uppercase tracking-[4px] text-primary mt-4 block" style={fontStyle}>
                              {t.results.possibleInitials}
                            </span>
                          </div>

                          <FaFire className="absolute -top-4 -right-4 text-primary text-5xl animate-bounce shadow-xl" />
                        </div>
                      </div>

                      {/* Message */}
                      <div className="max-w-2xl text-center mb-14">
                        <div className="bg-burgundy text-white p-10 rounded-[3rem] shadow-2xl relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary p-4 rounded-2xl shadow-lg">
                            <GiSparkles size={28} />
                          </div>

                          <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90 m-0" style={fontStyle}>
                            "{result.message}"
                          </p>

                          <p className="text-[10px] text-orange-100/50 font-bold uppercase tracking-[3px] mt-6 m-0" style={fontStyle}>
                            {t.results.remainingCount} <span className="text-white">{result.count}</span>
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

export default FlamesCalculator;




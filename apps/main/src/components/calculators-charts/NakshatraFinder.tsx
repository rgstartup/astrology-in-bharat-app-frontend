"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  FaArrowRight,
  FaSpinner,
  FaRegCalendarAlt as FaCalendar,
  FaRegClock as FaClock,
} from "react-icons/fa";

import { TbCrystalBall } from "react-icons/tb";
import { GiLotus, GiSparkles } from "react-icons/gi";

import CalculatorHero from "./common/hero";
import NakshatraFinderForm from "./NakshatraFinderForm.component";
import { useLanguageStore } from "@repo/store";
import { nakshatraFinderTranslations } from "@/lib/translations/calculators/nakshatra-finder";
import { NakshatraResult } from "@/lib/types/calculator";

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

const NakshatraFinder: React.FC = () => {
  const { lang, toggleLang } = useLanguageStore();
  const t = nakshatraFinderTranslations[lang as "en" | "hi"] || nakshatraFinderTranslations.en;
  const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  const [dob, setDob] = useState<string>("");
  const [birthTime, setBirthTime] = useState<string>(""); // optional
  const [locationName, setLocationName] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<NakshatraResult | null>(null);
  const [error, setError] = useState<string>("");

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const canCalculate = useMemo(() => dob.length > 0 && latitude.length > 0 && longitude.length > 0, [dob, latitude, longitude]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) return;

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      
      let year = 2000, month = 1, date = 1;
      if (dob) {
        const [y, m, d] = dob.split("-");
        year = parseInt(y || "2000");
        month = parseInt(m || "1");
        date = parseInt(d || "1");
      }

      let hours = 12, minutes = 0;
      if (birthTime) {
        const [h, m] = birthTime.split(":");
        hours = parseInt(h || "12");
        minutes = parseInt(m || "0");
      }

      const apiKey = process.env.NEXT_PUBLIC_FREE_ASTROLOGY_API_KEY || "YOUR_API_KEY_HERE";
      const url = `${process.env.NEXT_PUBLIC_CALCULATOR_URL || "https://json.freeastrologyapi.com"}/planets`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          year,
          month,
          date,
          hours,
          minutes,
          seconds: 0,
          latitude: lat,
          longitude: lon,
          timezone: 5.5, // Indian Standard Time fallback
          settings: {
            observation_point: "topocentric",
            ayanamsha: "lahiri",
          },
        }),
      });

      const resData = await res.json();
      if (resData && resData.output && resData.output[0]) {
        // Find Moon from the output
        const moonData = resData.output[0]["Moon"] || resData.output[0]["moon"];
        
        if (moonData && moonData.fullDegree !== undefined) {
          const moonLongitude = parseFloat(moonData.fullDegree);
          // Calculate Nakshatra index (0 to 26)
          // 360 degrees / 27 nakshatras = 13.333333 degrees per nakshatra
          const nakshatraIndex = Math.floor(moonLongitude / (360 / 27));
          
          const index = nakshatraIndex % 27;
          const selected = t.results.nakshatras[index];

          setResult({
            name: selected!.name,
            nature: selected!.nature,
            index,
          });

          setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 200);
        } else {
          setError("Could not parse Moon position from API.");
        }
      } else {
        setError("Invalid response from API.");
      }
    } catch (err: any) {
      console.error("API Error:", err);
      setError("Failed to calculate. Please try again later.");
    } finally {
      setLoading(false);
    }
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

      <NakshatraFinderForm
        dob={dob}
        setDob={setDob}
        birthTime={birthTime}
        setBirthTime={setBirthTime}
        locationName={locationName}
        setLocationName={setLocationName}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
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
                            <span className="block text-4xl md:text-6xl font-black text-burgundy leading-none group-hover:scale-110 transition-transform duration-500" style={fontStyle}>
                              {result.name}
                            </span>
                            <span className="text-[12px] font-black uppercase tracking-[4px] text-primary mt-4 block" style={fontStyle}>
                              {t.results.label.replace("{index}", (result.index + 1).toString())}
                            </span>
                          </div>

                          <GiSparkles className="absolute -top-4 -right-4 text-primary text-5xl animate-bounce shadow-xl" />
                        </div>
                      </div>

                      {/* Nature Text */}
                      <div className="max-w-2xl text-center">
                        <div className="bg-burgundy text-white p-10 rounded-[3rem] shadow-2xl relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary p-4 rounded-2xl shadow-lg">
                            <TbCrystalBall size={28} />
                          </div>

                          <p className="text-xl md:text-2xl font-light italic leading-relaxed text-orange-100/90 m-0" style={fontStyle}>
                            {result.nature}
                          </p>

                          <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-[4px] text-orange-100/70" style={fontStyle}>
                              {t.results.disclaimer}
                            </span>
                          </div>

                          <p className="m-0 mt-6 text-xs text-orange-100/50 italic" style={fontStyle}>
                            {t.results.note}
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

export default NakshatraFinder;




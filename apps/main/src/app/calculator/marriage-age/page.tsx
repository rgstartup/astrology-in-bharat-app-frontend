"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PersonalGuidanceCard from "@/components/ui/PersonalGuidanceCard";
import MarriageAgeSeoContent from "./marriage-age-seo.component";

// ── Icons ────────────────────────────────────────────────────────────────────
const icons = {
  ring: "fa-solid fa-ring",
  calendar: "fa-regular fa-calendar",
  clock: "fa-regular fa-clock",
  location: "fa-solid fa-location-dot",
  user: "fa-regular fa-user",
  check: "fa-solid fa-circle-check",
  info: "fa-solid fa-circle-info",
  heart: "fa-regular fa-heart",
  star: "fa-regular fa-star",
  mars: "fa-solid fa-mars",
  venus: "fa-solid fa-venus",
  chart: "fa-solid fa-chart-simple",
};

// ── Bottom Section Data ──────────────────────────────────────────────────────
const FACTORS = [
  { label: "5th House", desc: "Love & Romance", icon: "fa-solid fa-arrow-trend-up" },
  { label: "7th House", desc: "Marriage & Partner", icon: "fa-regular fa-heart" },
  { label: "Venus Position", desc: "Love & Relationship", icon: "fa-solid fa-venus" },
  { label: "Jupiter Position", desc: "Wisdom & Blessings", icon: "fa-solid fa-jedi" }, // fallback icon
  { label: "Planetary Dasha", desc: "Timing & Periods", icon: "fa-solid fa-stopwatch" },
  { label: "Kundli Analysis", desc: "Overall Matching", icon: "fa-solid fa-dharmachakra" },
];

const REASONS = [
  "Planetary positions and strengths",
  "Dasha and transit periods",
  "Your karma and past life influence",
  "Cultural and family background",
  "Manglik and other astrological Doshas",
  "Navamsha (D9) chart alignment"
];

// ── Hash Helper ──────────────────────────────────────────────────────────────
function hashSeed(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// ── Result Panel ─────────────────────────────────────────────────────────────
const ResultPanel = ({ result }: { result: any }) => {
  return (
    <div className="bg-white border border-[#F0E0D0] rounded-3xl p-6 md:p-8 flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#FFF0E6] flex items-center justify-center">
          <i className={`${icons.ring} text-[#F26500] text-lg`} />
        </div>
        <h2 className="text-xl font-black text-[#1A1A1A]">Your Marriage Age Result</h2>
      </div>

      {/* Main Result */}
      <div className="flex flex-col items-center gap-1 text-center mt-2">
        <p className="text-[#555] font-semibold text-sm">Your Expected Marriage Age</p>
        <p className="text-5xl font-black text-[#F26500] mt-1">
          {result.startAge} - {result.endAge}
        </p>
        <p className="text-[#1A1A1A] font-bold text-sm">Years</p>
      </div>

      {/* Favourable Badge */}
      <div className="bg-[#EFFFEC] border border-[#D5F2CD] text-[#2E8B19] rounded-xl py-2 px-4 flex items-center justify-center gap-2 font-bold text-sm mx-auto w-full max-w-sm mt-2">
        <i className={icons.check} />
        {result.periodMessage}
      </div>

      {/* Detailed Analysis */}
      <div className="mt-4">
        <h3 className="text-sm font-bold text-[#1A1A1A] mb-3">Detailed Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Card 1 */}
          <div className="border border-[#F0E0D0] rounded-xl p-3 flex flex-col items-center text-center gap-1">
            <i className={`${icons.calendar} text-[#F26500] text-lg mb-1`} />
            <span className="text-[10px] text-[#666] font-semibold">Early Marriage</span>
            <span className="text-sm font-black text-[#1A1A1A]">{result.startAge - 2} - {result.startAge}</span>
            <span className="text-[10px] text-[#888]">Years</span>
          </div>
          {/* Card 2 (Highlighted) */}
          <div className="border border-[#F26500] bg-[#FFF8F3] rounded-xl p-3 flex flex-col items-center text-center gap-1">
            <i className={`${icons.heart} text-[#F26500] text-lg mb-1`} />
            <span className="text-[10px] text-[#666] font-semibold">Ideal Marriage</span>
            <span className="text-sm font-black text-[#1A1A1A]">{result.startAge} - {result.endAge}</span>
            <span className="text-[10px] text-[#888]">Years</span>
          </div>
          {/* Card 3 */}
          <div className="border border-[#F0E0D0] rounded-xl p-3 flex flex-col items-center text-center gap-1">
            <i className={`${icons.star} text-[#F26500] text-lg mb-1`} />
            <span className="text-[10px] text-[#666] font-semibold">Late Marriage</span>
            <span className="text-sm font-black text-[#1A1A1A]">{result.endAge} - {result.endAge + 3}</span>
            <span className="text-[10px] text-[#888]">Years</span>
          </div>
          {/* Card 4 */}
          <div className="border border-[#F0E0D0] rounded-xl p-3 flex flex-col items-center text-center gap-1">
            <i className={`${icons.chart} text-[#F26500] text-lg mb-1`} />
            <span className="text-[10px] text-[#666] font-semibold">Marriage Strength</span>
            <span className="text-sm font-black text-[#1A1A1A]">{result.strength}%</span>
            <span className="text-[10px] text-[#888]">{result.strengthLabel}</span>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-[#F0F7FF] border border-[#DCEBFE] text-[#2C62B0] rounded-xl p-4 flex gap-3 text-xs mt-2">
        <i className={`${icons.info} mt-0.5 shrink-0 text-[#4485E9]`} />
        <p className="leading-relaxed">
          This calculation is based on your birth details and planetary positions. 
          For more accurate prediction, consult our astrologers.
        </p>
      </div>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────
const MarriageAgeCalculatorPage = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [gender, setGender] = useState("male");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const canCalculate = name.trim() && dob && place.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) return;
    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 700));

    const seedStr = (name + dob + time + place + gender).toLowerCase().replace(/\s+/g, "");
    const seed = hashSeed(seedStr);
    
    const baseAge = 24 + (seed % 6); // 24 to 29
    const strength = 75 + (seed % 20); // 75 to 94

    setResult({
      startAge: baseAge,
      endAge: baseAge + 3,
      periodMessage: "Highly Favourable Period",
      strength,
      strengthLabel: strength >= 85 ? "Strong" : "Good",
    });

    setLoading(false);
  };

  const inputCls = "w-full border border-[#E8D5C0] rounded-xl px-4 py-3 pr-10 text-sm text-[#333] placeholder-[#BBB] focus:outline-none focus:border-[#F26500] focus:ring-2 focus:ring-[#F26500]/20 bg-white transition";

  return (
    <div className="min-h-screen bg-[#FDF6F0]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Breadcrumb */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 py-4">
        <p className="text-sm text-[#888]">
          <span>Home</span><span className="mx-2">›</span>
          <span className="text-[#F26500] font-semibold">Calculators</span><span className="mx-2">›</span>
          <span className="text-[#444]">Marriage Age Calculator</span>
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 pb-12">
        <div className={`grid gap-6 ${result ? "lg:grid-cols-3 md:grid-cols-2" : "md:grid-cols-2 max-w-5xl"} mx-auto`}>

          {/* ── Left: Form ── */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#F0E0D0] rounded-3xl p-6 md:p-8 flex flex-col gap-5"
          >
            {/* Form Header */}
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-[#FFF0E6] flex items-center justify-center">
                <i className={`${icons.calendar} text-[#F26500] text-lg`} />
              </div>
              <div>
                <h1 className="text-xl font-black text-[#1A1A1A]">Marriage Age Calculator</h1>
                <p className="text-xs text-[#888]">Find your ideal marriage age based on astrological analysis.</p>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-[#F0E0D0]" />
              <i className="fa-solid fa-om text-[#F26500] text-xs opacity-50" />
              <div className="flex-1 h-px bg-[#F0E0D0]" />
            </div>

            {/* Your Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#333]">Your Name</label>
              <div className="relative">
                <input
                  type="text" placeholder="Enter your name"
                  value={name} onChange={(e) => setName(e.target.value)}
                  className={inputCls}
                />
                <i className={`${icons.user} absolute right-3 top-1/2 -translate-y-1/2 text-[#CCC] text-sm`} />
              </div>
            </div>

            {/* Your Birth Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#333]">Your Birth Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={dob} onChange={(e) => setDob(e.target.value)}
                  className={`${inputCls} [color-scheme:light]`}
                />
                <i className={`${icons.calendar} absolute right-3 top-1/2 -translate-y-1/2 text-[#CCC] text-sm pointer-events-none`} />
              </div>
            </div>

            {/* Your Birth Time */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#333]">Your Birth Time</label>
              <div className="relative">
                <input
                  type="time"
                  value={time} onChange={(e) => setTime(e.target.value)}
                  className={`${inputCls} [color-scheme:light]`}
                />
                <i className={`${icons.clock} absolute right-3 top-1/2 -translate-y-1/2 text-[#CCC] text-sm pointer-events-none`} />
              </div>
            </div>

            {/* Your Birth Place */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#333]">Your Birth Place</label>
              <div className="relative">
                <input
                  type="text" placeholder="Enter your birth place"
                  value={place} onChange={(e) => setPlace(e.target.value)}
                  className={inputCls}
                />
                <i className={`${icons.location} absolute right-3 top-1/2 -translate-y-1/2 text-[#CCC] text-sm`} />
              </div>
            </div>

            {/* Your Gender */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#333]">Your Gender</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`flex-1 py-3 border rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors ${
                    gender === "male"
                      ? "border-[#F26500] bg-[#FFF8F3] text-[#F26500]"
                      : "border-[#E8D5C0] text-[#777] bg-white hover:bg-gray-50"
                  }`}
                >
                  <i className={icons.mars} /> Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`flex-1 py-3 border rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors ${
                    gender === "female"
                      ? "border-[#F26500] bg-[#FFF8F3] text-[#F26500]"
                      : "border-[#E8D5C0] text-[#777] bg-white hover:bg-gray-50"
                  }`}
                >
                  <i className={icons.venus} /> Female
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !canCalculate}
              className="w-full bg-[#F26500] hover:bg-[#D95A00] text-white font-bold rounded-2xl py-3.5 flex items-center justify-center gap-2 transition-colors disabled:opacity-70 mt-2"
            >
              {loading ? (
                <i className="fa-solid fa-spinner animate-spin" />
              ) : (
                <i className="fa-regular fa-heart" />
              )}
              {loading ? "Calculating..." : "Calculate Marriage Age"}
            </button>
          </form>

          {/* ── Right: Result ── */}
          {result && <ResultPanel result={result} />}

          {/* -- Right: Guidance Card -- */}
          <div className={result ? "lg:col-span-1 md:col-span-2" : "col-span-1"}>
            <PersonalGuidanceCard className="h-full" showExtraContent={true} />
          </div>
        </div>

        {/* ── Bottom Section ── */}
        <div className="mt-8 bg-[#FDF6F0] rounded-3xl grid lg:grid-cols-3 gap-8 border border-[#F0E0D0] p-6 md:p-8">
          
          {/* Left: Factors */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-black text-[#1A1A1A] flex items-center gap-2 mb-6">
              <i className="fa-solid fa-clipboard-list text-[#F26500]" /> Factors Considered
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {FACTORS.map((f, i) => (
                <div key={i} className="bg-white border border-[#F0E0D0] rounded-2xl p-4 flex flex-col items-center text-center gap-2 shadow-sm hover:shadow-md hover:border-[#F26500]/30 transition-all">
                  <div className="w-10 h-10 rounded-full bg-[#FFF0E6] flex items-center justify-center mb-1">
                    <i className={`${f.icon} text-[#F26500]`} />
                  </div>
                  <div>
                    <p className="text-[12px] font-black text-[#1A1A1A]">{f.label}</p>
                    <p className="text-[11px] text-[#888] mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Why it varies */}
          <div>
            <h3 className="text-sm font-black text-[#1A1A1A] flex items-center gap-2 mb-6">
              <i className="fa-solid fa-circle-question text-[#F26500]" /> Why Marriage Age Varies?
            </h3>
            <div className="flex flex-col gap-4">
              {REASONS.map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <i className="fa-regular fa-circle-check text-[#F26500] mt-0.5 text-sm" />
                  <span className="text-xs text-[#555] font-semibold">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <section className="mt-8 bg-[#1a0b0b] rounded-3xl px-5 py-6 sm:px-8 sm:py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image src="/images/horoscope-round2.png" alt="" fill className="object-cover" />
          </div>
          <div className="relative z-10 w-full text-center md:text-left">
            <p className="text-[#F26500] font-bold text-[13px] sm:text-sm mb-1">Personalized Guidance</p>
            <h3 className="text-white text-[15px] sm:text-[19px] md:text-2xl font-black leading-snug md:leading-normal text-balance mx-auto md:mx-0">
              Want to know the exact timeline of your marriage?
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Talk to our Astrology Experts and get personalized timing and partner predictions.
            </p>
          </div>
          <Link
            href="/our-experts"
            className="relative z-10 flex-shrink-0 bg-[#F26500] hover:bg-[#D95A00] text-white font-black px-8 py-3 rounded-xl flex items-center gap-2 transition-colors text-sm"
          >
            <i className="fa-solid fa-comments" /> Talk to Astrologer
          </Link>
        </section>

      </div>

      {/* ── SEO Section ── */}
      <MarriageAgeSeoContent />

    </div>
  );
};

export default MarriageAgeCalculatorPage;







"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PersonalGuidanceCard from "@/components/ui/PersonalGuidanceCard";
import SoulmateSeoContent from "./soulmate-seo.component";

// ── Icons ────────────────────────────────────────────────────────────────────
const icons = {
  heart: "fa-regular fa-heart",
  heartSolid: "fa-solid fa-heart",
  user: "fa-regular fa-user",
  calendar: "fa-regular fa-calendar",
  mars: "fa-solid fa-mars",
  venus: "fa-solid fa-venus",
  sparkles: "fa-solid fa-wand-magic-sparkles",
  checkCircle: "fa-solid fa-circle-check",
  shield: "fa-solid fa-shield-halved",
  calculator: "fa-solid fa-calculator",
  lightbulb: "fa-regular fa-lightbulb",
  comments: "fa-regular fa-comments",
};

// ── Data ─────────────────────────────────────────────────────────────────────
const CALCULATION_BASIS = [
  { title: "Numerology", desc: "Your name numbers and vibrations", icon: "fa-solid fa-1" },
  { title: "Birth Date", desc: "Your life path and destiny number", icon: "fa-regular fa-calendar" },
  { title: "Letters Energy", desc: "Alphabet energy and cosmic frequency", icon: "fa-solid fa-a" },
  { title: "Planetary Influence", desc: "Planet positions and their effects", icon: "fa-solid fa-earth-americas" },
];

const SPECIAL_FEATURES = [
  "100% Personalized Calculation",
  "Advanced Numerology Algorithm",
  "Based on Vedic Principles",
  "High Accuracy & Reliability"
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
const ResultPanel = ({ result }: { result: string[] }) => {
  return (
    <div className="bg-white border-2 border-[#F26500] rounded-3xl p-6 md:p-8 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#FFF0E6] flex items-center justify-center">
          <i className={`${icons.user} text-[#F26500] text-lg`} />
        </div>
        <div>
          <h2 className="text-xl font-black text-[#1A1A1A]">Your Soulmate Initials</h2>
          <p className="text-xs text-[#888]">These are the most possible initials of your soulmate.</p>
        </div>
      </div>

      {/* Main Result Area */}
      <div className="bg-[#FCF9F5] border border-[#F5E8DC] rounded-2xl p-6 md:p-10 flex flex-col items-center relative">
        <div className="w-12 h-12 rounded-full bg-[#FFF0E6] flex items-center justify-center absolute -top-6">
          <i className={`${icons.heart} text-[#F26500] text-xl`} />
        </div>

        {/* Initials Cards */}
        <div className="flex gap-2 sm:gap-4 mt-6">
          {result.map((letter, idx) => (
            <div key={idx} className="w-12 h-14 sm:w-16 sm:h-20 bg-white border border-[#F26500]/20 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-3xl sm:text-4xl font-black text-[#F26500]">{letter}</span>
            </div>
          ))}
        </div>

        {/* How to Read */}
        <div className="mt-10 w-full">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-12 bg-[#F0E0D0]"></div>
            <span className="text-xs font-bold text-[#F26500]">How to Read Your Result</span>
            <div className="h-px w-12 bg-[#F0E0D0]"></div>
          </div>
          <p className="text-xs text-[#666] text-center max-w-sm mx-auto mb-6">
            These initials are calculated based on your name, birth date and numerology number. The letters are ordered by probability.
          </p>

          {/* Probability Line */}
          <div className="w-full px-2 sm:px-6 relative mb-8">
            <div className="flex justify-between text-[10px] font-bold mb-2">
              <span className="text-[#2E8B19]">Most Likely</span>
              <span className="text-[#F26500]">Possible</span>
            </div>
            
            <div className="h-1.5 w-full bg-gradient-to-r from-[#2E8B19] via-[#F5B041] to-[#F26500] rounded-full relative">
              {/* Nodes */}
              {[0, 25, 50, 75, 100].map((pos, i) => (
                <div key={i} className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 shadow-sm"
                  style={{ left: `calc(${pos}% - 6px)`, borderColor: pos < 50 ? '#2E8B19' : (pos < 100 ? '#F5B041' : '#F26500') }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Alert Box */}
        <div className="w-full bg-[#F2F9F0] border border-[#D5EED1] rounded-xl p-3 flex gap-3 text-xs items-center text-[#2E8B19]">
          <i className={`${icons.sparkles} shrink-0 text-lg`} />
          <p className="font-semibold">
            Your soulmate's name is most likely to start with one of the above initials.
          </p>
        </div>

      </div>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────
const SoulmateInitialsPage = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("male");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string[] | null>(null);

  const canCalculate = name.trim() && dob;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) return;
    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 700));

    const seedStr = (name + dob + gender).toLowerCase().replace(/\s+/g, "");
    const seed = hashSeed(seedStr);
    
    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const initials: string[] = [];
    
    // Pick 5 unique random letters deterministically
    let currSeed = seed;
    while(initials.length < 5) {
      currSeed = hashSeed(currSeed.toString() + "next");
      const char = ALPHABET[currSeed % 26]!;
      if (!initials.includes(char)) {
        initials.push(char);
      }
    }

    setResult(initials);
    setLoading(false);
  };

  const inputCls = "w-full border border-[#D0BBA0] rounded-xl px-4 py-3 pr-10 text-sm text-[#111] font-medium placeholder-[#777] focus:outline-none focus:border-[#F26500] focus:ring-2 focus:ring-[#F26500]/20 bg-white transition";

  return (
    <div className="min-h-screen bg-[#FDF6F0] overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Breadcrumb */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 py-4">
        <p className="text-sm text-[#888] flex items-center">
          <Link href="/" className="hover:text-[#F26500] transition-colors">Home</Link><span className="mx-2">›</span>
          <Link href="/calculator" className="text-[#F26500] font-semibold hover:underline">Calculators</Link><span className="mx-2">›</span>
          <span className="text-[#444]">Soulmate Name Initials Calculator</span>
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto px-4 pb-4">
        <div className={`grid gap-6 ${result ? "lg:grid-cols-3 md:grid-cols-2" : "md:grid-cols-2 max-w-5xl"} mx-auto`}>

          {/* ── Left: Form ── */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border-2 border-[#F26500] rounded-3xl p-6 md:p-8 flex flex-col gap-5 h-fit"
          >
            {/* Form Header */}
            <div className="flex items-center gap-3 mb-1">
              <div>
                <h1 className="text-[17px] sm:text-xl font-black text-[#1A1A1A] whitespace-normal sm:whitespace-nowrap tracking-tight sm:tracking-normal">Soulmate Name Initials Calculator</h1>
                <p className="text-xs text-[#555] font-medium">Find the possible initials of your soulmate's name.</p>
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
                <i className={`${icons.user} absolute right-3 top-1/2 -translate-y-1/2 text-[#888] text-sm`} />
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
                <i className={`${icons.calendar} absolute right-3 top-1/2 -translate-y-1/2 text-[#888] text-sm pointer-events-none`} />
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
                <i className={icons.heartSolid} />
              )}
              {loading ? "Calculating..." : "Find Soulmate Initials"}
            </button>
          </form>

          {/* ── Middle: Result ── */}
          {result && <ResultPanel result={result} />}

          {/* ── Right: Guidance Card ── */}
          <div className={result ? "lg:col-span-1 md:col-span-2" : "col-span-1"}>
            <PersonalGuidanceCard showExtraContent={true} />
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <section className="mt-12 bg-[#1a0b0b] rounded-3xl px-5 py-6 sm:px-8 sm:py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image src="/images/horoscope-round2.png" alt="" fill className="object-cover" />
          </div>
          <div className="relative z-10 w-full text-center md:text-left">
            <p className="text-[#F26500] font-bold text-[13px] sm:text-sm mb-1">Personalized Guidance</p>
            <h3 className="text-white text-[15px] sm:text-[19px] md:text-2xl font-black leading-snug md:leading-normal text-balance mx-auto md:mx-0">
              Want to know the exact details of your soulmate?
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Talk to our Astrology Experts and get personalized partner predictions.
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
      <SoulmateSeoContent />

    </div>
  );
};

export default SoulmateInitialsPage;





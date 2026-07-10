"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import NakshatraSeoContent from "./nakshatra-seo.component";
import PersonalGuidanceCard from "@/components/ui/PersonalGuidanceCard";

// ── 27 Nakshatras Data ────────────────────────────────────────────────────────
const NAKSHATRAS = [
  { name: "Ashwini", lord: "Ketu", symbol: "Horse Head", trait: "Swift, energetic, pioneering spirit. Natural healer and initiator." },
  { name: "Bharani", lord: "Venus", symbol: "Yoni", trait: "Creative, determined, passionate. Strong sense of justice." },
  { name: "Krittika", lord: "Sun", symbol: "Razor/Flame", trait: "Sharp, courageous, purifying. Natural leader with fiery energy." },
  { name: "Rohini", lord: "Moon", symbol: "Chariot", trait: "Charming, creative, materialistic. Fertile and growth-oriented." },
  { name: "Mrigashira", lord: "Mars", symbol: "Deer Head", trait: "Gentle, curious, searching soul. Love for travel and exploration." },
  { name: "Ardra", lord: "Rahu", symbol: "Teardrop", trait: "Intense, transformative, intellectually sharp. Seeks truth." },
  { name: "Punarvasu", lord: "Jupiter", symbol: "Quiver of Arrows", trait: "Optimistic, nurturing, generous. Bounces back from adversity." },
  { name: "Pushya", lord: "Saturn", symbol: "Lotus", trait: "Nourishing, devoted, protective. The most auspicious nakshatra." },
  { name: "Ashlesha", lord: "Mercury", symbol: "Serpent", trait: "Penetrating mind, shrewd, mysterious. Deep intuition." },
  { name: "Magha", lord: "Ketu", symbol: "Throne", trait: "Regal, proud, ancestral. Strong connection to lineage and power." },
  { name: "Purva Phalguni", lord: "Venus", symbol: "Hammock", trait: "Charming, creative, love of beauty and pleasure." },
  { name: "Uttara Phalguni", lord: "Sun", symbol: "Bed", trait: "Service-oriented, friendly, reliable. Brings prosperity." },
  { name: "Hasta", lord: "Moon", symbol: "Hand", trait: "Skilled, humorous, resourceful. Excellent craftsman energy." },
  { name: "Chitra", lord: "Mars", symbol: "Pearl/Gem", trait: "Artistic, magnetic, perfectionistic. Love of beauty." },
  { name: "Swati", lord: "Rahu", symbol: "Young Plant", trait: "Independent, diplomatic, flexible. Like a grass in wind." },
  { name: "Vishakha", lord: "Jupiter", symbol: "Triumphal Arch", trait: "Goal-oriented, ambitious, determined. Focused on achievement." },
  { name: "Anuradha", lord: "Saturn", symbol: "Lotus", trait: "Devoted, friendly, organizational skills. Succeeds in groups." },
  { name: "Jyeshtha", lord: "Mercury", symbol: "Circular Amulet", trait: "Protective, responsible, eldest sibling energy. Occult interest." },
  { name: "Mula", lord: "Ketu", symbol: "Root/Bunch of Roots", trait: "Investigative, transformative, goes to the root of things." },
  { name: "Purva Ashadha", lord: "Venus", symbol: "Elephant Tusk", trait: "Invincible, proud, early victories. Strong persuasive power." },
  { name: "Uttara Ashadha", lord: "Sun", symbol: "Elephant Tusk", trait: "Righteous, responsible, universal appeal. Long-lasting success." },
  { name: "Shravana", lord: "Moon", symbol: "Ear/Three Footprints", trait: "Listener, learner, connects people. Knowledge and media." },
  { name: "Dhanishtha", lord: "Mars", symbol: "Drum", trait: "Abundant, musical, group-oriented. Wealth and prosperity." },
  { name: "Shatabhisha", lord: "Rahu", symbol: "Circle/Empty Circle", trait: "Healing, secretive, unique. Seeks solitude and mysticism." },
  { name: "Purva Bhadrapada", lord: "Jupiter", symbol: "Sword/Two-faced Man", trait: "Intense, idealistic, passionate. Transforms through fire." },
  { name: "Uttara Bhadrapada", lord: "Saturn", symbol: "Twins/Back Legs of Funeral Cot", trait: "Wise, disciplined, deeply spiritual. Gains through patience." },
  { name: "Revati", lord: "Mercury", symbol: "Fish/Drum", trait: "Nurturing, compassionate, journey-completion. Gentle soul." },
];

const calculateNakshatra = (dob: string): number => {
  if (!dob) return 0;
  const d = new Date(dob);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  // Simple deterministic hash based on date
  const hash = (day * 7 + month * 13 + (year % 100) * 3) % 27;
  return hash;
};

export default function NakshatraFinderPage() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ index: number; nakshatra: typeof NAKSHATRAS[0] } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dob) return;
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 800));
    const idx = calculateNakshatra(dob);
    setResult({ index: idx, nakshatra: NAKSHATRAS[idx]! });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDF6F0] overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Breadcrumb */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 py-4">
        <p className="text-sm text-[#888] flex items-center">
          <Link href="/" className="hover:text-[#F26500] transition-colors">Home</Link><span className="mx-2">›</span>
          <Link href="/calculator" className="text-[#F26500] font-semibold hover:underline">Calculators</Link><span className="mx-2">›</span>
          <span className="text-[#444]">Nakshatra Finder</span>
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 pb-4">
        <div className={`grid gap-6 ${result ? "lg:grid-cols-3 md:grid-cols-2" : "md:grid-cols-2 max-w-5xl mx-auto"}`}>

          {/* ── Left: Form ── */}
          <form onSubmit={handleSubmit} className="bg-white border-2 border-[#F26500] rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-[#1A1A1A] leading-tight">Nakshatra Finder</h1>
                <p className="text-xs md:text-sm text-[#888] mt-1">Discover your birth star based on your date of birth</p>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#F0E0D0] to-transparent" />

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#333]">Your Name</label>
                <div className="relative">
                  <input
                    type="text" placeholder="Enter your full name"
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full border-2 border-[#F0E0D0] rounded-xl px-4 py-3.5 pr-10 text-sm text-[#333] placeholder-[#BBB] focus:outline-none focus:border-[#F26500] focus:ring-4 focus:ring-[#F26500]/10 bg-white transition-all font-medium"
                  />
                  <i className="fa-regular fa-user absolute right-4 top-1/2 -translate-y-1/2 text-[#CCC]" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#333]">Date of Birth</label>
                <input
                  type="date" value={dob} onChange={(e) => setDob(e.target.value)}
                  className="w-full border-2 border-[#F0E0D0] rounded-xl px-4 py-3.5 text-sm text-[#333] focus:outline-none focus:border-[#F26500] focus:ring-4 focus:ring-[#F26500]/10 bg-white transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit" disabled={!name.trim() || !dob || loading}
              className="mt-2 w-full bg-gradient-to-r from-[#F26500] to-[#E65A00] hover:from-[#E65A00] hover:to-[#D95A00] disabled:opacity-50 text-white font-black rounded-xl py-4 flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {loading ? <><i className="fa-solid fa-spinner animate-spin" /> Finding...</> : <><i className="fa-solid fa-sparkles" /> Find My Nakshatra</>}
            </button>
          </form>

          {/* ── Middle: Result ── */}
          {result && (
            <div className="bg-white border-2 border-[#F26500] rounded-3xl p-6 md:p-8 flex flex-col gap-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F26500]/5 rounded-bl-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F26500]/5 rounded-tr-full pointer-events-none" />

              <h2 className="text-[#F26500] font-black text-sm uppercase tracking-wider">Your Nakshatra</h2>

              {/* Nakshatra Name */}
              <div className="flex flex-col items-center py-4">
                <div className="w-28 h-28 rounded-full bg-[#FFF8F3] border-4 border-[#F26500]/20 flex items-center justify-center mb-4 shadow-md">
                  <i className="fa-solid fa-star text-[#F26500] text-4xl" />
                </div>
                <h3 className="text-3xl font-black text-[#1A1A1A]">{result.nakshatra.name}</h3>
                <p className="text-sm text-[#F26500] font-bold mt-1">Nakshatra #{result.index + 1} of 27</p>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-3 relative z-10">
                <div className="flex items-center justify-between bg-[#FFF8F3] border border-[#F5E0CC] rounded-xl px-4 py-3">
                  <span className="text-sm text-[#666] flex items-center gap-2"><i className="fa-solid fa-planet-ringed text-[#F26500]" /> Ruling Lord</span>
                  <span className="text-sm font-bold text-[#1A1A1A]">{result.nakshatra.lord}</span>
                </div>
                <div className="flex items-center justify-between bg-[#FFF8F3] border border-[#F5E0CC] rounded-xl px-4 py-3">
                  <span className="text-sm text-[#666] flex items-center gap-2"><i className="fa-solid fa-shapes text-[#F26500]" /> Symbol</span>
                  <span className="text-sm font-bold text-[#1A1A1A]">{result.nakshatra.symbol}</span>
                </div>
                <div className="bg-[#F9F9F9] border border-[#EEE] rounded-xl p-4">
                  <p className="text-xs font-bold text-[#888] uppercase tracking-wider mb-2">Personality</p>
                  <p className="text-sm text-[#444] font-medium leading-relaxed">{result.nakshatra.trait}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Right: Guidance Card ── */}
          <div className={result ? "lg:col-span-1 md:col-span-2" : "col-span-1"}>
            <PersonalGuidanceCard showExtraContent={true} />
          </div>
        </div>

        {/* All 27 Nakshatras */}
        <div className="mt-12">
          <h2 className="text-xl font-black text-[#1A1A1A] flex items-center gap-2 mb-6">
            <i className="fa-solid fa-star-and-crescent text-[#F26500]" /> All 27 Nakshatras
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {NAKSHATRAS.map((n, i) => (
              <div
                key={i}
                className={`bg-white border-2 border-[#F26500] rounded-2xl p-4 flex flex-col gap-1 text-center transition-all hover:shadow-md ${result?.index === i ? "bg-[#FFF8F3] shadow-md scale-[1.02]" : ""}`}
              >
                <span className={`text-[13px] font-black uppercase tracking-wider ${result?.index === i ? "text-[#F26500]" : "text-[#888]"}`}>#{i + 1}</span>
                <span className={`text-[17px] font-black leading-tight ${result?.index === i ? "text-[#F26500]" : "text-[#1A1A1A]"}`}>{n.name}</span>
                <span className="text-[13px] font-bold text-[#555] mt-1">{n.lord}</span>
              </div>
            ))}
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
              Want deeper insights into your Nakshatra?
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Talk to our expert astrologers for a personalized Nakshatra reading.
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
      <NakshatraSeoContent />

    </div>
  );
}

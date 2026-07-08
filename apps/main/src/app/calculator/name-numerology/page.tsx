"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PersonalGuidanceCard from "@/components/ui/PersonalGuidanceCard";
import NameNumerologySeoContent from "./name-numerology-seo.component";

// ── Pythagorean Numerology ────────────────────────────────────────────────────
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

const reduceNumber = (n: number): number => {
  let current = n;
  while (current > 9 && current !== 11 && current !== 22) {
    current = String(current).split("").reduce((a, d) => a + Number(d), 0);
  }
  return current;
};

const NUMBER_MEANINGS: Record<number, { title: string; desc: string; traits: string[] }> = {
  1:  { title: "The Leader",       desc: "Independent, original, and ambitious.",       traits: ["Leadership", "Independence", "Innovation"] },
  2:  { title: "The Diplomat",     desc: "Cooperative, sensitive, and harmonious.",      traits: ["Harmony", "Cooperation", "Empathy"] },
  3:  { title: "The Creative",     desc: "Expressive, joyful, and communicative.",       traits: ["Creativity", "Expression", "Joy"] },
  4:  { title: "The Builder",      desc: "Practical, hardworking, and dependable.",      traits: ["Discipline", "Stability", "Loyalty"] },
  5:  { title: "The Explorer",     desc: "Adventurous, versatile, and freedom-loving.",  traits: ["Freedom", "Adventure", "Versatility"] },
  6:  { title: "The Nurturer",     desc: "Responsible, loving, and protective.",         traits: ["Compassion", "Responsibility", "Love"] },
  7:  { title: "The Seeker",       desc: "Analytical, introspective, and spiritual.",    traits: ["Wisdom", "Intuition", "Analysis"] },
  8:  { title: "The Powerhouse",   desc: "Ambitious, authoritative, and goal-driven.",   traits: ["Power", "Success", "Abundance"] },
  9:  { title: "The Humanitarian", desc: "Compassionate, generous, and idealistic.",     traits: ["Generosity", "Wisdom", "Compassion"] },
  11: { title: "The Illuminator",  desc: "Highly intuitive, inspiring, and visionary.",  traits: ["Intuition", "Vision", "Inspiration"] },
  22: { title: "Master Builder",   desc: "Manifests grand visions into reality.",        traits: ["Mastery", "Vision", "Legacy"] },
};

export default function NameNumerologyPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ number: number; total: number; meaning: typeof NUMBER_MEANINGS[1] } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 700));

    let total = 0;
    for (const ch of name) total += letterValue(ch);
    const reduced = reduceNumber(total);
    setResult({
      number: reduced,
      total,
      meaning: NUMBER_MEANINGS[reduced] || NUMBER_MEANINGS[1]!,
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDF6F0]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Breadcrumb */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 py-4">
        <p className="text-sm text-[#888]">
          <span>Home</span><span className="mx-2">›</span>
          <span className="text-[#F26500] font-semibold">Calculators</span><span className="mx-2">›</span>
          <span className="text-[#444]">Name Numerology</span>
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 pb-12">
        <div className={`grid gap-6 ${result ? "lg:grid-cols-3 md:grid-cols-2" : "md:grid-cols-2 max-w-5xl mx-auto"}`}>

          {/* ── Left: Form ── */}
          <form onSubmit={handleSubmit} className="bg-white border border-[#F0E0D0] rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FFF0E6] flex items-center justify-center shrink-0">
                <i className="fa-solid fa-hashtag text-[#F26500] text-xl" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-[#1A1A1A] leading-tight">Name Numerology</h1>
                <p className="text-xs md:text-sm text-[#888] mt-1">Discover the hidden power of your name through numbers</p>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#F0E0D0] to-transparent" />

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#333]">Your Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-2 border-[#F0E0D0] rounded-xl px-4 py-3.5 pr-10 text-sm text-[#333] placeholder-[#BBB] focus:outline-none focus:border-[#F26500] focus:ring-4 focus:ring-[#F26500]/10 bg-white transition-all font-medium"
                  />
                  <i className="fa-regular fa-user absolute right-4 top-1/2 -translate-y-1/2 text-[#CCC]" />
                </div>
              </div>

              {/* Live letter values */}
              {name.trim() && (
                <div className="bg-[#FFF8F3] border border-[#F5E0CC] rounded-xl p-4">
                  <p className="text-xs font-bold text-[#888] uppercase tracking-wide mb-3">Letter Values (Pythagorean)</p>
                  <div className="flex flex-wrap gap-2">
                    {name.split("").map((ch, i) => (
                      letterValue(ch) > 0 ? (
                        <div key={i} className="flex flex-col items-center bg-white border border-[#F0E0D0] rounded-lg px-2 py-1 min-w-[32px]">
                          <span className="text-xs font-black text-[#1A1A1A] uppercase">{ch}</span>
                          <span className="text-[10px] font-bold text-[#F26500]">{letterValue(ch)}</span>
                        </div>
                      ) : ch === " " ? (
                        <div key={i} className="w-4" />
                      ) : null
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="mt-2 w-full bg-gradient-to-r from-[#F26500] to-[#E65A00] hover:from-[#E65A00] hover:to-[#D95A00] disabled:opacity-50 text-white font-black rounded-xl py-4 flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {loading ? <><i className="fa-solid fa-spinner animate-spin" /> Calculating...</> : <><i className="fa-solid fa-sparkles" /> Calculate Name Number</>}
            </button>
          </form>

          {/* ── Middle: Result ── */}
          {result && (
            <div className="bg-white border border-[#F0E0D0] rounded-3xl p-6 md:p-8 flex flex-col items-center text-center gap-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F26500]/5 rounded-bl-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F26500]/5 rounded-tr-full pointer-events-none" />

              <h2 className="text-[#F26500] font-black text-sm uppercase tracking-wider">Your Name Number</h2>

              {/* Big Number */}
              <div className="w-36 h-36 rounded-full bg-[#FFF8F3] border-8 border-white ring-4 ring-[#F26500]/20 shadow-xl flex items-center justify-center">
                <span className="text-6xl font-black text-[#F26500]">{result.number}</span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#1A1A1A]">{result.meaning.title}</h3>
                <p className="text-sm text-[#666] mt-1 font-medium">{result.meaning.desc}</p>
              </div>

              {/* Traits */}
              <div className="flex flex-wrap gap-2 justify-center">
                {result.meaning.traits.map((t) => (
                  <span key={t} className="bg-[#FFF0E6] border border-[#F5E0CC] text-[#F26500] text-xs font-black px-3 py-1.5 rounded-full">
                    {t}
                  </span>
                ))}
              </div>

              {/* Total info */}
              <div className="w-full bg-[#F9F9F9] border border-[#EEE] rounded-2xl p-4 text-left relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#666]">Total letter sum</span>
                  <span className="text-sm font-bold text-[#1A1A1A]">{result.total}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-[#666]">Reduced to</span>
                  <span className="text-sm font-bold text-[#F26500]">{result.number}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Right: Guidance Card ── */}
          <div className={result ? "lg:col-span-1 md:col-span-2" : "col-span-1"}>
            <PersonalGuidanceCard showExtraContent={true} />
          </div>
        </div>

        {/* All Numbers Reference */}
        <div className="mt-12">
          <h2 className="text-xl font-black text-[#1A1A1A] flex items-center gap-2 mb-6">
            <i className="fa-solid fa-hashtag text-[#F26500]" /> Name Number Reference
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(NUMBER_MEANINGS).map(([num, data]) => (
              <div
                key={num}
                className={`bg-white border rounded-2xl p-5 flex flex-col gap-2 transition-all hover:shadow-md ${result?.number === Number(num) ? "border-[#F26500] bg-[#FFF8F3] ring-2 ring-[#F26500]/20" : "border-[#F0E0D0]"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shrink-0 ${result?.number === Number(num) ? "bg-[#F26500] text-white" : "bg-[#FFF0E6] text-[#F26500]"}`}>
                    {num}
                  </div>
                  <p className="text-sm font-black text-[#1A1A1A] leading-tight">{data.title}</p>
                </div>
                <p className="text-xs text-[#777] leading-relaxed">{data.desc}</p>
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
              Want to know what your name says about your destiny?
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Talk to our expert astrologers for a complete numerology reading.
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
      <NameNumerologySeoContent />

    </div>
  );
}

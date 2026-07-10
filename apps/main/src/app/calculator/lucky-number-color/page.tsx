"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LuckyNumberColorSeoContent from "./lucky-number-color-seo.component";
import PersonalGuidanceCard from "@/components/ui/PersonalGuidanceCard";

// Helper function to calculate lucky number from date
const calculateLuckyNumber = (dateStr: string): number => {
  if (!dateStr) return 1;
  const digits = dateStr.replace(/\D/g, "").split("").map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9) {
    sum = sum
      .toString()
      .split("")
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }
  return sum || 1;
};

const NUMBER_DETAILS: Record<number, { color: string; hex: string; desc: string; traits: string }> = {
  1: { color: "Red", hex: "#E74C3C", desc: "Sun", traits: "Leadership, Independence, Originality" },
  2: { color: "White", hex: "#FDFEFE", desc: "Moon", traits: "Cooperation, Adaptability, Harmony" },
  3: { color: "Yellow", hex: "#F1C40F", desc: "Jupiter", traits: "Creativity, Expression, Joy" },
  4: { color: "Brown", hex: "#8E44AD", desc: "Rahu", traits: "Order, Service, Struggle" },
  5: { color: "Green", hex: "#2ECC71", desc: "Mercury", traits: "Expansion, Vision, Adventure" },
  6: { color: "Pink", hex: "#FFB6C1", desc: "Venus", traits: "Responsibility, Love, Sympathy" },
  7: { color: "Grey", hex: "#95A5A6", desc: "Ketu", traits: "Analysis, Understanding, Knowledge" },
  8: { color: "Blue", hex: "#3498DB", desc: "Saturn", traits: "Practical Endeavors, Status, Power" },
  9: { color: "Orange", hex: "#E67E22", desc: "Mars", traits: "Humanitarian, Giving Nature, Selflessness" },
};

export default function LuckyNumberColorCalculatorPage() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ number: number; details: any } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dob) return;
    setLoading(true);
    setResult(null);

    // Simulate API call / thinking time
    await new Promise((resolve) => setTimeout(resolve, 800));

    const luckyNum = calculateLuckyNumber(dob);
    setResult({
      number: luckyNum,
      details: NUMBER_DETAILS[luckyNum],
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDF6F0] overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Breadcrumb */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 py-4">
        <p className="text-sm text-[#888] flex items-center">
          <Link href="/" className="hover:text-[#F26500] transition-colors">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/calculator" className="text-[#F26500] font-semibold hover:underline">Calculators</Link>
          <span className="mx-2">›</span>
          <span className="text-[#444]">Lucky Number & Color</span>
        </p>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 pb-4">
        <div className={`grid gap-6 ${result ? "lg:grid-cols-3 md:grid-cols-2" : "md:grid-cols-2 max-w-5xl"} mx-auto`}>
          
          {/* ── Left: Form ── */}
          <form onSubmit={handleSubmit} className="bg-white border-2 border-[#F26500] rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-[#1A1A1A] leading-tight whitespace-normal sm:whitespace-nowrap tracking-tight sm:tracking-normal">
                  Lucky Number & Color
                </h1>
                <p className="text-xs md:text-sm text-[#888] mt-1">
                  Discover your lucky elements based on your birth details
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#F0E0D0] to-transparent my-2" />

            {/* Inputs */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#333]">Your Name</label>
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

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#333]">Date of Birth</label>
                <div className="relative">
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full border-2 border-[#F0E0D0] rounded-xl px-4 py-3.5 text-sm text-[#333] focus:outline-none focus:border-[#F26500] focus:ring-4 focus:ring-[#F26500]/10 bg-white transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!name.trim() || !dob || loading}
              className="mt-2 w-full bg-gradient-to-r from-[#F26500] to-[#E65A00] hover:from-[#E65A00] hover:to-[#D95A00] disabled:opacity-50 text-white font-black rounded-xl py-4 flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              {loading ? (
                <><i className="fa-solid fa-spinner animate-spin" /> Calculating...</>
              ) : (
                <><i className="fa-solid fa-sparkles" /> Generate Lucky Results</>
              )}
            </button>
          </form>

          {/* ── Middle: Result ── */}
          {result && (
            <div className="bg-gradient-to-br from-[#2A1110] to-[#1A0B0B] border-2 border-[#F26500] rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Decorative BG */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F26500]/10 rounded-bl-full pointer-events-none blur-xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F26500]/10 rounded-tr-full pointer-events-none blur-xl" />

              <h2 className="text-[#F26500] font-black text-[15px] uppercase tracking-wider mb-8 drop-shadow-md relative z-10">
                Your Lucky Results
              </h2>

              <div className="flex flex-col md:flex-row gap-6 w-full items-center justify-center mb-8 relative z-10">
                {/* Number Box */}
                <div className="flex flex-col items-center bg-[#3D1A10]/60 border border-[#F26500]/20 p-6 rounded-2xl w-full backdrop-blur-sm shadow-inner">
                  <span className="text-[13px] font-bold text-[#FFD0B5] mb-4 uppercase tracking-wider">Lucky Number</span>
                  <div className="w-24 h-24 bg-[#1A0B0B] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(242,101,0,0.3)] border-[3px] border-[#F26500]/50">
                    <span className="text-5xl font-black text-white drop-shadow-[0_2px_15px_rgba(242,101,0,0.8)]">{result.number}</span>
                  </div>
                </div>

                {/* Color Box */}
                <div className="flex flex-col items-center bg-[#3D1A10]/60 border border-[#F26500]/20 p-6 rounded-2xl w-full backdrop-blur-sm shadow-inner">
                  <span className="text-[13px] font-bold text-[#FFD0B5] mb-4 uppercase tracking-wider">Lucky Color</span>
                  <div 
                    className="w-24 h-24 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.15)] border-[3px] border-[#2A1110]"
                    style={{ backgroundColor: result.details.hex, ...(result.details.hex === "#FDFEFE" ? { border: '3px solid #FFF' } : {}) }}
                  />
                  <span className="mt-4 font-black text-white text-[17px] tracking-wide drop-shadow-md">{result.details.color}</span>
                </div>
              </div>

              {/* Traits */}
              <div className="w-full bg-[#1A0B0B]/80 border border-[#F26500]/40 rounded-2xl p-5 text-left relative z-10 shadow-lg">
                <p className="text-[15px] font-bold text-white mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-star text-[#F26500]" /> Traits associated with {result.number}
                </p>
                <p className="text-[13.5px] text-[#FFD0B5] font-medium leading-relaxed">
                  {result.details.traits}. Ruled by the energy of <span className="text-white font-bold">{result.details.desc}</span>.
                </p>
              </div>
            </div>
          )}

          {/* ── Right: Guidance Card (Only shows when result is present in desktop, or stacks in mobile) ── */}
          <div className={result ? "lg:col-span-1 md:col-span-2" : "col-span-1"}>
            <PersonalGuidanceCard showExtraContent={true} />
            </div>
        </div>

        {/* ── Details Section (Shows only when result is active) ── */}
        {result && (
           <div className="mt-12 bg-white rounded-3xl p-8 border border-[#F0E0D0] shadow-sm">
             <h3 className="text-xl font-black text-[#1A1A1A] mb-6 flex items-center gap-2">
               <i className="fa-solid fa-circle-info text-[#F26500]" /> About Numerology
             </h3>
             <p className="text-[#555] text-sm leading-relaxed font-medium">
               Numerology is the ancient study of numbers and their connection to your life, personality, and destiny. By reducing your date of birth to a single digit, we discover your Life Path or Lucky Number. This number carries specific vibrations and energies that influence your traits, career choices, and relationships. Aligning yourself with your lucky color can help enhance positive energies and attract good fortune into your life.
             </p>
           </div>
        )}

        {/* Bottom CTA Banner */}
        <section className="mt-12 bg-[#1a0b0b] rounded-3xl px-5 py-6 sm:px-8 sm:py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image src="/images/horoscope-round2.png" alt="" fill className="object-cover" />
          </div>
          <div className="relative z-10 w-full text-center md:text-left">
            <p className="text-[#F26500] font-bold text-[13px] sm:text-sm mb-1">Personalized Guidance</p>
            <h3 className="text-white text-[15px] sm:text-[19px] md:text-2xl font-black leading-snug md:leading-normal text-balance mx-auto md:mx-0">
              Want to know more about your future?
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Talk to our Astrology Experts and get personalized predictions and remedies.
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
      <LuckyNumberColorSeoContent />

    </div>
  );
}





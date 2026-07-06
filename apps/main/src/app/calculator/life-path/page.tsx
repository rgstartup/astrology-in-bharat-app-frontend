"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LifePathSeoContent from "./life-path-seo.component";
import PersonalGuidanceCard from "@/components/ui/PersonalGuidanceCard";

// Helper function to calculate life path number
const calculateLifePath = (dateStr: string): number => {
  if (!dateStr) return 1;
  const digits = dateStr.replace(/\D/g, "").split("").map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum
      .toString()
      .split("")
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }
  return sum || 1;
};

const LIFE_PATH_DETAILS: Record<number, { title: string; desc: string }> = {
  1: { title: "The Leader", desc: "Independent, innovative, and driven. You are meant to lead and pave new paths." },
  2: { title: "The Peacemaker", desc: "Diplomatic, sensitive, and cooperative. You bring harmony to relationships." },
  3: { title: "The Communicator", desc: "Creative, expressive, and sociable. You inspire others with your joy and art." },
  4: { title: "The Builder", desc: "Practical, hardworking, and reliable. You build solid foundations for the future." },
  5: { title: "The Explorer", desc: "Adventurous, versatile, and freedom-loving. You thrive on change and new experiences." },
  6: { title: "The Nurturer", desc: "Responsible, loving, and protective. You care deeply for family and community." },
  7: { title: "The Seeker", desc: "Analytical, spiritual, and intellectual. You search for truth and deeper meaning." },
  8: { title: "The Powerhouse", desc: "Ambitious, authoritative, and goal-oriented. You are driven by success and material mastery." },
  9: { title: "The Humanitarian", desc: "Compassionate, generous, and idealistic. You want to make the world a better place." },
  11: { title: "The Illuminator", desc: "Intuitive, inspiring, and visionary. You have a deep spiritual awareness." },
  22: { title: "The Master Builder", desc: "Practical idealist. You can turn grand visions into reality." },
  33: { title: "The Master Teacher", desc: "Altruistic and deeply devoted. You serve as an uplifting guide to humanity." },
};

export default function LifePathCalculatorPage() {
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

    const pathNum = calculateLifePath(dob);
    setResult({
      number: pathNum,
      details: LIFE_PATH_DETAILS[pathNum] || LIFE_PATH_DETAILS[1],
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDF6F0]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="text-sm text-[#888]">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span className="text-[#F26500] font-semibold">Calculators</span>
          <span className="mx-2">›</span>
          <span className="text-[#444]">Life Path Calculator</span>
        </p>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className={`grid gap-6 ${result ? "lg:grid-cols-3 md:grid-cols-2" : "md:grid-cols-2 max-w-5xl"} mx-auto`}>
          
          {/* ── Left: Form ── */}
          <form onSubmit={handleSubmit} className="bg-white border border-[#F0E0D0] rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FFF0E6] flex items-center justify-center shrink-0">
                <i className="fa-solid fa-road text-[#F26500] text-xl" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-[#1A1A1A] leading-tight">
                  Life Path Calculator
                </h1>
                <p className="text-xs md:text-sm text-[#888] mt-1">
                  Discover your true life purpose and destiny
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
                <><i className="fa-solid fa-sparkles" /> Calculate Life Path</>
              )}
            </button>
          </form>

          {/* ── Middle: Result ── */}
          {result && (
            <div className="bg-white border border-[#F0E0D0] rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Decorative BG */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F26500]/5 rounded-bl-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F26500]/5 rounded-tr-full pointer-events-none" />

              <h2 className="text-[#F26500] font-black text-sm uppercase tracking-wider mb-6">
                Your Life Path Number
              </h2>

              <div className="flex flex-col items-center mb-8">
                <div className="w-32 h-32 bg-[#FFF8F3] rounded-full flex items-center justify-center shadow-lg border-8 border-white ring-4 ring-[#F26500]/20 mb-4">
                  <span className="text-6xl font-black text-[#F26500]">{result.number}</span>
                </div>
                <h3 className="text-xl font-black text-[#1A1A1A]">{result.details.title}</h3>
              </div>

              {/* Traits */}
              <div className="w-full bg-[#F9F9F9] border border-[#EEEEEE] rounded-2xl p-5 text-left relative z-10">
                <p className="text-sm font-semibold text-[#1A1A1A] mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-star text-[#F26500]" /> Personality Traits
                </p>
                <p className="text-sm text-[#555] font-medium leading-relaxed">
                  {result.details.desc} Your life path represents the core of who you are and the journey you are meant to take in this lifetime.
                </p>
              </div>
            </div>
          )}

          {/* ── Right: Guidance Card (Only shows when result is active) ── */}
          <div className={result ? "lg:col-span-1 md:col-span-2" : "col-span-1"}>
            <PersonalGuidanceCard className="h-full" />
            </div>
        </div>

        {/* ── Details Section (Shows only when result is active) ── */}
        {result && (
           <div className="mt-12 bg-white rounded-3xl p-8 border border-[#F0E0D0] shadow-sm">
             <h3 className="text-xl font-black text-[#1A1A1A] mb-6 flex items-center gap-2">
               <i className="fa-solid fa-circle-info text-[#F26500]" /> About Life Path Numerology
             </h3>
             <p className="text-[#555] text-sm leading-relaxed font-medium">
               Your Life Path Number is considered the most important and influential number in your Numerology chart. It is derived from your date of birth and reveals your ultimate life purpose, the challenges you may face, and the opportunities that will come your way. Think of it as the blueprint of your life journey.
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
              Want to know more about your future path?
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Talk to our Astrology Experts and get deep insights into your destiny.
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
      <LifePathSeoContent />

    </div>
  );
}





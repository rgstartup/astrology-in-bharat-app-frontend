"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PersonalGuidanceCard from "@/components/ui/PersonalGuidanceCard";
import BreakupPatchupSeoContent from "./breakup-patchup-seo.component";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const hashSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const normalizeString = (str: string) => str.toLowerCase().trim().replace(/[^a-z0-9]/g, "");

const getAdvice = (patchup: number) => {
  if (patchup >= 70) return "High chances of patch-up! A little effort, honest communication, and forgiveness can bring back the lost spark.";
  if (patchup >= 50) return "It's a balanced situation. There is hope, but both need to let go of their egos and have a deep heart-to-heart talk.";
  return "The energies are pulling apart right now. Sometimes space is exactly what you both need to heal and gain clarity.";
};

export default function BreakupPatchupPage() {
  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [yourAge, setYourAge] = useState("");
  const [partnerAge, setPartnerAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ patchup: number; breakup: number; advice: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yourName || !partnerName || !yourAge || !partnerAge) return;
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 700));

    const key = [normalizeString(yourName), normalizeString(partnerName)].sort().join("|");
    const seed = hashSeed(key);

    const patchup = (seed % 51) + 40; // 40–90
    const breakup = clamp(100 - patchup + ((seed % 11) - 5), 5, 60); // 5–60

    setResult({
      patchup,
      breakup,
      advice: getAdvice(patchup),
    });
    setLoading(false);
  };

  const inputCls = "w-full border-2 border-[#F0E0D0] rounded-xl px-4 py-3 text-sm text-[#333] placeholder-[#BBB] focus:outline-none focus:border-[#F26500] focus:ring-4 focus:ring-[#F26500]/10 bg-white transition-all font-medium";

  return (
    <div className="min-h-screen bg-[#FDF6F0]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Breadcrumb */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 py-4">
        <p className="text-sm text-[#888]">
          <span>Home</span><span className="mx-2">›</span>
          <span className="text-[#F26500] font-semibold">Calculators</span><span className="mx-2">›</span>
          <span className="text-[#444]">Breakup/Patchup</span>
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 pb-4">
        <div className={`grid gap-6 ${result ? "lg:grid-cols-3 md:grid-cols-2" : "md:grid-cols-2 max-w-5xl mx-auto"}`}>

          {/* ── Left: Form ── */}
          <form onSubmit={handleSubmit} className="bg-white border border-[#F0E0D0] rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FFF0E6] flex items-center justify-center shrink-0">
                <i className="fa-solid fa-heart-crack text-[#F26500] text-xl" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-[#1A1A1A] leading-tight">Breakup / Patchup</h1>
                <p className="text-xs md:text-sm text-[#888] mt-1">Check the chances of getting back together</p>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#F0E0D0] to-transparent" />

            <div className="flex flex-col gap-5">
              {/* Your Details */}
              <div className="bg-[#FFF8F3] border border-[#F5E0CC] p-4 rounded-2xl flex flex-col gap-3 relative">
                <span className="absolute -top-3 left-4 bg-[#FFF8F3] px-2 text-[10px] font-black text-[#F26500] uppercase tracking-wider">Your Details</span>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  className={inputCls}
                />
                <input
                  type="number"
                  placeholder="Your Age"
                  value={yourAge}
                  onChange={(e) => setYourAge(e.target.value)}
                  className={inputCls}
                  min="13" max="100"
                />
              </div>

              {/* Partner Details */}
              <div className="bg-[#FFF8F3] border border-[#F5E0CC] p-4 rounded-2xl flex flex-col gap-3 relative mt-2">
                <span className="absolute -top-3 left-4 bg-[#FFF8F3] px-2 text-[10px] font-black text-[#F26500] uppercase tracking-wider">Partner's Details</span>
                <input
                  type="text"
                  placeholder="Partner's Name"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className={inputCls}
                />
                <input
                  type="number"
                  placeholder="Partner's Age"
                  value={partnerAge}
                  onChange={(e) => setPartnerAge(e.target.value)}
                  className={inputCls}
                  min="13" max="100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!yourName || !partnerName || !yourAge || !partnerAge || loading}
              className="mt-2 w-full bg-gradient-to-r from-[#F26500] to-[#E65A00] hover:from-[#E65A00] hover:to-[#D95A00] disabled:opacity-50 text-white font-black rounded-xl py-4 flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {loading ? <><i className="fa-solid fa-spinner animate-spin" /> Calculating...</> : <><i className="fa-solid fa-heart-pulse" /> Calculate Chances</>}
            </button>
          </form>

          {/* ── Middle: Result ── */}
          {result && (
            <div className="bg-white border border-[#F0E0D0] rounded-3xl p-6 md:p-8 flex flex-col justify-center gap-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F26500]/5 rounded-bl-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F26500]/5 rounded-tr-full pointer-events-none" />

              <h2 className="text-[#F26500] font-black text-sm uppercase tracking-wider text-center">Prediction Results</h2>

              {/* Stats */}
              <div className="flex flex-col gap-5">
                {/* Patchup Stat */}
                <div className="bg-[#FFF8F3] border border-[#F5E0CC] rounded-2xl p-5 flex flex-col gap-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <i className="fa-solid fa-heart text-green-600 text-sm" />
                      </div>
                      <span className="font-bold text-[#333]">Patch-up Chances</span>
                    </div>
                    <span className="text-xl font-black text-green-600">{result.patchup}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000" style={{ width: `${result.patchup}%` }} />
                  </div>
                </div>

                {/* Breakup Stat */}
                <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex flex-col gap-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <i className="fa-solid fa-heart-crack text-red-600 text-sm" />
                      </div>
                      <span className="font-bold text-[#333]">Breakup Risk</span>
                    </div>
                    <span className="text-xl font-black text-red-600">{result.breakup}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-1000" style={{ width: `${result.breakup}%` }} />
                  </div>
                </div>
              </div>

              {/* Advice */}
              <div className="mt-2 text-center bg-[#F9F9F9] border border-[#EEE] p-4 rounded-xl relative z-10">
                <i className="fa-solid fa-quote-left text-[#DDD] text-xl mb-2" />
                <p className="text-sm font-medium text-[#555] leading-relaxed">
                  "{result.advice}"
                </p>
              </div>

            </div>
          )}

          {/* ── Right: Guidance Card ── */}
          <div className={result ? "lg:col-span-1 md:col-span-2" : "col-span-1"}>
            <PersonalGuidanceCard showExtraContent={true} />
          </div>
        </div>

        {/* Info Section */}
        <div className="max-w-3xl mx-auto mt-12 bg-white border border-[#F0E0D0] p-6 md:p-8 rounded-3xl text-center shadow-sm">
          <i className="fa-solid fa-scale-balanced text-[#F26500] text-2xl mb-4" />
          <h2 className="text-xl font-black text-[#1A1A1A] mb-3">Is a patch-up possible?</h2>
          <p className="text-sm text-[#666] leading-relaxed font-medium">
            This tool analyzes the energetic compatibility of your names and calculates the mathematical probability of reconciliation versus permanent separation. While numbers provide a strong indication, true patch-ups depend on mutual understanding, effort, and planetary periods (Dashas).
          </p>
        </div>

        {/* Bottom CTA Banner */}
        <section className="mt-12 bg-[#1a0b0b] rounded-3xl px-5 py-6 sm:px-8 sm:py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image src="/images/horoscope-round2.png" alt="" fill className="object-cover" />
          </div>
          <div className="relative z-10 w-full text-center md:text-left">
            <p className="text-[#F26500] font-bold text-[13px] sm:text-sm mb-1">Personalized Guidance</p>
            <h3 className="text-white text-[15px] sm:text-[19px] md:text-2xl font-black leading-snug md:leading-normal text-balance mx-auto md:mx-0">
              Want a deeper astrological remedy for your relationship?
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Talk to our expert astrologers to know your actual compatibility and future.
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
      <BreakupPatchupSeoContent />

    </div>
  );
}

"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PersonalGuidanceCard from "@/components/ui/PersonalGuidanceCard";
import LoyalPartnerSeoContent from "./loyal-partner-seo.component";

const hashSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const normalizeString = (str: string) => str.toLowerCase().trim().replace(/[^a-z0-9]/g, "");

const getLoyaltyFeedback = (score: number) => {
  if (score >= 90) return { label: "Extremely Loyal", text: "You two share an unbreakable bond built on deep trust and mutual respect.", color: "text-green-600", bg: "bg-green-50 border-green-200" };
  if (score >= 75) return { label: "Highly Loyal", text: "A strong and faithful connection. Keep nurturing your beautiful relationship.", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" };
  if (score >= 60) return { label: "Moderate Trust", text: "There's good potential, but open communication is needed to build deeper trust.", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" };
  return { label: "Needs Work", text: "Trust takes time to build. Be patient and honest with each other.", color: "text-red-500", bg: "bg-red-50 border-red-200" };
};

export default function LoyalPartnerPage() {
  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [yourDob, setYourDob] = useState("");
  const [partnerDob, setPartnerDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; feedback: ReturnType<typeof getLoyaltyFeedback> } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yourName || !partnerName || !yourDob || !partnerDob) return;
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 700));

    const key = [normalizeString(yourName + yourDob), normalizeString(partnerName + partnerDob)].sort().join("|");
    const seed = hashSeed(key);
    const score = (seed % 51) + 50; // Returns 50-100
    
    setResult({
      score,
      feedback: getLoyaltyFeedback(score),
    });
    setLoading(false);
  };

  const inputCls = "w-full border-2 border-[#F0E0D0] rounded-xl px-4 py-3 text-sm text-[#333] placeholder-[#BBB] focus:outline-none focus:border-[#F26500] focus:ring-4 focus:ring-[#F26500]/10 bg-white transition-all font-medium";

  return (
    <div className="min-h-screen bg-[#FDF6F0] overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Breadcrumb */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 py-4">
        <p className="text-sm text-[#888] flex items-center">
          <Link href="/" className="hover:text-[#F26500] transition-colors">Home</Link><span className="mx-2">›</span>
          <Link href="/calculator" className="text-[#F26500] font-semibold hover:underline">Calculators</Link><span className="mx-2">›</span>
          <span className="text-[#444]">Loyal Partner Calculator</span>
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 pb-4">
        <div className={`grid gap-6 ${result ? "lg:grid-cols-3 md:grid-cols-2" : "md:grid-cols-2 max-w-5xl mx-auto"}`}>

          {/* ── Left: Form ── */}
          <form onSubmit={handleSubmit} className="bg-white border-2 border-[#F26500] rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-sm h-fit">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-[#1A1A1A] leading-tight">Loyal Partner Finder</h1>
                <p className="text-xs md:text-sm text-[#888] mt-1">Check the loyalty and trust level in your relationship</p>
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
                  type="date"
                  value={yourDob}
                  onChange={(e) => setYourDob(e.target.value)}
                  className={inputCls}
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
                  type="date"
                  value={partnerDob}
                  onChange={(e) => setPartnerDob(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!yourName || !partnerName || !yourDob || !partnerDob || loading}
              className="mt-2 w-full bg-gradient-to-r from-[#F26500] to-[#E65A00] hover:from-[#E65A00] hover:to-[#D95A00] disabled:opacity-50 text-white font-black rounded-xl py-4 flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {loading ? <><i className="fa-solid fa-spinner animate-spin" /> Checking...</> : <><i className="fa-solid fa-check-double" /> Check Loyalty</>}
            </button>
          </form>

          {/* ── Middle: Result ── */}
          {result && (
            <div className="bg-white border-2 border-[#F26500] rounded-3xl p-6 md:p-8 flex flex-col gap-5 shadow-sm relative overflow-hidden items-center text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F26500]/5 rounded-bl-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F26500]/5 rounded-tr-full pointer-events-none" />

              <h2 className="text-[#F26500] font-black text-sm uppercase tracking-wider">Loyalty Index</h2>

              {/* Score */}
              <div className="relative mt-2">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="#F5E0CC" strokeWidth="12" fill="none" />
                  <circle cx="80" cy="80" r="70" stroke="#F26500" strokeWidth="12" fill="none" strokeDasharray="439.8" strokeDashoffset={439.8 - (439.8 * result.score) / 100} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-[#1A1A1A]">{result.score}%</span>
                  <i className="fa-solid fa-shield-heart text-[#F26500] text-sm mt-1" />
                </div>
              </div>

              {/* Feedback Badge */}
              <div className={`mt-2 px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${result.feedback.bg} ${result.feedback.color}`}>
                {result.feedback.label}
              </div>

              {/* Text */}
              <p className="text-sm font-medium text-[#555] leading-relaxed mt-2 bg-[#F9F9F9] border border-[#EEE] p-4 rounded-xl relative z-10">
                "{result.feedback.text}"
              </p>

              {/* Names */}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs font-bold bg-[#FFF0E6] text-[#F26500] px-3 py-1.5 rounded-lg">{yourName}</span>
                <i className="fa-solid fa-link text-[#DDD] text-xs" />
                <span className="text-xs font-bold bg-[#FFF0E6] text-[#F26500] px-3 py-1.5 rounded-lg">{partnerName}</span>
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
          <i className="fa-solid fa-circle-info text-[#F26500] text-2xl mb-4" />
          <h2 className="text-xl font-black text-[#1A1A1A] mb-3">How does this work?</h2>
          <p className="text-sm text-[#666] leading-relaxed font-medium">
            The Loyal Partner Finder uses an advanced numerological algorithm combining the cosmic vibrations of both your names and dates of birth. It calculates the energy resonance between the two of you to estimate the natural loyalty and trust factor. Remember, a strong relationship is built through continuous effort and love!
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
              Having doubts about your partner's loyalty?
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Talk to our relationship astrologers for a detailed Kundli match analysis.
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
      <LoyalPartnerSeoContent />

    </div>
  );
}

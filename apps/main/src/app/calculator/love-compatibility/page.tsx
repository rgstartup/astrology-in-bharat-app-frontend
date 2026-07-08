"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PersonalGuidanceCard from "@/components/ui/PersonalGuidanceCard";
import LoveCompatibilitySeoContent from "./love-compatibility-seo.component";

// ── Circular Progress Ring ───────────────────────────────────────────────────
const CircleProgress = ({ percent }: { percent: number }) => {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="180" height="180" className="-rotate-90">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#F5E8DC" strokeWidth="12" />
        <circle
          cx="90" cy="90" r={r} fill="none"
          stroke="#F26500" strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-black text-[#1A1A1A]">{percent}%</span>
      </div>
      {/* Decorative floating hearts around the circle */}
      <i className="fa-regular fa-heart absolute top-4 left-4 text-[#F26500] text-xl opacity-60" />
      <i className="fa-regular fa-heart absolute bottom-12 -right-2 text-[#F26500] text-sm opacity-60" />
    </div>
  );
};

// ── Metric Card ──────────────────────────────────────────────────────────────
const MetricCard = ({ icon, label, value }: { icon: string; label: string; value: number }) => (
  <div className="flex flex-col items-center gap-1 bg-white border border-[#F0E0D0] rounded-2xl px-3 py-3 flex-1 min-w-[65px]">
    <i className={`${icon} text-[#F26500] text-lg`} />
    <span className="text-[11px] text-[#888] font-semibold">{label}</span>
    <span className="text-sm font-black text-[#1A1A1A]">{value}%</span>
  </div>
);

// ── Result Panel ─────────────────────────────────────────────────────────────
const ResultPanel = ({ result, yourName, partnerName }: { result: any, yourName: string, partnerName: string }) => {
  const score = result.love;
  const label =
    score >= 81 ? "Excellent Compatibility" :
    score >= 61 ? "Good Compatibility" :
    score >= 41 ? "Average Compatibility" :
    score >= 21 ? "Low Compatibility" : "Very Low Compatibility";
  const desc =
    score >= 81
      ? "You are perfect for each other. Your bond is deep, passionate, and full of love."
      : score >= 61
      ? "You share a strong emotional connection and understand each other well. Keep nurturing your relationship with trust, love and patience."
      : score >= 41
      ? "Your relationship can grow with effort. There are some areas to work on, but love and patience can overcome them."
      : "You may face challenges in your relationship. Communication and understanding are required to make it work.";

  const handleDownload = () => {
    const content = `LOVE COMPATIBILITY REPORT
===========================
Your Name: ${yourName}
Partner's Name: ${partnerName}

OVERALL COMPATIBILITY: ${score}% (${label})

METRICS BREAKDOWN:
- Love: ${result.loveMetric}%
- Trust: ${result.trust}%
- Communication: ${result.communication}%
- Emotions: ${result.emotions}%
- Understanding: ${result.understanding}%

MESSAGE:
${desc}

Note: This calculator is for fun and informational purposes.
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Compatibility_${yourName}_${partnerName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-[#F0E0D0] rounded-3xl p-6 md:p-8 flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#FFF0E6] flex items-center justify-center">
          <i className="fa-solid fa-people-arrows text-[#F26500] text-lg" />
        </div>
        <h2 className="text-xl font-black text-[#1A1A1A]">Your Compatibility Result</h2>
      </div>

      {/* Circle */}
      <div className="flex flex-col items-center gap-2">
        <CircleProgress percent={score} />
        <p className="text-[#F26500] font-black text-lg">{label}</p>
        <p className="text-[#666] text-sm text-center max-w-sm">{desc}</p>
      </div>

      {/* Metric Cards */}
      <div className="flex gap-2 flex-wrap mt-2">
        <MetricCard icon="fa-solid fa-heart-crack" label="Love" value={result.loveMetric} />
        <MetricCard icon="fa-solid fa-shield-heart" label="Trust" value={result.trust} />
        <MetricCard icon="fa-solid fa-comments" label="Communication" value={result.communication} />
        <MetricCard icon="fa-solid fa-face-smile-hearts" label="Emotions" value={result.emotions} />
        <MetricCard icon="fa-solid fa-bullseye" label="Understanding" value={result.understanding} />
      </div>

      {/* Action Buttons */}
      <div className="mt-2">
        <button 
          type="button"
          onClick={handleDownload}
          className="w-full bg-[#F26500] text-white rounded-2xl py-3 font-bold flex items-center justify-center gap-2 hover:bg-[#D95A00] transition-colors"
        >
          <i className="fa-solid fa-download" />
          Download Result
        </button>
      </div>
    </div>
  );
};

// ── Meaning Footer ───────────────────────────────────────────────────────────
const MEANING_DATA = [
  { range: "0% - 20%", label: "Very Low", icon: "fa-heart-crack text-red-500", desc: "You both are not compatible. Work on your relationship." },
  { range: "21% - 40%", label: "Low Compatibility", icon: "fa-face-frown text-orange-400", desc: "You may face challenges in your relationship." },
  { range: "41% - 60%", label: "Average Compatibility", icon: "fa-face-meh text-yellow-500", desc: "Your relationship can grow with effort." },
  { range: "61% - 80%", label: "Good Compatibility", icon: "fa-face-smile text-green-500", desc: "You both understand each other well." },
  { range: "81% - 100%", label: "Excellent Compatibility", icon: "fa-heart text-pink-500", desc: "You are perfect for each other." },
];

function hashSeed(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const clamp = (num: number, min: number, max: number) => Math.max(min, Math.min(max, num));

// ── Main Page ────────────────────────────────────────────────────────────────
const LoveCompatibilityPage = () => {
  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [yourDob, setYourDob] = useState("");
  const [partnerDob, setPartnerDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yourName.trim() || !partnerName.trim()) return;
    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 700));

    // Calculate deterministic result
    const seed = hashSeed((yourName + partnerName).toLowerCase().replace(/\s+/g, ""));
    const love = (seed % 61) + 40; // 40 to 100
    
    setResult({
      love,
      loveMetric: clamp(love + ((seed % 15) - 7), 0, 100),
      trust: clamp(love + (((seed >> 2) % 21) - 10), 0, 100),
      communication: clamp(love + (((seed >> 4) % 15) - 5), 0, 100),
      emotions: clamp(love + (((seed >> 6) % 11) - 2), 0, 100),
      understanding: clamp(love + (((seed >> 8) % 17) - 8), 0, 100),
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
          <span className="text-[#444]">Love Compatibility Calculator</span>
        </p>
      </div>

      {/* Main Card Section */}
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
                <i className="fa-regular fa-heart text-[#F26500] text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-black text-[#1A1A1A]">Love Compatibility Calculator</h1>
                <p className="text-xs text-[#888]">Check the love compatibility between you and your partner.</p>
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
                  value={yourName} onChange={(e) => setYourName(e.target.value)}
                  className="w-full border border-[#E8D5C0] rounded-xl px-4 py-3 pr-10 text-sm text-[#333] placeholder-[#BBB] focus:outline-none focus:border-[#F26500] focus:ring-2 focus:ring-[#F26500]/20 bg-white transition"
                />
                <i className="fa-regular fa-user absolute right-3 top-1/2 -translate-y-1/2 text-[#CCC] text-sm" />
              </div>
            </div>

            {/* Partner Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#333]">Your Partner's Name</label>
              <div className="relative">
                <input
                  type="text" placeholder="Enter your partner's name"
                  value={partnerName} onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full border border-[#E8D5C0] rounded-xl px-4 py-3 pr-10 text-sm text-[#333] placeholder-[#BBB] focus:outline-none focus:border-[#F26500] focus:ring-2 focus:ring-[#F26500]/20 bg-white transition"
                />
                <i className="fa-regular fa-user absolute right-3 top-1/2 -translate-y-1/2 text-[#CCC] text-sm" />
              </div>
            </div>

            {/* Your DOB */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#333]">Your Birth Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={yourDob} onChange={(e) => setYourDob(e.target.value)}
                  className="w-full border border-[#E8D5C0] rounded-xl px-4 py-3 pr-10 text-sm text-[#333] focus:outline-none focus:border-[#F26500] focus:ring-2 focus:ring-[#F26500]/20 bg-white transition [color-scheme:light]"
                />
                <i className="fa-regular fa-calendar absolute right-3 top-1/2 -translate-y-1/2 text-[#CCC] text-sm pointer-events-none" />
              </div>
            </div>

            {/* Partner DOB */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#333]">Your Partner's Birth Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={partnerDob} onChange={(e) => setPartnerDob(e.target.value)}
                  className="w-full border border-[#E8D5C0] rounded-xl px-4 py-3 pr-10 text-sm text-[#333] focus:outline-none focus:border-[#F26500] focus:ring-2 focus:ring-[#F26500]/20 bg-white transition [color-scheme:light]"
                />
                <i className="fa-regular fa-calendar absolute right-3 top-1/2 -translate-y-1/2 text-[#CCC] text-sm pointer-events-none" />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !yourName.trim() || !partnerName.trim()}
              className="w-full bg-[#F26500] hover:bg-[#D95A00] text-white font-bold rounded-2xl py-3.5 flex items-center justify-center gap-2 transition-colors disabled:opacity-70 mt-1"
            >
              {loading ? (
                <i className="fa-solid fa-spinner animate-spin" />
              ) : (
                <i className="fa-solid fa-heart" />
              )}
              {loading ? "Calculating..." : "Calculate Compatibility"}
            </button>
          </form>

          {/* ── Right: Result (only when available) ── */}
          {result && <ResultPanel result={result} yourName={yourName} partnerName={partnerName} />}

          {/* -- Right: Guidance Card -- */}
          <div className={result ? "lg:col-span-1 md:col-span-2" : "col-span-1"}>
            <PersonalGuidanceCard showExtraContent={true} />
          </div>
        </div>

        {/* ── Meaning Section ── */}
        <div className="mt-8 bg-white border border-[#F0E0D0] rounded-3xl p-6">
          <h2 className="text-lg font-black text-[#1A1A1A] flex items-center gap-2 mb-6">
            <i className="fa-regular fa-heart text-[#F26500]" /> What does your score mean?
          </h2>
          <div className="flex flex-col md:flex-row gap-4 divide-y md:divide-y-0 md:divide-x divide-[#F0E0D0]">
            {MEANING_DATA.map((m, idx) => (
              <div key={idx} className={`flex-1 flex flex-col gap-1 ${idx !== 0 ? 'pt-4 md:pt-0 md:pl-4' : ''}`}>
                <p className="text-[#F26500] font-bold text-sm">{m.range}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#FFF0E6] flex items-center justify-center shrink-0">
                    <i className={`fa-solid ${m.icon} text-lg`} />
                  </div>
                  <p className="text-xs font-black text-[#1A1A1A] leading-tight">{m.label}</p>
                </div>
                <p className="text-[11px] text-[#666] mt-1">{m.desc}</p>
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
              Want to know how compatible you really are?
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Talk to our Astrology Experts and get a personalized relationship report.
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
      <LoveCompatibilitySeoContent />

    </div>
  );
};

export default LoveCompatibilityPage;







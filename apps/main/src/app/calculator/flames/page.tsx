"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PersonalGuidanceCard from "@/components/ui/PersonalGuidanceCard";
import FlamesSeoContent from "./flames-seo.component";

// ─── FLAMES Logic ────────────────────────────────────────────────────────────
const FLAMES_DATA = [
  { letter: "F", label: "Friends",  desc: "You are good friends and enjoy each other's company." },
  { letter: "L", label: "Love",     desc: "There is a strong feeling of love and attraction." },
  { letter: "A", label: "Affection",desc: "You care deeply about each other and show affection." },
  { letter: "M", label: "Marriage", desc: "You have a good chance of a happy and successful married life." },
  { letter: "E", label: "Enemies",  desc: "There may be some ego clashes or misunderstandings." },
  { letter: "S", label: "Siblings", desc: "You are like siblings, very close and comfortable." },
];

const resultConfig: Record<string, { color: string; icon: string }> = {
  F: { color: "#F26500", icon: "fa-solid fa-user-group" },
  L: { color: "#E63E6D", icon: "fa-solid fa-heart" },
  A: { color: "#9B59B6", icon: "fa-solid fa-hands-holding-heart" },
  M: { color: "#2ECC71", icon: "fa-solid fa-rings-wedding" },
  E: { color: "#E74C3C", icon: "fa-solid fa-bolt" },
  S: { color: "#3498DB", icon: "fa-solid fa-people-arrows" },
};

function normalizeName(name: string) {
  return name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z]/g, "");
}

function calculateFLAMES(name1: string, name2: string): string {
  const n1 = normalizeName(name1).split("");
  const n2 = normalizeName(name2).split("");

  for (let i = 0; i < n1.length; i++) {
    const idx = n2.indexOf(n1[i]!);
    if (idx !== -1) { n1[i] = ""; n2[idx] = ""; }
  }
  const count = n1.filter(Boolean).length + n2.filter(Boolean).length;

  const flames = ["F", "L", "A", "M", "E", "S"];
  let idx = 0;
  while (flames.length > 1) {
    idx = (idx + count - 1) % flames.length;
    flames.splice(idx, 1);
    if (idx === flames.length) idx = 0;
  }
  return flames[0]!;
}

// ─── Result Panel ─────────────────────────────────────────────────────────────
const ResultPanel = ({ result, name1, name2 }: { result: string; name1: string; name2: string }) => {
  const found = FLAMES_DATA.find((f) => f.letter === result)!;
  const cfg   = resultConfig[result]!;

  return (
    <div className="bg-white border border-[#F0E0D0] rounded-3xl p-6 md:p-8 flex flex-col gap-5 h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#FFF0E6] flex items-center justify-center">
          <i className="fa-solid fa-clipboard-list text-[#F26500] text-lg" />
        </div>
        <h2 className="text-xl font-black text-[#1A1A1A]">Your Result</h2>
      </div>

      {/* Big result */}
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="flex items-center gap-4">
          <i className="fa-regular fa-heart text-[#F26500] text-3xl" />
          <span className="text-5xl font-black" style={{ color: cfg.color }}>{found.label.toUpperCase()}</span>
          <i className="fa-regular fa-heart text-[#F26500] text-3xl" />
        </div>
        <p className="text-[#555] text-sm text-center max-w-xs mt-1">{found.desc}</p>
      </div>

      {/* FLAMES letters row */}
      <div className="grid grid-cols-6 gap-1 border border-[#F0E0D0] rounded-2xl p-3 bg-[#FFF8F3]">
        {FLAMES_DATA.map((f) => (
          <div
            key={f.letter}
            className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
              f.letter === result ? "bg-[#F26500] text-white" : "text-[#BBB]"
            }`}
          >
            <span className={`text-xl font-black ${f.letter === result ? "text-white" : "text-[#F26500]"}`}>
              {f.letter}
            </span>
            <span className={`text-[10px] font-semibold ${f.letter === result ? "text-white/90" : "text-[#AAA]"}`}>
              {f.label}
            </span>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="bg-[#FFF8F3] border border-[#F5E0CC] rounded-xl px-4 py-3 text-xs text-[#666] flex gap-2">
        <i className="fa-solid fa-circle-info text-[#F26500] mt-0.5 shrink-0" />
        <span><span className="font-black text-[#F26500]">Note: </span>This is just a fun calculation based on your names. Take it lightly and enjoy!</span>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const FlamesCalculatorPage = () => {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name1.trim() || !name2.trim()) return;
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 600));
    setResult(calculateFLAMES(name1, name2));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDF6F0]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Breadcrumb */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 py-4">
        <p className="text-sm text-[#888]">
          <span>Home</span><span className="mx-2">›</span>
          <span className="text-[#F26500] font-semibold">Calculators</span><span className="mx-2">›</span>
          <span className="text-[#444]">Flames Calculator</span>
        </p>
      </div>

      {/* Main Cards */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 pb-12">
        <div className={`grid gap-6 ${result ? "lg:grid-cols-3 md:grid-cols-2" : "md:grid-cols-2 max-w-5xl"} mx-auto`}>

          {/* ── Left: Form ── */}
          <form onSubmit={handleSubmit} className="bg-white border border-[#F0E0D0] rounded-3xl p-6 md:p-8 flex flex-col gap-5">

            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-[#FFF0E6] flex items-center justify-center">
                <i className="fa-solid fa-fire text-[#F26500] text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-black text-[#1A1A1A]">Flames Calculator</h1>
                <p className="text-xs text-[#888]">Find your relationship prediction using FLAMES</p>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-[#F0E0D0]" />
              <i className="fa-solid fa-fire text-[#F26500] text-xs opacity-30" />
              <div className="flex-1 h-px bg-[#F0E0D0]" />
            </div>

            {/* Your Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#333]">Your Name</label>
              <div className="relative">
                <input
                  type="text" placeholder="Enter your name"
                  value={name1} onChange={(e) => setName1(e.target.value)}
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
                  type="text" placeholder="Enter partner name"
                  value={name2} onChange={(e) => setName2(e.target.value)}
                  className="w-full border border-[#E8D5C0] rounded-xl px-4 py-3 pr-10 text-sm text-[#333] placeholder-[#BBB] focus:outline-none focus:border-[#F26500] focus:ring-2 focus:ring-[#F26500]/20 bg-white transition"
                />
                <i className="fa-regular fa-user absolute right-3 top-1/2 -translate-y-1/2 text-[#CCC] text-sm" />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!name1.trim() || !name2.trim() || loading}
              className="w-full bg-[#F26500] hover:bg-[#D95A00] disabled:opacity-50 text-white font-bold rounded-2xl py-3.5 flex items-center justify-center gap-2 transition-colors mt-1"
            >
              {loading
                ? <><i className="fa-solid fa-spinner animate-spin" /> Calculating...</>
                : <><i className="fa-solid fa-fire" /> Calculate FLAMES</>}
            </button>
          </form>

          {/* ── Right: Result ── */}
          {result && <ResultPanel result={result} name1={name1} name2={name2} />}

          {/* -- Right: Guidance Card -- */}
          <div className={result ? "lg:col-span-1 md:col-span-2" : "col-span-1"}>
            <PersonalGuidanceCard showExtraContent={true} />
          </div>
        </div>

        {/* ── What does FLAMES mean? ── */}
        <div className="mt-12">
          <h2 className="text-lg font-black text-[#1A1A1A] flex items-center gap-2 mb-6">
            <i className="fa-solid fa-fire text-[#F26500]" /> What does FLAMES mean?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {FLAMES_DATA.map((f) => (
              <div key={f.letter} className="bg-white border border-[#F0E0D0] rounded-2xl p-4 flex flex-col items-center gap-2 text-center">
                <span className="text-3xl font-black text-[#F26500]">{f.letter}</span>
                <span className="text-sm font-black text-[#1A1A1A]">{f.label}</span>
                <span className="text-xs text-[#777]">{f.desc}</span>
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
              Want to know more about your relationship future?
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Talk to our Astrology Experts and get personalized guidance on your connection.
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
      <FlamesSeoContent />

    </div>
  );
};

export default FlamesCalculatorPage;







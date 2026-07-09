"use client";
import React, { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib/utils/error";
import Link from "next/link";
import Image from "next/image";
import PersonalGuidanceCard from "@/components/ui/PersonalGuidanceCard";
import GuidanceCTA from "@/components/ui/GuidanceCTA";
import LoveCalculatorSeoContent from "./love-calculator-seo.component";

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
    </div>
  );
};

// ── Metric Card ──────────────────────────────────────────────────────────────
const MetricCard = ({ icon, label, value }: { icon: string; label: string; value: number }) => (
  <div className="flex flex-col items-center gap-1 bg-white border border-[#F0E0D0] rounded-2xl px-4 py-3 flex-1 min-w-[70px]">
    <i className={`${icon} text-[#F26500] text-lg`} />
    <span className="text-xs text-[#888] font-semibold">{label}</span>
    <span className="text-sm font-black text-[#1A1A1A]">{value}%</span>
  </div>
);

// ── Result Panel ─────────────────────────────────────────────────────────────
const ResultPanel = ({ result }: { result: any }) => {
  const score = result?.score ?? result?.loveScore ?? result?.percentage ?? 76;
  const label =
    score >= 80 ? "Excellent Compatibility" :
    score >= 60 ? "Good Compatibility" :
    score >= 40 ? "Average Compatibility" : "Low Compatibility";
  const desc =
    score >= 80
      ? "You two are a perfect match! Your bond is deep, passionate, and full of love."
      : score >= 60
      ? "You both share a strong emotional connect and have a good understanding. Keep communication open to make your bond even stronger."
      : score >= 40
      ? "There are some areas to work on, but with effort and understanding, you can build a great relationship."
      : "You may face challenges, but love and patience can overcome many obstacles.";

  const love = Math.min(100, score + 4);
  const trust = Math.max(0, score - 6);
  const communication = Math.min(100, score - 1);
  const emotions = Math.min(100, score + 2);

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
        <p className="text-[#666] text-sm text-center max-w-xs">{desc}</p>
      </div>

      {/* Metric Cards */}
      <div className="flex gap-2 flex-wrap">
        <MetricCard icon="fa-solid fa-heart" label="Love" value={love} />
        <MetricCard icon="fa-solid fa-shield-heart" label="Trust" value={trust} />
        <MetricCard icon="fa-solid fa-comments" label="Communication" value={communication} />
        <MetricCard icon="fa-solid fa-face-smile-hearts" label="Emotions" value={emotions} />
      </div>

      {/* Detailed Report btn */}
      <button className="w-full border border-[#F26500] text-[#F26500] rounded-2xl py-3 font-bold flex items-center justify-center gap-2 hover:bg-[#FFF5EE] transition-colors">
        <i className="fa-solid fa-chart-bar" />
        Detailed Report
      </button>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────
const LoveCalculatorPage = () => {
  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [yourDob, setYourDob] = useState("");
  const [partnerDob, setPartnerDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yourName || !partnerName) {
      toast.error("Please enter both names.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const [data, err] = await api.post<any>("/matchmaking/love-calculator", {
        yourName,
        partnerName,
      });
      if (err || !data) {
        toast.error(getErrorMessage(err) || "Failed to calculate. Try again.");
      } else if (data.success) {
        setResult(data.data);
        toast.success("Compatibility calculated!");
      } else {
        toast.error(getErrorMessage(data) || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6F0]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <p className="text-sm text-[#888]">
          <span className="text-[#888]">Home</span>
          <span className="mx-2">›</span>
          <span className="text-[#F26500] font-semibold">Calculators</span>
          <span className="mx-2">›</span>
          <span className="text-[#444]">Love Calculator</span>
        </p>
      </div>

      {/* Main Card Section */}
      <div className="max-w-6xl mx-auto px-4 pb-4">
      <div className={`grid gap-6 ${result ? "lg:grid-cols-3 md:grid-cols-2" : "md:grid-cols-2 max-w-5xl"} mx-auto`}>

          {/* ── Left: Form ── */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#F0E0D0] rounded-3xl p-6 md:p-8 flex flex-col gap-5 h-fit"
          >
            {/* Form Header */}
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-[#FFF0E6] flex items-center justify-center">
                <i className="fa-solid fa-heart text-[#F26500] text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-black text-[#1A1A1A]">Love Calculator</h1>
                <p className="text-xs text-[#555] font-medium">Calculate your love compatibility</p>
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
                    type="text"
                    placeholder="Enter your name"
                    value={yourName}
                    onChange={(e) => setYourName(e.target.value)}
                    className="w-full border border-[#D0BBA0] rounded-xl px-4 py-3 pr-10 text-sm text-[#111] font-medium placeholder-[#777] focus:outline-none focus:border-[#F26500] focus:ring-2 focus:ring-[#F26500]/20 bg-white transition"
                  />
                  <i className="fa-regular fa-user absolute right-3 top-1/2 -translate-y-1/2 text-[#888] text-sm" />
                </div>
            </div>

            {/* Partner Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#333]">Your Partner's Name</label>
              <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter partner name"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="w-full border border-[#D0BBA0] rounded-xl px-4 py-3 pr-10 text-sm text-[#111] font-medium placeholder-[#777] focus:outline-none focus:border-[#F26500] focus:ring-2 focus:ring-[#F26500]/20 bg-white transition"
                  />
                  <i className="fa-regular fa-user absolute right-3 top-1/2 -translate-y-1/2 text-[#888] text-sm" />
                </div>
            </div>

            {/* Your DOB */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#333]">Your Birth Date</label>
              <div className="relative">
                  <input
                    type="date"
                    value={yourDob}
                    onChange={(e) => setYourDob(e.target.value)}
                    className="w-full border border-[#D0BBA0] rounded-xl px-4 py-3 text-sm text-[#111] font-medium focus:outline-none focus:border-[#F26500] focus:ring-2 focus:ring-[#F26500]/20 bg-white transition [color-scheme:light]"
                  />
                </div>
            </div>

            {/* Partner DOB */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#333]">Your Partner's Birth Date</label>
              <div className="relative">
                  <input
                    type="date"
                    value={partnerDob}
                    onChange={(e) => setPartnerDob(e.target.value)}
                    className="w-full border border-[#D0BBA0] rounded-xl px-4 py-3 text-sm text-[#111] font-medium focus:outline-none focus:border-[#F26500] focus:ring-2 focus:ring-[#F26500]/20 bg-white transition [color-scheme:light]"
                  />
                </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
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
          {result && <ResultPanel result={result} />}
          {/* ── Right: Guidance Card ── */}
          <div className={result ? "lg:col-span-1 md:col-span-2" : "col-span-1"}>
            <PersonalGuidanceCard className="h-full" />
          </div>
        </div>
        {/* Bottom CTA Banner */}
        <GuidanceCTA 
          className="mt-8"
          title="Want to know more about your love life?"
          description="Talk to our Astrology Experts and get personalized relationship guidance."
        />

      </div>

      {/* ── SEO Section ── */}
      <LoveCalculatorSeoContent />

    </div>
  );
};

export default LoveCalculatorPage;







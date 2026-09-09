"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PersonalGuidanceCard from "@/components/ui/PersonalGuidanceCard";
import GuidanceCTA from "@/components/ui/GuidanceCTA";
import DahejSeoContent from "./dahej-seo.component";
import {
  EDUCATION_OPTIONS,
  PROFESSION_OPTIONS,
  INCOME_OPTIONS,
  CITY_OPTIONS,
  AWARENESS,
  calculateDahejEstimate,
  type DahejEstimateResult,
} from "./calculate";

// ─── Result Panel ────────────────────────────────────────────────────────────
const ResultPanel = ({ result }: { result: DahejEstimateResult }) => {
  const details = [
    { icon: "fa-solid fa-graduation-cap", label: "Education", value: result.education },
    { icon: "fa-solid fa-briefcase",      label: "Profession", value: result.profession },
    { icon: "fa-solid fa-wallet",         label: "Monthly Income", value: result.income },
    { icon: "fa-solid fa-location-dot",   label: "City", value: result.city },
  ];

  return (
    <div className="bg-white border-2 border-[#F26500] rounded-3xl p-6 md:p-8 flex flex-col gap-5 h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#FFF0E6] flex items-center justify-center">
          <i className="fa-solid fa-indian-rupee-sign text-[#F26500] text-lg" />
        </div>
        <div>
          <h2 className="text-xl font-black text-[#1A1A1A]">Your Result (Estimate)</h2>
          <p className="text-xs text-[#888]">Estimated value based on profile details</p>
        </div>
      </div>

      {/* Amount Display */}
      <div className="flex flex-col items-center py-4 bg-[#FFF8F3] rounded-2xl border border-[#F5E0CC]">
        <span className="text-xs text-[#888] font-semibold uppercase tracking-wider mb-1">Estimated Range</span>
        <div className="text-2xl sm:text-3xl font-black text-[#F26500] text-center">
          ₹ {result.minFormatted} – {result.maxFormatted}
        </div>
      </div>

      {/* Profile summary */}
      <div className="flex flex-col gap-2.5">
        {details.map((d, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-[#F5E8DC] last:border-0 text-xs">
            <div className="flex items-center gap-2 text-[#666]">
              <i className={`${d.icon} text-[#F26500] w-4 text-center`} />
              <span>{d.label}</span>
            </div>
            <span className="text-sm font-bold text-[#1A1A1A]">{d.value}</span>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="bg-[#FFF8F3] border border-[#F5E0CC] rounded-xl px-4 py-3 text-xs text-[#666]">
        <span className="font-black text-[#F26500]">Note: </span>
        This calculator is for informational purposes only. Dowry is illegal in India.
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const DahejCalculatorPage = () => {
  const [education, setEducation] = useState("");
  const [profession, setProfession] = useState("");
  const [income, setIncome] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DahejEstimateResult | null>(null);

  const canCalculate = education && profession && income && city;

  const calculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) return;
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 700));

    const res = calculateDahejEstimate(education, profession, income, city);
    setResult(res);
    setLoading(false);
  };

  const selectCls = "w-full border border-[#E8D5C0] rounded-xl px-4 py-3 pr-10 text-sm text-[#333] bg-white focus:outline-none focus:border-[#F26500] focus:ring-2 focus:ring-[#F26500]/20 transition appearance-none cursor-pointer";

  return (
    <div className="min-h-screen bg-[#FDF6F0] overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Breadcrumb */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 py-4">
        <p className="text-sm text-[#888] flex items-center">
          <Link href="/" className="hover:text-[#F26500] transition-colors">Home</Link><span className="mx-2">›</span>
          <Link href="/calculator" className="text-[#F26500] font-semibold hover:underline">Calculators</Link><span className="mx-2">›</span>
          <span className="text-[#444]">Dahej Calculator</span>
        </p>
      </div>

      {/* Main Cards */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 pb-4">
        <div className={`grid gap-6 ${result ? "lg:grid-cols-3 md:grid-cols-2" : "md:grid-cols-2 max-w-5xl"} mx-auto`}>

          {/* ── Left: Form ── */}
          <form onSubmit={calculate} className="bg-white border-2 border-[#F26500] rounded-3xl p-6 md:p-8 flex flex-col gap-5">

            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-[#1A1A1A] leading-tight">Dahej Calculator</h1>
                <p className="text-xs md:text-sm text-[#888] mt-1">Calculate expected dahej estimation</p>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-[#F0E0D0]" />
              <i className="fa-solid fa-om text-[#F26500] text-xs opacity-40" />
              <div className="flex-1 h-px bg-[#F0E0D0]" />
            </div>

            {/* Groom's Education */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#333]">Groom's Education</label>
              <div className="relative">
                <select value={education} onChange={(e) => setEducation(e.target.value)} className={selectCls}>
                  <option value="">Select Education</option>
                  {EDUCATION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[#BBB] text-xs pointer-events-none" />
              </div>
            </div>

            {/* Groom's Profession */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#333]">Groom's Profession</label>
              <div className="relative">
                <select value={profession} onChange={(e) => setProfession(e.target.value)} className={selectCls}>
                  <option value="">Select Profession</option>
                  {PROFESSION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[#BBB] text-xs pointer-events-none" />
              </div>
            </div>

            {/* Groom's Monthly Income */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#333]">Groom's Monthly Income</label>
              <div className="relative">
                <select value={income} onChange={(e) => setIncome(e.target.value)} className={selectCls}>
                  <option value="">Select Income Range</option>
                  {INCOME_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[#BBB] text-xs pointer-events-none" />
              </div>
            </div>

            {/* Groom's City */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#333]">Groom's City</label>
              <div className="relative">
                <select value={city} onChange={(e) => setCity(e.target.value)} className={selectCls}>
                  <option value="">Select City</option>
                  {CITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[#BBB] text-xs pointer-events-none" />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!canCalculate || loading}
              className="w-full bg-[#F26500] hover:bg-[#D95A00] disabled:opacity-50 text-white font-bold rounded-2xl py-3.5 flex items-center justify-center gap-2 transition-colors mt-1"
            >
              {loading
                ? <><i className="fa-solid fa-spinner animate-spin" /> Calculating...</>
                : <><i className="fa-solid fa-calculator" /> Calculate Dahej</>}
            </button>
          </form>

          {/* ── Right: Result ── */}
          {result && <ResultPanel result={result} />}

          {/* -- Right: Guidance Card -- */}
          <div className={result ? "lg:col-span-1 md:col-span-2" : "col-span-1"}>
            <PersonalGuidanceCard showExtraContent={true} />
          </div>
        </div>

        {/* ── Awareness Section ── */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {AWARENESS.map((a) => (
            <div key={a.title} className="flex flex-col items-center gap-3 text-center p-6 bg-white rounded-2xl border-2 border-[#F26500] shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 rounded-full bg-[#FFF0E6] flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className={`${a.icon} text-[#F26500] text-xl`} />
              </div>
              <p className="text-[15px] font-black text-[#1A1A1A]">{a.title}</p>
              <p className="text-[13px] text-[#444] font-medium leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner (DRY Component) */}
        <div className="mt-12">
          <GuidanceCTA 
            title="Want to know what the stars say about your marriage?"
            description="Talk to our Astrology Experts and get personalized marriage guidance."
          />
        </div>

      </div>

      {/* ── SEO & Awareness Section ── */}
      <DahejSeoContent />

    </div>
  );
};

export default DahejCalculatorPage;







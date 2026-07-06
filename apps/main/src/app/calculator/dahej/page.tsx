"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PersonalGuidanceCard from "@/components/ui/PersonalGuidanceCard";
import GuidanceCTA from "@/components/ui/GuidanceCTA";
import { hashSeed, normalizeName, getJobTier, formatIndianCurrency } from "./helpers";

// ─── Dropdown options ────────────────────────────────────────────────────────
const EDUCATION_OPTIONS = [
  "High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD / Doctorate",
];
const PROFESSION_OPTIONS = [
  "Government Employee", "Software Engineer", "Doctor", "Lawyer", "Business Owner",
  "Teacher / Professor", "Engineer", "Banker", "CA / Finance", "Other",
];
const INCOME_OPTIONS = [
  "Below 2 Lakh", "2 - 5 Lakh", "5 - 10 Lakh", "10 - 15 Lakh",
  "15 - 20 Lakh", "20 - 30 Lakh", "30 - 50 Lakh", "Above 50 Lakh",
];
const CITY_OPTIONS = [
  "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Bhopal",
  "Patna", "Indore", "Nagpur", "Other",
];

// Income tier multiplier
const incomeMultiplier: Record<string, number> = {
  "Below 2 Lakh": 0.4, "2 - 5 Lakh": 0.6, "5 - 10 Lakh": 0.8,
  "10 - 15 Lakh": 1.0, "15 - 20 Lakh": 1.2, "20 - 30 Lakh": 1.5,
  "30 - 50 Lakh": 2.0, "Above 50 Lakh": 3.0,
};
const educationMultiplier: Record<string, number> = {
  "High School": 0.5, "Diploma": 0.7, "Bachelor's Degree": 1.0,
  "Master's Degree": 1.3, "PhD / Doctorate": 1.6,
};
const cityMultiplier: Record<string, number> = {
  "Delhi": 1.5, "Mumbai": 1.6, "Bangalore": 1.4, "Hyderabad": 1.3,
  "Chennai": 1.2, "Kolkata": 1.1, "Pune": 1.2, "Chandigarh": 1.3,
  "Ahmedabad": 1.1, "Jaipur": 1.0, "Other": 0.9,
};

// ─── Result Panel ────────────────────────────────────────────────────────────
const ResultPanel = ({ result }: { result: any }) => {
  const details = [
    { icon: "fa-solid fa-graduation-cap", label: "Education", value: result.education },
    { icon: "fa-solid fa-briefcase",      label: "Profession", value: result.profession },
    { icon: "fa-solid fa-wallet",         label: "Monthly Income", value: result.income },
    { icon: "fa-solid fa-location-dot",   label: "City", value: result.city },
  ];

  return (
    <div className="bg-white border border-[#F0E0D0] rounded-3xl p-6 md:p-8 flex flex-col gap-5 h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#FFF0E6] flex items-center justify-center">
          <i className="fa-solid fa-indian-rupee-sign text-[#F26500] text-lg" />
        </div>
        <div>
          <h2 className="text-lg font-black text-[#1A1A1A]">Estimated Dahej Range</h2>
          <p className="text-xs text-[#888]">This is an estimated range based on the details provided.</p>
        </div>
      </div>

      {/* Amount */}
      <div className="bg-[#FFF8F3] border border-[#F5E0CC] rounded-2xl px-5 py-4 text-center">
        <p className="text-2xl md:text-3xl font-black text-[#F26500]">
          ₹ {result.minFormatted} – ₹ {result.maxFormatted}
        </p>
      </div>

      {/* Detail rows */}
      <div className="flex flex-col gap-3">
        {details.map((d) => (
          <div key={d.label} className="flex items-center justify-between border-b border-[#F5EEE8] pb-2 last:border-0 last:pb-0">
            <div className="flex items-center gap-2 text-[#555]">
              <i className={`${d.icon} text-[#F26500] text-sm w-5`} />
              <span className="text-sm font-medium">{d.label}</span>
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

// ─── Awareness Footer ────────────────────────────────────────────────────────
const AWARENESS = [
  { icon: "fa-solid fa-scale-balanced", title: "Legal Awareness",   desc: "Dowry is a punishable offense under the Dowry Prohibition Act, 1961." },
  { icon: "fa-solid fa-handshake",        title: "Respect & Equality", desc: "Support a dowry-free society and promote equal relationships." },
  { icon: "fa-solid fa-people-group",   title: "Build Better Future", desc: "Say no to dowry and build a better tomorrow." },
  { icon: "fa-solid fa-shield-halved",  title: "Report & Support",   desc: "Report dowry demands and help stop this social evil." },
];

// ─── Main Page ───────────────────────────────────────────────────────────────
const DahejCalculatorPage = () => {
  const [education, setEducation] = useState("");
  const [profession, setProfession] = useState("");
  const [income, setIncome] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const canCalculate = education && profession && income && city;

  const calculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCalculate) return;
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 700));

    const seed = hashSeed(normalizeName(`${education}${profession}${city}`));
    const eduMul  = educationMultiplier[education] ?? 1;
    const incMul  = incomeMultiplier[income] ?? 1;
    const citMul  = cityMultiplier[city] ?? 1;
    const base    = 500000 + (seed % 500000);
    const amount  = Math.round(base * eduMul * incMul * citMul);
    const min     = Math.round(amount * 0.85);
    const max     = Math.round(amount * 1.15);

    setResult({
      education,
      profession,
      income,
      city,
      minFormatted: formatIndianCurrency(min, { lakh: "Lakh", cr: "Cr" }),
      maxFormatted: formatIndianCurrency(max, { lakh: "Lakh", cr: "Cr" }),
    });
    setLoading(false);
  };

  const selectCls = "w-full border border-[#E8D5C0] rounded-xl px-4 py-3 pr-10 text-sm text-[#333] bg-white focus:outline-none focus:border-[#F26500] focus:ring-2 focus:ring-[#F26500]/20 transition appearance-none cursor-pointer";

  return (
    <div className="min-h-screen bg-[#FDF6F0]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <p className="text-sm text-[#888]">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span className="text-[#F26500] font-semibold">Calculators</span>
          <span className="mx-2">›</span>
          <span className="text-[#444]">Dahej Calculator</span>
        </p>
      </div>

      {/* Main Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className={`grid gap-6 ${result ? "lg:grid-cols-3 md:grid-cols-2" : "md:grid-cols-2 max-w-5xl"} mx-auto`}>

          {/* ── Left: Form ── */}
          <form onSubmit={calculate} className="bg-white border border-[#F0E0D0] rounded-3xl p-6 md:p-8 flex flex-col gap-5">

            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-[#FFF0E6] flex items-center justify-center">
                <i className="fa-solid fa-calculator text-[#F26500] text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-black text-[#1A1A1A]">Dahej Calculator</h1>
                <p className="text-xs text-[#888]">Calculate expected dahej estimation</p>
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
            <PersonalGuidanceCard className="h-full" />
          </div>
        </div>

        {/* ── Awareness Section ── */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {AWARENESS.map((a) => (
            <div key={a.title} className="flex flex-col items-center gap-3 text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF0E6] flex items-center justify-center">
                <i className={`${a.icon} text-[#F26500] text-lg`} />
              </div>
              <p className="text-sm font-black text-[#1A1A1A]">{a.title}</p>
              <p className="text-xs text-[#777]">{a.desc}</p>
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
    </div>
  );
};

export default DahejCalculatorPage;







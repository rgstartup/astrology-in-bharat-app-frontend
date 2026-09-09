"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PersonalGuidanceCard from "@/components/ui/PersonalGuidanceCard";
import ZodiacCompatibilitySeoContent from "./zodiac-compatibility-seo.component";
import ChooseYourZodiac from "@/features/home/ChooseYourZodiac";
import {
  ZODIAC_SIGNS,
  ELEMENT_COLORS,
  getCompatLabel,
  calculateZodiacCompatibility,
  type ZodiacCompatibilityResult,
} from "./calculate";

export default function ZodiacCompatibilityPage() {
  const [yourSign, setYourSign] = useState("");
  const [partnerSign, setPartnerSign] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ZodiacCompatibilityResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yourSign || !partnerSign) return;
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 700));
    const res = calculateZodiacCompatibility(yourSign, partnerSign);
    setResult(res);
    setLoading(false);
  };

  const selectCls =
    "w-full border-2 border-[#F0E0D0] rounded-xl px-4 py-3.5 text-sm text-[#333] bg-white focus:outline-none focus:border-[#F26500] focus:ring-4 focus:ring-[#F26500]/10 transition-all font-medium appearance-none cursor-pointer";

  const yourSignData = result ? ZODIAC_SIGNS[result.yourIdx] : null;
  const partnerSignData = result ? ZODIAC_SIGNS[result.partnerIdx] : null;
  const compat = result ? getCompatLabel(result.score) : null;

  return (
    <div
      className="min-h-screen bg-[#FDF6F0] overflow-x-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Breadcrumb */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 py-4">
        <p className="text-sm text-[#888] flex items-center">
          <Link href="/" className="hover:text-[#F26500] transition-colors">
            Home
          </Link>
          <span className="mx-2">›</span>
          <Link
            href="/calculator"
            className="text-[#F26500] font-semibold hover:underline"
          >
            Calculators
          </Link>
          <span className="mx-2">›</span>
          <span className="text-[#444]">Zodiac Compatibility</span>
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 pb-4">
        <div
          className={`grid gap-6 ${result ? "lg:grid-cols-3 md:grid-cols-2" : "md:grid-cols-2 max-w-5xl mx-auto"}`}
        >
          {/* ── Left: Form ── */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border-2 border-[#F26500] rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-[#1A1A1A] leading-tight whitespace-normal sm:whitespace-nowrap tracking-tight sm:tracking-normal">
                  Zodiac Compatibility
                </h1>
                <p className="text-xs md:text-sm text-[#888] mt-1">
                  Check how compatible your zodiac signs are
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#F0E0D0] to-transparent" />

            <div className="flex flex-col gap-4">
              {/* Your Sign */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#333]">
                  Your Zodiac Sign
                </label>
                <div className="relative">
                  <select
                    value={yourSign}
                    onChange={(e) => setYourSign(e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Select your sign</option>
                    {ZODIAC_SIGNS.map((z) => (
                      <option key={z.name} value={z.name}>
                        {z.emoji} {z.name} ({z.dates})
                      </option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[#BBB] text-xs pointer-events-none" />
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#F0E0D0]" />
                <button
                  type="button"
                  onClick={() => {
                    setYourSign(partnerSign);
                    setPartnerSign(yourSign);
                  }}
                  className="w-9 h-9 rounded-full bg-[#FFF0E6] border border-[#F5E0CC] flex items-center justify-center text-[#F26500] hover:bg-[#F26500] hover:text-white transition-colors shrink-0"
                >
                  <i className="fa-solid fa-arrows-up-down text-xs" />
                </button>
                <div className="flex-1 h-px bg-[#F0E0D0]" />
              </div>

              {/* Partner Sign */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#333]">
                  Partner's Zodiac Sign
                </label>
                <div className="relative">
                  <select
                    value={partnerSign}
                    onChange={(e) => setPartnerSign(e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Select partner's sign</option>
                    {ZODIAC_SIGNS.map((z) => (
                      <option key={z.name} value={z.name}>
                        {z.emoji} {z.name} ({z.dates})
                      </option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[#BBB] text-xs pointer-events-none" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!yourSign || !partnerSign || loading}
              className="mt-2 w-full bg-gradient-to-r from-[#F26500] to-[#E65A00] hover:from-[#E65A00] hover:to-[#D95A00] disabled:opacity-50 text-white font-black rounded-xl py-4 flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin" /> Checking...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-heart" /> Check Compatibility
                </>
              )}
            </button>
          </form>

          {/* ── Middle: Result ── */}
          {result && yourSignData && partnerSignData && compat && (
            <div className="bg-white border-2 border-[#F26500] rounded-3xl p-6 md:p-8 flex flex-col gap-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F26500]/5 rounded-bl-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F26500]/5 rounded-tr-full pointer-events-none" />

              <h2 className="text-[#F26500] font-black text-sm uppercase tracking-wider">
                Compatibility Result
              </h2>

              {/* Signs display */}
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-16 h-16 rounded-full bg-[#FFF8F3] border-2 border-[#F5E0CC] flex items-center justify-center text-3xl">
                    {yourSignData.emoji}
                  </div>
                  <span className="text-xs font-bold text-[#333]">
                    {yourSignData.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ELEMENT_COLORS[yourSignData.element]}`}
                  >
                    {yourSignData.element}
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <i className="fa-solid fa-heart text-[#F26500] text-xl" />
                  <span className={`text-3xl font-black ${compat.color}`}>
                    {result.score}%
                  </span>
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full border ${compat.bg} ${compat.color}`}
                  >
                    {compat.label}
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="w-16 h-16 rounded-full bg-[#FFF8F3] border-2 border-[#F5E0CC] flex items-center justify-center text-3xl">
                    {partnerSignData.emoji}
                  </div>
                  <span className="text-xs font-bold text-[#333]">
                    {partnerSignData.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ELEMENT_COLORS[partnerSignData.element]}`}
                  >
                    {partnerSignData.element}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs font-bold text-[#888] mb-2">
                  <span>Compatibility Score</span>
                  <span>{result.score}%</span>
                </div>
                <div className="w-full h-3 bg-[#F5E0CC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#F26500] to-[#FF9A3C] rounded-full transition-all duration-700"
                    style={{ width: `${result.score}%` }}
                  />
                </div>
              </div>

              {/* Elements note */}
              <div className="bg-[#F9F9F9] border border-[#EEE] rounded-xl p-4 relative z-10">
                <p className="text-xs font-bold text-[#888] uppercase tracking-wide mb-2">
                  Element Match
                </p>
                <p className="text-sm text-[#444] font-medium leading-relaxed">
                  {yourSignData.element === partnerSignData.element
                    ? `Both are ${yourSignData.element} signs — you share the same elemental energy, creating a strong natural bond!`
                    : `${yourSignData.name} (${yourSignData.element}) and ${partnerSignData.name} (${partnerSignData.element}) — different elements can complement each other beautifully.`}
                </p>
              </div>
            </div>
          )}

          {/* ── Right: Guidance Card ── */}
          <div
            className={result ? "lg:col-span-1 md:col-span-2" : "col-span-1"}
          >
            <PersonalGuidanceCard showExtraContent={true} />
          </div>
        </div>

        {/* Existing ChooseYourZodiac Component */}
        <div className="mt-8 rounded-3xl overflow-hidden border border-[#F0E0D0]">
          <ChooseYourZodiac
            selectedSignIds={[
              yourSign
                ? ZODIAC_SIGNS.findIndex((z) => z.name === yourSign) + 1
                : -1,
              partnerSign
                ? ZODIAC_SIGNS.findIndex((z) => z.name === partnerSign) + 1
                : -1,
            ].filter((id) => id > 0)}
            onSelectSign={(sign) => {
              if (!yourSign || (yourSign && partnerSign)) {
                setYourSign(sign.title);
                setPartnerSign("");
                setResult(null);
              } else {
                setPartnerSign(sign.title);
              }
            }}
          />
        </div>

        {/* Bottom CTA Banner */}
        <section className="mt-12 bg-[#1a0b0b] rounded-3xl px-5 py-6 sm:px-8 sm:py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="/images/horoscope-round2.png"
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 w-full text-center md:text-left">
            <p className="text-[#F26500] font-bold text-[13px] sm:text-sm mb-1">
              Personalized Guidance
            </p>
            <h3 className="text-white text-[15px] sm:text-[19px] md:text-2xl font-black leading-snug md:leading-normal text-balance mx-auto md:mx-0">
              Want a deeper compatibility analysis based on your full Kundli?
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Talk to our expert astrologers for a detailed match-making report.
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
      <ZodiacCompatibilitySeoContent />
    </div>
  );
}

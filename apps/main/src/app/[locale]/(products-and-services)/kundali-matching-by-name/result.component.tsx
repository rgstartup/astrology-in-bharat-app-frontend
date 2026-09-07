"use client";

import React from "react";
import { FaCheckCircle, FaExclamationTriangle, FaShieldAlt, FaFire } from "react-icons/fa";
import { FiShare2, FiFileText } from "react-icons/fi";
import { useLanguageStore } from "@repo/store";
import { matchingTranslations } from "@/lib/translations/calculators/matching";

import { AdvancedResultsComponentProps } from "@/lib/types";

const GUNA_COLORS = [
  "#60a5fa", // Varna - blue
  "#f97316", // Vashya - orange
  "#22c55e", // Tara - green
  "#3b82f6", // Yoni - darker blue
  "#60a5fa", // Graha Maitri - blue
  "#4ade80", // Gana - light green
  "#22c55e", // Bhakoot - green
  "#1e293b", // Nadi - dark
];

const GUNA_ICONS: Record<string, string> = {
  "Varna": "fa-user",
  "Vashya": "fa-magnet",
  "Tara": "fa-star",
  "Yoni": "fa-paw",
  "Graha Maitri": "fa-hands-holding-circle",
  "Gana": "fa-users",
  "Bhakoot": "fa-heart",
  "Nadi": "fa-droplet",
};

// Fallback names by Guna ID (sandbox API returns {} for name fields)
const GUNA_NAME_BY_ID: Record<number, string> = {
  1: "Varna",
  2: "Vashya",
  3: "Tara",
  4: "Yoni",
  5: "Graha Maitri",
  6: "Gana",
  7: "Bhakoot",
  8: "Nadi",
};

// Safely convert a value to a displayable string
const safeStr = (val: any, fallback = ""): string => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") return fallback; // {} → fallback
  return String(val);
};

const ICON_STYLE: Record<string, string> = {
  "Varna": "bg-pink-50 text-pink-400",
  "Vashya": "bg-pink-50 text-pink-400",
  "Tara": "bg-[#f4f7ed] text-[#84cc16]",
  "Gana": "bg-[#f4f7ed] text-[#84cc16]",
  "Yoni": "bg-[#edf7f0] text-[#22c55e]",
  "Graha Maitri": "bg-[#edf7f0] text-[#22c55e]",
  "Bhakoot": "bg-[#fff8ed] text-[#f59e0b]",
  "Nadi": "bg-[#fff8ed] text-[#f59e0b]",
};

// Build conic-gradient string from guna data
function buildConicGradient(gunas: any[]) {
  if (!gunas.length) return "conic-gradient(#e2e8f0 0% 100%)";
  const total = gunas.reduce((acc: number, g: any) => acc + (g.maximum_points || 1), 0);
  let angle = 0;
  const segments = gunas.map((g: any, i: number) => {
    const pct = ((g.maximum_points || 1) / total) * 100;
    const start = angle;
    const end = angle + pct;
    angle = end;
    return `${GUNA_COLORS[i % GUNA_COLORS.length]} ${start.toFixed(1)}% ${end.toFixed(1)}%`;
  });
  return `conic-gradient(${segments.join(", ")})`;
}

const ResultComponent = ({
  resultsRef,
  matchingResult,
}: AdvancedResultsComponentProps) => {
  const { lang } = useLanguageStore();
  const t = (matchingTranslations[lang as keyof typeof matchingTranslations] || matchingTranslations.en).results;

  const totalScore = matchingResult.guna_milan?.total_points ?? matchingResult.total?.score ?? 0;
  const maxScore = matchingResult.guna_milan?.maximum_points ?? 36;
  const scorePercentage = Math.min((totalScore / maxScore) * 100, 100);
  const isExcellent = totalScore >= 18;

  const gunas: any[] = matchingResult.guna_milan?.guna || [];
  const conicGradient = buildConicGradient(gunas);

  const hasManglik =
    matchingResult.boy_mangal_dosha_details?.has_dosha ||
    matchingResult.girl_mangal_dosha_details?.has_dosha;

  const getGunaRating = (obtained: number, max: number) => {
    if (obtained === max) return { text: "Excellent", color: "text-green-600", icon: <FaCheckCircle className="text-green-500 text-[10px]" /> };
    if (obtained >= max / 2) return { text: "Good", color: "text-orange-500", icon: <FaCheckCircle className="text-orange-400 text-[10px]" /> };
    return { text: "Average", color: "text-amber-500", icon: <FaExclamationTriangle className="text-amber-400 text-[10px]" /> };
  };

  return (
    <section ref={resultsRef} className="py-6 bg-transparent relative z-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* ── White Card ── */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.05)] overflow-hidden p-6 md:p-8">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center text-base">
                <i className="fa-solid fa-sparkles" />
              </div>
              <div>
                <h2 className="text-[17px] font-bold text-slate-800 leading-tight">Matching Result</h2>
                <p className="text-[12px] text-slate-500">Based on Ashtakoot Milan (36 Gun Milan)</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-orange-200 text-orange-600 text-[12px] font-semibold hover:bg-orange-50 transition-colors">
                <FiFileText className="text-sm" /> View Full Report
              </button>
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-orange-200 text-orange-600 text-[12px] font-semibold hover:bg-orange-50 transition-colors">
                <FiShare2 className="text-sm" /> Share Result
              </button>
            </div>
          </div>

          {/* ── 3-Panel Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">

            {/* Panel 1 — Overall Compatibility */}
            <div className="lg:col-span-4 bg-[#fff9f4] border border-orange-100 rounded-2xl p-6 flex flex-col">
              <p className="text-[13px] font-bold text-slate-800 text-center mb-5">Overall Compatibility</p>

              {/* Score */}
              <div className="flex items-baseline justify-center gap-1 mb-3">
                <span className={`text-[56px] leading-none font-black ${isExcellent ? "text-[#f95700]" : "text-slate-700"}`}>
                  {totalScore}
                </span>
                <span className="text-[22px] font-bold text-[#f95700]">/ {maxScore}</span>
              </div>

              {/* Badge */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <FaCheckCircle className="text-green-500 text-base" />
                <span className="text-[14px] font-bold text-green-600">
                  {isExcellent ? "Excellent Match" : "Moderate Match"}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full mb-1">
                <div className="h-2.5 w-full bg-[#f0e4dc] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 transition-all duration-700"
                    style={{ width: `${scorePercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-1.5">
                  <span>0</span>
                  <span className="text-center leading-tight">18<br />Average</span>
                  <span className="text-right leading-tight">36<br />Best</span>
                </div>
              </div>

              {/* Info box */}
              <div className="mt-5 bg-[#f0f9f3] border border-green-100 rounded-xl p-3.5 flex gap-2.5">
                <FaCheckCircle className="text-green-500 mt-0.5 shrink-0 text-[13px]" />
                <p className="text-[11px] text-green-800 font-medium leading-relaxed">
                  This is an excellent match. You both have great compatibility and a blessed future together.
                </p>
              </div>
            </div>

            {/* Panel 2 — Guna Milan Score (Doughnut) */}
            <div className="lg:col-span-4 bg-[#fff9f4] border border-orange-100 rounded-2xl p-6">
              <p className="text-[13px] font-bold text-slate-800 mb-5">Guna Milan Score</p>

              <div className="flex items-center gap-5">
                {/* Doughnut */}
                <div
                  className="shrink-0 relative rounded-full"
                  style={{
                    width: 110,
                    height: 110,
                    background: gunas.length ? conicGradient : "#e2e8f0",
                    padding: 14,
                  }}
                >
                  <div className="w-full h-full bg-[#fff9f4] rounded-full flex flex-col items-center justify-center">
                    <span className="text-[26px] font-black text-[#f95700] leading-none">{totalScore}</span>
                    <span className="text-[11px] font-semibold text-slate-400">/{maxScore}</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  {gunas.slice(0, 8).map((item: any, idx: number) => {
                    const gunaName = GUNA_NAME_BY_ID[item.id] ?? safeStr(item.name, `Guna ${idx + 1}`);
                    return (
                      <div key={idx} className="flex items-center justify-between gap-2 text-[11px]">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ background: GUNA_COLORS[idx % GUNA_COLORS.length] }}
                          />
                          <span className="text-slate-600 truncate">{gunaName}</span>
                        </div>
                        <span className="font-semibold text-slate-700 shrink-0">
                          {item.obtained_points}
                          <span className="text-slate-400 font-normal"> / {item.maximum_points}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Panel 3 — Dosha Status */}
            <div className="lg:col-span-4 flex flex-col gap-3">

              {/* Manglik */}
              <div className={`flex-1 rounded-2xl border p-4 flex gap-3 items-center ${hasManglik ? "bg-red-50 border-red-100" : "bg-[#fffcf8] border-orange-100"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${hasManglik ? "bg-red-100 text-red-500" : "bg-orange-100 text-orange-500"}`}>
                  <FaFire className="text-base" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Manglik Status</p>
                  <h4 className={`text-[13px] font-bold ${hasManglik ? "text-red-600" : "text-slate-800"}`}>
                    {hasManglik ? "Manglik Dosha Present" : "Both Non-Manglik"}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">No Manglik Dosha</p>
                </div>
              </div>

              {/* Bhakoot */}
              <div className="flex-1 rounded-2xl border border-gray-100 bg-white p-4 flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 text-green-500 flex items-center justify-center shrink-0">
                  <FaShieldAlt className="text-base" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Bhakoot Dosha</p>
                  <h4 className="text-[13px] font-bold text-green-600">Not Present</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">No Bhakoot Dosha</p>
                </div>
              </div>

              {/* Nadi */}
              <div className="flex-1 rounded-2xl border border-gray-100 bg-white p-4 flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 text-green-500 flex items-center justify-center shrink-0">
                  <FaShieldAlt className="text-base" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Nadi Dosha</p>
                  <h4 className="text-[13px] font-bold text-green-600">Not Present</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Nadi Milan is Good</p>
                </div>
              </div>

            </div>
          </div>

          {/* ── Detailed Guna Milan Grid ── */}
          <div className="border-t border-gray-100 pt-7">
            <h3 className="text-[15px] font-bold text-slate-800 mb-4">Detailed Guna Milan</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {gunas.map((item: any, idx: number) => {
                const gunaName = GUNA_NAME_BY_ID[item.id] ?? safeStr(item.name, `Guna ${idx + 1}`);
                const rating = getGunaRating(item.obtained_points, item.maximum_points);
                const iconStyle = ICON_STYLE[gunaName] ?? "bg-orange-50 text-orange-400";
                return (
                  <div key={idx} className="bg-white border border-orange-100/60 rounded-2xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconStyle}`}>
                      <i className={`fa-solid ${GUNA_ICONS[gunaName] || "fa-star"} text-base`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-slate-800 truncate">{gunaName}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {rating.icon}
                        <span className={`text-[10px] font-semibold ${rating.color}`}>{rating.text}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[14px] font-bold text-slate-800">
                        {item.obtained_points}
                        <span className="text-[12px] text-gray-400"> / {item.maximum_points}</span>
                      </p>
                      <p className={`text-[10px] font-semibold ${rating.color}`}>{rating.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ResultComponent;

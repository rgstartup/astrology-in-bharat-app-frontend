"use client";

import React from "react";
import { ShieldCheck, Sparkles, TrendingUp, Languages } from "lucide-react";
import { ExpertiseOverviewProps } from "./types";

export const ExpertiseOverview: React.FC<ExpertiseOverviewProps> = ({
  specializations,
  consultFormatted,
  languagesList,
}) => {
  return (
    <>
      {/* Header: Areas of Expertise & Verified Seal */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-orange-600">
              Areas of Expertise
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5">
              Specializations & Consultations
            </h3>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-50 px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs">
            <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
            <span>Verified Astrologer</span>
          </div>
        </div>

        {/* Unified Specialization Badges with Gradient & White Border */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {specializations.length > 0 ? (
            specializations.map((spec, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-gradient-to-r from-[#d9eff4] via-[#e6f6f9] to-[#f4fcfe] border-2 border-white px-3 py-1.5 rounded-xl select-none shadow-[0_2px_6px_rgba(15,23,42,0.06)] hover:shadow-sm hover:scale-[1.02] transition-all cursor-default"
              >
                <Sparkles className="size-3.5 text-slate-700 shrink-0" />
                <span>{spec}</span>
              </div>
            ))
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-gradient-to-r from-[#d9eff4] via-[#e6f6f9] to-[#f4fcfe] border-2 border-white px-3 py-1.5 rounded-xl select-none shadow-[0_2px_6px_rgba(15,23,42,0.06)]">
              <Sparkles className="size-3.5 text-slate-700 shrink-0" />
              <span>Vedic Astrology</span>
            </div>
          )}
        </div>
      </div>

      {/* 2-Column Meta Cards: Consultations Done & Languages Spoken */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 sm:p-4 rounded-xl bg-slate-50/60 border border-slate-200/50">
        {/* Consultations Done */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-white border border-slate-200/70 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
            <TrendingUp className="size-4.5 text-slate-700" />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Consultations Done
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm sm:text-base font-bold text-slate-900">
                {consultFormatted}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Sessions Completed
              </span>
            </div>
          </div>
        </div>

        {/* Languages Spoken */}
        <div className="flex items-center gap-3 sm:border-l border-slate-200/50 sm:pl-4">
          <div className="size-10 rounded-xl bg-white border border-slate-200/70 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
            <Languages className="size-4.5 text-slate-700" />
          </div>
          <div className="min-w-0 truncate">
            <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Languages Spoken
            </span>
            <span
              className="text-xs sm:text-sm font-semibold text-slate-900 truncate block mt-0.5"
              title={languagesList}
            >
              {languagesList}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

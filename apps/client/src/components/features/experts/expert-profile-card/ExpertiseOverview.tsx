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
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Areas of Expertise
            </span>
            <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight mt-0.5">
              Specializations & Consultations
            </h3>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1 rounded-full border border-slate-200/70 shadow-2xs">
            <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
            <span>Verified Astrologer</span>
          </div>
        </div>

        {/* Unified Clean Specialization Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-3.5">
          {specializations.length > 0 ? (
            specializations.map((spec, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50/90 border border-slate-200/70 px-2.5 py-1 rounded-lg select-none"
              >
                <Sparkles className="size-3 text-slate-400 shrink-0" />
                <span>{spec}</span>
              </div>
            ))
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50/90 border border-slate-200/70 px-2.5 py-1 rounded-lg select-none">
              <Sparkles className="size-3 text-slate-400 shrink-0" />
              <span>Vedic Astrology</span>
            </div>
          )}
        </div>
      </div>

      {/* 2-Column Meta Cards: Consultations Done & Languages Spoken */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 sm:p-4 rounded-xl bg-slate-50/60 border border-slate-200/40">
        {/* Consultations Done */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-white border border-slate-200/70 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
            <TrendingUp className="size-4.5 text-slate-700" />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Consultations Done
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm sm:text-base font-black text-gray-900">
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
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Languages Spoken
            </span>
            <span
              className="text-xs sm:text-sm font-bold text-gray-900 truncate block mt-0.5"
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

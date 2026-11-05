"use client";

import React from "react";
import { ProfileStatsStripProps } from "./types";

export const ProfileStatsStrip: React.FC<ProfileStatsStripProps> = ({
  expYears,
  ratingValue,
  currentLikesFormatted,
}) => {
  return (
    <div className="grid grid-cols-3 gap-1 p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/50 text-center">
      {/* Experience */}
      <div className="flex flex-col items-center justify-center py-1 px-1 rounded-lg hover:bg-white transition-colors">
        <span className="text-base sm:text-lg font-extrabold text-slate-900 leading-none">
          {expYears}+ Yrs
        </span>
        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
          Experience
        </span>
      </div>

      {/* Rating */}
      <div className="flex flex-col items-center justify-center py-1 px-1 rounded-lg hover:bg-white transition-colors border-x border-slate-200/50">
        <span className="text-base sm:text-lg font-extrabold text-slate-900 leading-none">
          {ratingValue}
        </span>
        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
          Rating
        </span>
      </div>

      {/* Likes */}
      <div className="flex flex-col items-center justify-center py-1 px-1 rounded-lg hover:bg-white transition-colors">
        <span className="text-base sm:text-lg font-extrabold text-slate-900 leading-none">
          {currentLikesFormatted}
        </span>
        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
          Likes
        </span>
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { ProfileStatsStripProps } from "./types";

export const ProfileStatsStrip: React.FC<ProfileStatsStripProps> = ({
  expYears,
  ratingValue,
  currentLikesFormatted,
}) => {
  return (
    <div className="grid grid-cols-3 gap-1 p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/40 text-center">
      {/* Experience */}
      <div className="flex flex-col items-center justify-center py-1 px-1 rounded-lg hover:bg-white transition-colors">
        <span className="text-sm sm:text-base font-black text-gray-900 leading-tight">
          {expYears}+ Yrs
        </span>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">
          Experience
        </span>
      </div>

      {/* Rating */}
      <div className="flex flex-col items-center justify-center py-1 px-1 rounded-lg hover:bg-white transition-colors border-x border-slate-200/40">
        <span className="text-sm sm:text-base font-black text-gray-900 leading-tight">
          {ratingValue}
        </span>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">
          Rating
        </span>
      </div>

      {/* Likes */}
      <div className="flex flex-col items-center justify-center py-1 px-1 rounded-lg hover:bg-white transition-colors">
        <span className="text-sm sm:text-base font-black text-gray-900 leading-tight">
          {currentLikesFormatted}
        </span>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">
          Likes
        </span>
      </div>
    </div>
  );
};

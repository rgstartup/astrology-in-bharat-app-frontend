"use client";

import React from "react";
import { useExploreExpertsContext } from "../../context/ExploreExpertsContext";

export function AvailabilityFilter() {
  const { filters, setOnlyOnline } = useExploreExpertsContext();

  return (
    <div className="p-4 rounded-2xl bg-linear-to-r from-orange/5 via-amber-500/5 to-transparent border border-orange/15 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={`size-3 rounded-full transition-all ${
              filters.onlyOnline
                ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"
                : "bg-gray-300"
            }`}
          />
          <div>
            <span className="text-xs font-bold text-gray-900 block">
              Available Now
            </span>
            <span className="text-[10px] text-gray-500 font-medium">
              Show online gurus only
            </span>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onlyOnline}
            onChange={(e) => setOnlyOnline(e.target.checked)}
            className="sr-only peer"
            aria-label="Filter online gurus only"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange shadow-inner"></div>
        </label>
      </div>
    </div>
  );
}

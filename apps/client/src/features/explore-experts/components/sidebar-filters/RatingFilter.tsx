"use client";

import React from "react";
import { Star, Check } from "lucide-react";
import { useExploreExpertsContext } from "../../context/ExploreExpertsContext";

const RATING_OPTIONS = [
  { val: 4.5, label: "4.5 & above" },
  { val: 4.0, label: "4.0 & above" },
  { val: 3.0, label: "3.0 & above" },
  { val: 0, label: "All Ratings" },
];

export function RatingFilter() {
  const { filters, setMinRating } = useExploreExpertsContext();

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Customer Rating
        </label>
        {filters.minRating > 0 && (
          <span className="text-[10px] font-bold text-orange">
            {filters.minRating}★ & above
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        {RATING_OPTIONS.map(({ val, label }) => {
          const active = filters.minRating === val;
          return (
            <button
              key={val}
              type="button"
              onClick={() => setMinRating(val)}
              className={`w-full flex items-center justify-between py-2 px-3 rounded-xl border text-xs transition-all cursor-pointer select-none ${
                active
                  ? "bg-orange/10 border-orange/50 text-orange font-bold shadow-xs"
                  : "bg-white border-gray-200/80 hover:bg-gray-50 text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {val > 0 ? (
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`size-3.5 ${
                          s <= Math.floor(val)
                            ? "fill-amber-400 text-amber-400"
                            : s === 5 && val === 4.5
                              ? "fill-amber-400/40 text-amber-400"
                              : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-gray-400">★</span>
                )}

                <span className="text-xs">{label}</span>
              </div>

              <div
                className={`size-4 rounded-full border flex items-center justify-center transition-all ${
                  active
                    ? "border-orange bg-orange text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {active && <Check className="size-2.5 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

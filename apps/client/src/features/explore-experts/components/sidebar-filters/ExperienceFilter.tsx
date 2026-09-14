"use client";

import React from "react";
import { useExploreExpertsContext } from "../../context/ExploreExpertsContext";

const EXPERIENCE_OPTIONS = [
  { val: 0, label: "All Years" },
  { val: 5, label: "5+ Years" },
  { val: 10, label: "10+ Years" },
  { val: 15, label: "15+ Years" },
];

export function ExperienceFilter() {
  const { filters, setMinExperience } = useExploreExpertsContext();

  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2.5">
        Experience
      </label>
      <div className="grid grid-cols-2 gap-1.5">
        {EXPERIENCE_OPTIONS.map(({ val, label }) => {
          const active = filters.minExperience === val;
          return (
            <button
              key={val}
              type="button"
              onClick={() => setMinExperience(val)}
              className={`py-1.5 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                active
                  ? "bg-orange text-white border-orange shadow-sm font-extrabold"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:border-orange/30 hover:bg-orange/5"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

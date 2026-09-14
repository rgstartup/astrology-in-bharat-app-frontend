"use client";

import React from "react";
import { useExploreExpertsContext } from "../../context/ExploreExpertsContext";

const POPULAR_LANGUAGES = [
  "Hindi",
  "English",
  "Sanskrit",
  "Gujarati",
  "Marathi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Punjabi",
];

export function LanguagesFilter() {
  const { filters, toggleLanguage } = useExploreExpertsContext();

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Languages
        </label>
        {filters.languages.length > 0 && (
          <span className="text-[10px] font-bold text-orange">
            {filters.languages.length} chosen
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {POPULAR_LANGUAGES.map((lang) => {
          const isSelected = filters.languages.includes(lang);
          return (
            <button
              key={lang}
              type="button"
              onClick={() => toggleLanguage(lang)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                isSelected
                  ? "bg-orange text-white border-orange shadow-xs font-bold"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {lang}
            </button>
          );
        })}
      </div>
    </div>
  );
}

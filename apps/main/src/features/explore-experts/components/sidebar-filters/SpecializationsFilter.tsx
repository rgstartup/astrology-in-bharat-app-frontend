"use client";

import React, { useState, useMemo } from "react";
import { Search, Check } from "lucide-react";
import { useExploreExpertsContext } from "../../context/ExploreExpertsContext";

const DEFAULT_SPECIALIZATIONS = [
  "Vedic Astrology",
  "Tarot Reading",
  "Kundli / Horoscope",
  "Numerology",
  "Vastu Shastra",
  "Palmistry",
  "Nadi Astrology",
  "Lal Kitab",
  "Prashna Kundli",
  "KP Astrology",
  "Face Reading",
  "Gemology",
];

export function SpecializationsFilter() {
  const { filters, specializationsList = [], toggleSpecialization } =
    useExploreExpertsContext();

  const [specSearch, setSpecSearch] = useState("");
  const [showAllSpecs, setShowAllSpecs] = useState(false);

  // Merge available specializations from backend or fallback
  const allSpecializations = useMemo(() => {
    if (specializationsList && specializationsList.length > 0) {
      const titles = specializationsList.map((s) => s.title);
      return Array.from(new Set([...titles, ...DEFAULT_SPECIALIZATIONS]));
    }
    return DEFAULT_SPECIALIZATIONS;
  }, [specializationsList]);

  const filteredSpecs = allSpecializations.filter((s) =>
    s.toLowerCase().includes(specSearch.toLowerCase())
  );

  const displayedSpecs = specSearch
    ? filteredSpecs
    : showAllSpecs
      ? filteredSpecs
      : filteredSpecs.slice(0, 6);

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Specializations
        </label>
        {filters.selectedSpecializations.length > 0 && (
          <span className="text-[10px] font-bold text-orange">
            {filters.selectedSpecializations.length} selected
          </span>
        )}
      </div>

      {/* Quick search inside specializations */}
      <div className="relative mb-2.5">
        <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={specSearch}
          onChange={(e) => setSpecSearch(e.target.value)}
          placeholder="Search skill (e.g. Tarot)"
          className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange font-medium"
        />
      </div>

      <div
        data-lenis-prevent="true"
        className="max-h-64 overflow-y-auto overscroll-contain space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        {displayedSpecs.map((spec) => {
          const isChecked = filters.selectedSpecializations.includes(spec);
          return (
            <div
              key={spec}
              onClick={() => toggleSpecialization(spec)}
              className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer select-none ${
                isChecked
                  ? "bg-orange/10 border-orange/40 text-orange font-bold"
                  : "bg-white border-gray-100 hover:border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`size-4 rounded-md border flex items-center justify-center transition-all ${
                    isChecked
                      ? "bg-orange border-orange text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isChecked && <Check className="size-3 stroke-[3]" />}
                </div>
                <span className="text-xs">{spec}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more / show less toggle */}
      {!specSearch && filteredSpecs.length > 6 && (
        <button
          type="button"
          onClick={() => setShowAllSpecs(!showAllSpecs)}
          className="w-full text-center py-1.5 text-xs font-bold text-orange hover:text-[#d35400] transition-colors cursor-pointer mt-1"
        >
          {showAllSpecs
            ? "▲ Show less"
            : `▼ +${filteredSpecs.length - 6} more specializations`}
        </button>
      )}
    </div>
  );
}

"use client";

import React from "react";

export interface ExpertCategory {
  id: string;
  label: string;
  subtitle: string;
  icon: string;
}

export const EXPERT_CATEGORIES: ExpertCategory[] = [
  {
    id: "vedic_astrology",
    label: "Vedic Astrology",
    subtitle: "Ancient Jyotish & planetary charts",
    icon: "fa-solid fa-star-and-crescent",
  },
  {
    id: "tarot_reading",
    label: "Tarot Card Reading",
    subtitle: "Intuitive cards for present & future",
    icon: "fa-solid fa-layer-group",
  },
  {
    id: "palm_reading",
    label: "Palm Reading (Palmistry)",
    subtitle: "Hast Rekha analysis & fate lines",
    icon: "fa-solid fa-hand",
  },
  {
    id: "numerology",
    label: "Numerology",
    subtitle: "Life path numbers & destiny vibrations",
    icon: "fa-solid fa-hashtag",
  },
  {
    id: "vastu_shastra",
    label: "Vastu Shastra",
    subtitle: "Architectural energy & home harmony",
    icon: "fa-solid fa-house-chimney-window",
  },
  {
    id: "kundli_reading",
    label: "Kundli Reading",
    subtitle: "Dasha, antardasha & planetary yogas",
    icon: "fa-solid fa-scroll",
  },
  {
    id: "prashna_kundli",
    label: "Prashna Kundli",
    subtitle: "Instant answers to pressing questions",
    icon: "fa-solid fa-compass",
  },
  {
    id: "face_reading",
    label: "Face Reading (Samudrik)",
    subtitle: "Personality & destiny through features",
    icon: "fa-regular fa-face-smile",
  },
];

interface ExpertCategorySelectorProps {
  selected: string[];
  onChange: (categories: string[]) => void;
}

export const ExpertCategorySelector: React.FC<ExpertCategorySelectorProps> = ({
  selected = [],
  onChange,
}) => {
  const toggleCategory = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((item) => item !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-[#301118]">
          Preferred Astrologer & Expert Types
        </label>
        <span className="text-xs text-gray-500 font-medium">
          Choose disciplines of interest
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EXPERT_CATEGORIES.map((cat) => {
          const isSelected = selected.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`p-3.5 rounded-2xl text-left transition-all duration-200 border flex items-start gap-3 relative ${
                isSelected
                  ? "bg-[#4A1D1F]/5 border-[#4A1D1F] shadow-sm ring-1 ring-[#4A1D1F]/20"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm transition-colors ${
                  isSelected
                    ? "bg-[#4A1D1F] text-white"
                    : "bg-[#4A1D1F]/10 text-[#4A1D1F]"
                }`}
              >
                <i className={cat.icon} />
              </div>

              <div className="flex-1 min-w-0 pr-5">
                <h6
                  className={`text-sm font-bold truncate ${
                    isSelected ? "text-[#4A1D1F]" : "text-[#301118]"
                  }`}
                >
                  {cat.label}
                </h6>
                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                  {cat.subtitle}
                </p>
              </div>

              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center absolute top-3.5 right-3.5 transition-colors ${
                  isSelected
                    ? "bg-[#4A1D1F] border-[#4A1D1F] text-white text-[10px]"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isSelected && <i className="fa-solid fa-check" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

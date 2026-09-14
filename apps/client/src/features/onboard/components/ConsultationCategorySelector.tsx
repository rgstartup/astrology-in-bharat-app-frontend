"use client";

import React from "react";

export interface ConsultationTopic {
  id: string;
  label: string;
  subtitle: string;
  icon: string;
}

export const CONSULTATION_TOPICS: ConsultationTopic[] = [
  {
    id: "love_relationships",
    label: "Love & Relationships",
    subtitle: "Compatibility, breakup & soulmates",
    icon: "fa-solid fa-heart",
  },
  {
    id: "career_job",
    label: "Career & Profession",
    subtitle: "Promotion, job change & growth",
    icon: "fa-solid fa-briefcase",
  },
  {
    id: "wealth_finance",
    label: "Money & Wealth",
    subtitle: "Investments, debts & abundance",
    icon: "fa-solid fa-sack-dollar",
  },
  {
    id: "health_wellness",
    label: "Health & Vitality",
    subtitle: "Wellness, mental peace & energy",
    icon: "fa-solid fa-notes-medical",
  },
  {
    id: "marriage_family",
    label: "Marriage & Kundli",
    subtitle: "Manglik dosha, timing & spouse",
    icon: "fa-solid fa-ring",
  },
  {
    id: "business_trade",
    label: "Business & Trade",
    subtitle: "New venture, profits & partnership",
    icon: "fa-solid fa-chart-line",
  },
  {
    id: "education_studies",
    label: "Education & Exams",
    subtitle: "Higher studies, competitive exams",
    icon: "fa-solid fa-graduation-cap",
  },
  {
    id: "remedies_spirituality",
    label: "Spiritual Remedies",
    subtitle: "Puja, gemstones, mantras & peace",
    icon: "fa-solid fa-om",
  },
];

interface ConsultationCategorySelectorProps {
  selected: string[];
  onChange: (categories: string[]) => void;
}

export const ConsultationCategorySelector: React.FC<
  ConsultationCategorySelectorProps
> = ({ selected = [], onChange }) => {
  const toggleTopic = (id: string) => {
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
          Topics You Are Seeking Guidance On
        </label>
        <span className="text-xs text-gray-500 font-medium">
          Select all that apply
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CONSULTATION_TOPICS.map((topic) => {
          const isSelected = selected.includes(topic.id);
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => toggleTopic(topic.id)}
              className={`p-3.5 rounded-2xl text-left transition-all duration-200 border flex items-start gap-3 relative ${
                isSelected
                  ? "bg-orange/10 border-orange shadow-sm ring-1 ring-orange/30"
                  : "bg-white border-gray-200 hover:border-orange/40 hover:bg-gray-50/50"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm transition-colors ${
                  isSelected
                    ? "bg-orange text-white"
                    : "bg-orange/10 text-orange"
                }`}
              >
                <i className={topic.icon} />
              </div>

              <div className="flex-1 min-w-0 pr-5">
                <h6
                  className={`text-sm font-bold truncate ${
                    isSelected ? "text-orange" : "text-[#301118]"
                  }`}
                >
                  {topic.label}
                </h6>
                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                  {topic.subtitle}
                </p>
              </div>

              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center absolute top-3.5 right-3.5 transition-colors ${
                  isSelected
                    ? "bg-orange border-orange text-white text-[10px]"
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

"use client";

import React from "react";
import {
  Heart,
  Briefcase,
  Coins,
  Activity,
  Gem,
  TrendingUp,
  GraduationCap,
  Sparkles,
  Check,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConsultationTopic {
  id: string;
  label: string;
  subtitle: string;
  icon: LucideIcon;
}

export const CONSULTATION_TOPICS: ConsultationTopic[] = [
  {
    id: "love_relationships",
    label: "Love & Relationships",
    subtitle: "Compatibility, breakup & soulmates",
    icon: Heart,
  },
  {
    id: "career_job",
    label: "Career & Profession",
    subtitle: "Promotion, job change & growth",
    icon: Briefcase,
  },
  {
    id: "wealth_finance",
    label: "Money & Wealth",
    subtitle: "Investments, debts & abundance",
    icon: Coins,
  },
  {
    id: "health_wellness",
    label: "Health & Vitality",
    subtitle: "Wellness, mental peace & energy",
    icon: Activity,
  },
  {
    id: "marriage_family",
    label: "Marriage & Kundli",
    subtitle: "Manglik dosha, timing & spouse",
    icon: Gem,
  },
  {
    id: "business_trade",
    label: "Business & Trade",
    subtitle: "New venture, profits & partnership",
    icon: TrendingUp,
  },
  {
    id: "education_studies",
    label: "Education & Exams",
    subtitle: "Higher studies, competitive exams",
    icon: GraduationCap,
  },
  {
    id: "remedies_spirituality",
    label: "Spiritual Remedies",
    subtitle: "Puja, gemstones, mantras & peace",
    icon: Sparkles,
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
        <label className="block text-sm font-bold text-foreground">
          Topics You Are Seeking Guidance On
        </label>
        <span className="text-xs text-muted-foreground font-medium">
          Select all that apply
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CONSULTATION_TOPICS.map((topic) => {
          const isSelected = selected.includes(topic.id);
          const Icon = topic.icon;

          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => toggleTopic(topic.id)}
              className={cn(
                "p-3.5 rounded-2xl text-left transition-all duration-200 border flex items-start gap-3 relative cursor-pointer outline-none",
                isSelected
                  ? "bg-orange/10 border-orange shadow-xs ring-1 ring-orange/30"
                  : "bg-white border-border hover:border-orange/40 hover:bg-gray-50/50"
              )}
            >
              <div
                className={cn(
                  "size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  isSelected
                    ? "bg-orange text-white"
                    : "bg-orange/10 text-orange"
                )}
              >
                <Icon className="size-4.5" />
              </div>

              <div className="flex-1 min-w-0 pr-5">
                <p
                  className={cn(
                    "text-sm font-bold truncate",
                    isSelected ? "text-orange" : "text-foreground"
                  )}
                >
                  {topic.label}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {topic.subtitle}
                </p>
              </div>

              <div
                className={cn(
                  "size-5 rounded-full border flex items-center justify-center absolute top-3.5 right-3.5 transition-colors",
                  isSelected
                    ? "bg-orange border-orange text-white"
                    : "border-gray-300 bg-white"
                )}
              >
                {isSelected && <Check className="size-3" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

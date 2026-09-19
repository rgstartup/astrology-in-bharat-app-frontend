"use client";

import React from "react";
import {
  MoonStar,
  Layers,
  Hand,
  Hash,
  Home,
  Scroll,
  Compass,
  Smile,
  Check,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExpertCategory {
  id: string;
  label: string;
  subtitle: string;
  icon: LucideIcon;
}

export const EXPERT_CATEGORIES: ExpertCategory[] = [
  {
    id: "vedic_astrology",
    label: "Vedic Astrology",
    subtitle: "Ancient Jyotish & planetary charts",
    icon: MoonStar,
  },
  {
    id: "tarot_reading",
    label: "Tarot Card Reading",
    subtitle: "Intuitive cards for present & future",
    icon: Layers,
  },
  {
    id: "palm_reading",
    label: "Palm Reading (Palmistry)",
    subtitle: "Hast Rekha analysis & fate lines",
    icon: Hand,
  },
  {
    id: "numerology",
    label: "Numerology",
    subtitle: "Life path numbers & destiny vibrations",
    icon: Hash,
  },
  {
    id: "vastu_shastra",
    label: "Vastu Shastra",
    subtitle: "Architectural energy & home harmony",
    icon: Home,
  },
  {
    id: "kundli_reading",
    label: "Kundli Reading",
    subtitle: "Dasha, antardasha & planetary yogas",
    icon: Scroll,
  },
  {
    id: "prashna_kundli",
    label: "Prashna Kundli",
    subtitle: "Instant answers to pressing questions",
    icon: Compass,
  },
  {
    id: "face_reading",
    label: "Face Reading (Samudrik)",
    subtitle: "Personality & destiny through features",
    icon: Smile,
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
        <label className="block text-sm font-bold text-foreground">
          Preferred Astrologer & Expert Types
        </label>
        <span className="text-xs text-muted-foreground font-medium">
          Choose disciplines of interest
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EXPERT_CATEGORIES.map((cat) => {
          const isSelected = selected.includes(cat.id);
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
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
                  {cat.label}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {cat.subtitle}
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

"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const AVAILABLE_LANGUAGES = [
  { id: "English", label: "English", native: "English" },
  { id: "Hindi", label: "Hindi", native: "हिन्दी" },
  { id: "Bengali", label: "Bengali", native: "বাংলা" },
  { id: "Marathi", label: "Marathi", native: "मराठी" },
  { id: "Telugu", label: "Telugu", native: "తెలుగు" },
  { id: "Tamil", label: "Tamil", native: "தமிழ்" },
  { id: "Gujarati", label: "Gujarati", native: "ગુજરાતી" },
  { id: "Kannada", label: "Kannada", native: "ಕನ್ನಡ" },
  { id: "Punjabi", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { id: "Malayalam", label: "Malayalam", native: "മലയാളം" },
];

interface LanguageSelectorProps {
  selected: string[];
  onChange: (languages: string[]) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selected = [],
  onChange,
}) => {
  const toggleLanguage = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((lang) => lang !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-foreground">
          Preferred Consultation Languages{" "}
          <span className="text-orange">*</span>
        </label>
        <span className="text-xs text-muted-foreground font-medium">
          Select one or more
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {AVAILABLE_LANGUAGES.map((lang) => {
          const isSelected = selected.includes(lang.id);
          return (
            <button
              key={lang.id}
              type="button"
              onClick={() => toggleLanguage(lang.id)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 border cursor-pointer outline-none",
                isSelected
                  ? "bg-orange text-white border-orange shadow-xs shadow-orange/30 scale-[1.02]"
                  : "bg-white text-foreground border-border hover:border-orange/50 hover:bg-orange/5"
              )}
            >
              <span>{lang.native}</span>
              {lang.id !== lang.native && (
                <span
                  className={cn(
                    "text-xs",
                    isSelected ? "text-white/80" : "text-muted-foreground"
                  )}
                >
                  ({lang.label})
                </span>
              )}
              {isSelected && <Check className="size-3.5 ml-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

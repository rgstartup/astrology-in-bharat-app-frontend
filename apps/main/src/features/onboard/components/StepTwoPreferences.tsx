"use client";

import React from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { OnboardingFormData } from "@/lib/types";
import { LanguageSelector } from "./LanguageSelector";
import { ConsultationCategorySelector } from "./ConsultationCategorySelector";
import { ExpertCategorySelector } from "./ExpertCategorySelector";
import { Link } from "@/i18n/navigation";

interface StepTwoPreferencesProps {
  setValue: UseFormSetValue<OnboardingFormData>;
  watch: UseFormWatch<OnboardingFormData>;
  onBack: () => void;
  isSubmitting: boolean;
}

export const StepTwoPreferences: React.FC<StepTwoPreferencesProps> = ({
  setValue,
  watch,
  onBack,
  isSubmitting,
}) => {
  const currentLanguages = watch("languages") || [];
  const currentConsultationTopics = watch("consultation_categories") || [];
  const currentExpertCategories = watch("expert_categories") || [];

  return (
    <div className="space-y-6">
      {/* 1. Language Preferences */}
      <LanguageSelector
        selected={currentLanguages}
        onChange={(languages) =>
          setValue("languages", languages, { shouldDirty: true })
        }
      />

      {/* 2. Consultation Categories */}
      <ConsultationCategorySelector
        selected={currentConsultationTopics}
        onChange={(categories) =>
          setValue("consultation_categories", categories, { shouldDirty: true })
        }
      />

      {/* 3. Expert Disciplines */}
      <ExpertCategorySelector
        selected={currentExpertCategories}
        onChange={(categories) =>
          setValue("expert_categories", categories, { shouldDirty: true })
        }
      />

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-xs" />
            <span>Back</span>
          </button>

          <Link
            href="/client/profile"
            className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
          >
            Skip for now
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-orange hover:bg-[#d64e1c] text-white text-sm font-bold shadow-md shadow-orange/25 flex items-center justify-center gap-2 transition-all hover:translate-y-[-1px] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>Completing Profile...</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-sparkles text-xs" />
              <span>Complete Profile & Begin</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

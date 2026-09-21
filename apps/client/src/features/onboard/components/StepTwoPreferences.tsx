"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { OnboardingFormData } from "@/lib/types";
import { LanguageSelector } from "./LanguageSelector";
import { ConsultationCategorySelector } from "./ConsultationCategorySelector";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepTwoPreferencesProps {
  onBack: () => void;
  onNext?: () => void;
}

export const StepTwoPreferences: React.FC<StepTwoPreferencesProps> = ({
  onBack,
  onNext,
}) => {
  const { control } = useFormContext<OnboardingFormData>();

  return (
    <div className="space-y-6">
      {/* 1. Language Preferences */}
      <FormField
        control={control}
        name="preferences.languages"
        rules={{
          validate: (value) =>
            (value && value.length > 0) ||
            "Please select at least one preferred language",
        }}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <LanguageSelector
                selected={field.value || []}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage className="text-xs text-destructive mt-1 leading-tight" />
          </FormItem>
        )}
      />

      {/* 2. Consultation Categories */}
      <FormField
        control={control}
        name="preferences.topics"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ConsultationCategorySelector
                selected={field.value || []}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage className="text-xs text-destructive mt-1 leading-tight" />
          </FormItem>
        )}
      />

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-4 sm:px-5 h-10 rounded-full border-stone-200/90 hover:border-stone-300 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="size-4" />
            <span>Back</span>
          </Button>

          <Link
            href={PATHS.DASHBOARD.ROOT}
            className="text-xs sm:text-sm font-medium text-stone-500 hover:text-stone-800 underline decoration-stone-300 hover:decoration-stone-600 underline-offset-4 transition-colors"
          >
            Skip
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full sm:w-auto px-6 sm:px-7 h-11 rounded-full bg-orange hover:bg-orange/90 text-white text-sm font-semibold shadow-md shadow-orange/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Continue to Specialization</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};

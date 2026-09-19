"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { OnboardingFormData } from "@/lib/types";
import { LanguageSelector } from "./LanguageSelector";
import { ConsultationCategorySelector } from "./ConsultationCategorySelector";
import { ExpertCategorySelector } from "./ExpertCategorySelector";
import { Link } from "@/i18n/navigation";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";

interface StepTwoPreferencesProps {
  onBack: () => void;
  isSubmitting: boolean;
}

export const StepTwoPreferences: React.FC<StepTwoPreferencesProps> = ({
  onBack,
  isSubmitting,
}) => {
  const { control } = useFormContext<OnboardingFormData>();

  return (
    <div className="space-y-6">
      {/* 1. Language Preferences */}
      <FormField
        control={control}
        name="languages"
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
            <FormMessage />
          </FormItem>
        )}
      />

      {/* 2. Consultation Categories */}
      <FormField
        control={control}
        name="consultation_categories"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ConsultationCategorySelector
                selected={field.value || []}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* 3. Expert Disciplines */}
      <FormField
        control={control}
        name="expert_categories"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ExpertCategorySelector
                selected={field.value || []}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-4 py-2.5 h-10 rounded-xl border-border text-foreground hover:bg-muted text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Back</span>
          </Button>

          <Link
            href="/client/profile"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-7 py-2.5 h-11 rounded-xl bg-orange hover:bg-orange/90 text-white text-sm font-bold shadow-md shadow-orange/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Completing Profile...</span>
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              <span>Complete Profile & Begin</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { toast } from "@/hooks/use-toast";
import { PATHS } from "@repo/routes";
import { OnboardingFormData } from "@/lib/types";
import { useOnboardStore } from "@/store/useOnboardStore";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { StepTwoPreferences } from "@/features/onboard/components/StepTwoPreferences";
import { OnboardingStepTransition } from "@/features/onboard/components/OnboardingStepTransition";

export default function OnboardingPreferencePage() {
  const router = useRouter();
  const formData = useOnboardStore((s) => s.formData);
  const setFormData = useOnboardStore((s) => s.setFormData);
  const setStep = useOnboardStore((s) => s.setStep);

  const form = useForm<OnboardingFormData>({
    defaultValues: {
      ...formData,
      preferences: {
        languages: formData.preferences?.languages || ["English", "Hindi"],
        topics: formData.preferences?.topics || [],
        specializations: formData.preferences?.specializations || [],
      },
    },
    mode: "onBlur",
  });

  const { trigger, getValues } = form;

  const handleBack = () => {
    const currentValues = getValues();
    setFormData(currentValues);
    setStep(1, "backward");
    router.push(PATHS.ONBOARDING.PROFILE);
  };

  const handleNext = async () => {
    const isValid = await trigger("preferences.languages");
    if (!isValid) {
      toast.error("Please select at least one language to continue.");
      return;
    }

    const currentValues = getValues();
    setFormData(currentValues);
    setStep(3, "forward");
    router.push(PATHS.ONBOARDING.SPECIALIZATION);
  };

  return (
    <OnboardingStepTransition>
      {/* Header Info */}
      <div className="mb-6 sm:mb-8 space-y-1.5">
        <Badge
          variant="secondary"
          className="px-2.5 py-0.5 text-xs font-semibold text-muted-foreground bg-muted w-fit mb-1"
        >
          Step 2 of 3
        </Badge>

        <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight leading-snug">
          Consultation Preferences
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Choose your preferred languages and the topics you are seeking
          astrological guidance on.
        </p>
      </div>

      {/* Shadcn Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleNext)} className="flex-1">
          <StepTwoPreferences onBack={handleBack} onNext={handleNext} />
        </form>
      </Form>
    </OnboardingStepTransition>
  );
}

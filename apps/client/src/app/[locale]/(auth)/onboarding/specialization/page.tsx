"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { toast } from "@/hooks/use-toast";
import { PATHS } from "@repo/routes";
import { OnboardingFormData } from "@/lib/types";
import { saveOnboardingAction } from "@/actions/onboard";
import { useAuth } from "@/store/useAuthStore";
import { useOnboardStore } from "@/store/useOnboardStore";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { StepThreeSpecialization } from "@/features/onboard/components/StepThreeSpecialization";
import { OnboardingStepTransition } from "@/features/onboard/components/OnboardingStepTransition";

export default function OnboardingSpecializationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const formData = useOnboardStore((s) => s.formData);
  const setFormData = useOnboardStore((s) => s.setFormData);
  const setStep = useOnboardStore((s) => s.setStep);
  const resetOnboard = useOnboardStore((s) => s.resetOnboard);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const { getValues } = form;

  const handleBack = () => {
    const currentValues = getValues();
    setFormData(currentValues);
    setStep(2, "backward");
    router.push(PATHS.ONBOARDING.PREFERENCE);
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    try {
      const mergedData: OnboardingFormData = {
        ...formData,
        ...data,
        preferences: {
          ...(formData.preferences || {}),
          ...(data.preferences || {}),
        },
      };
      setFormData(mergedData);

      const payload: OnboardingFormData = {
        ...mergedData,
        avatar: mergedData.avatar || user?.avatar || "",
      };

      const result = await saveOnboardingAction(payload);

      if (result.error) {
        toast.error(result.error);
      } else {
        resetOnboard();
        window.location.href = PATHS.DASHBOARD.ROOT;
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingStepTransition>
      {/* Header Info */}
      <div className="mb-6 sm:mb-8 space-y-1.5">
        <Badge
          variant="secondary"
          className="px-2.5 py-0.5 text-xs font-semibold text-muted-foreground bg-muted w-fit mb-1"
        >
          Step 3 of 3
        </Badge>

        <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight leading-snug">
          Expert Specialization
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Select the astrological disciplines and expert types you are most
          interested in consulting.
        </p>
      </div>

      {/* Shadcn Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
          <StepThreeSpecialization
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        </form>
      </Form>
    </OnboardingStepTransition>
  );
}

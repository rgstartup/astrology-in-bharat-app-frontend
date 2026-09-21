"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { toast } from "@/hooks/use-toast";
import { PATHS } from "@repo/routes";
import { OnboardingFormData } from "@/lib/types";
import { useAuth } from "@/store/useAuthStore";
import { useOnboardStore } from "@/store/useOnboardStore";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { StepOnePersonalDetails } from "@/features/onboard/components/StepOnePersonalDetails";
import { OnboardingStepTransition } from "@/features/onboard/components/OnboardingStepTransition";

export default function OnboardingProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const formData = useOnboardStore((s) => s.formData);
  const setFormData = useOnboardStore((s) => s.setFormData);
  const setStep = useOnboardStore((s) => s.setStep);

  const defaultFirstName =
    formData.first_name ||
    user?.first_name ||
    (user?.name ? user.name.trim().split(" ")[0] : "") ||
    "";
  const defaultLastName =
    formData.last_name !== undefined && formData.last_name !== null
      ? formData.last_name
      : user?.last_name !== undefined && user?.last_name !== null
        ? user.last_name
        : user?.name && user.name.trim().split(" ").length > 1
          ? user.name.trim().split(" ").slice(1).join(" ")
          : "";

  const form = useForm<OnboardingFormData>({
    defaultValues: {
      first_name: defaultFirstName,
      last_name: defaultLastName,
      date_of_birth: formData.date_of_birth || "",
      time_of_birth: formData.time_of_birth || "",
      gender: formData.gender || user?.gender || "male",
      place_of_birth: formData.place_of_birth || "",
      avatar: formData.avatar || user?.avatar || "",
      address: {
        line1: formData.address?.line1 || "",
        city: formData.address?.city || "",
        state: formData.address?.state || "",
        pincode: formData.address?.pincode || "",
      },
      preferences: {
        languages: formData.preferences?.languages || ["English", "Hindi"],
        topics: formData.preferences?.topics || [],
        specializations: formData.preferences?.specializations || [],
      },
    },
    mode: "onBlur",
  });

  const { setValue, watch, trigger, getValues } = form;

  // Sync auth profile into form fields when user loads
  useEffect(() => {
    if (user) {
      if (user.first_name && !watch("first_name")) {
        setValue("first_name", user.first_name);
      } else if (user.name && !watch("first_name")) {
        const parts = user.name.trim().split(" ");
        setValue("first_name", parts[0] || "");
      }

      if (
        user.last_name !== undefined &&
        user.last_name !== null &&
        !watch("last_name")
      ) {
        setValue("last_name", user.last_name);
      } else if (user.name && !watch("last_name")) {
        const parts = user.name.trim().split(" ");
        if (parts.length > 1) {
          setValue("last_name", parts.slice(1).join(" "));
        }
      }

      if (user.gender && !watch("gender")) {
        setValue("gender", user.gender);
      }
      if (user.avatar && !watch("avatar")) {
        setValue("avatar", user.avatar, { shouldDirty: true });
      }
    }
  }, [user, setValue, watch]);

  const handleNext = async () => {
    const isValid = await trigger(["first_name", "date_of_birth", "gender"]);
    if (!isValid) {
      toast.error("Please fill in the required details to continue.");
      return;
    }

    const currentValues = getValues();
    setFormData(currentValues);
    setStep(2, "forward");
    router.push(PATHS.ONBOARDING.PREFERENCE);
  };

  return (
    <OnboardingStepTransition>
      {/* Header Info */}
      <div className="mb-6 sm:mb-8 space-y-1.5">
        <Badge
          variant="secondary"
          className="px-2.5 py-0.5 text-xs font-semibold text-muted-foreground bg-muted w-fit mb-1"
        >
          Step 1 of 3
        </Badge>

        <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight leading-snug">
          Personal & Birth Details
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Provide your birth details and contact info for accurate Kundli charts
          and predictions.
        </p>
      </div>

      {/* Shadcn Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleNext)} className="flex-1">
          <StepOnePersonalDetails onNext={handleNext} />
        </form>
      </Form>
    </OnboardingStepTransition>
  );
}

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { PATHS } from "@repo/routes";
import { OnboardingFormData } from "@/lib/types";
import { saveOnboardingAction } from "@/actions/onboard";
import { OnboardHero } from "./components/OnboardHero";
import { StepOnePersonalDetails } from "./components/StepOnePersonalDetails";
import { StepTwoPreferences } from "./components/StepTwoPreferences";
import { StepThreeSpecialization } from "./components/StepThreeSpecialization";
import { useAuth } from "@/store/useAuthStore";
import { useOnboardStore } from "@/store/useOnboardStore";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OnboardingStepTransition } from "./components/OnboardingStepTransition";

export const OnboardContainer = () => {
  const {
    step,
    setStep,
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    resetOnboard,
  } = useOnboardStore();

  const { user } = useAuth();

  const defaultFirstName = formData.first_name || user?.first_name;
  const defaultLastName = formData.last_name || user?.last_name;

  const form = useForm<OnboardingFormData>({
    defaultValues: {
      first_name: defaultFirstName,
      last_name: defaultLastName,
      date_of_birth: formData.date_of_birth || "",
      time_of_birth: formData.time_of_birth || "",
      gender: formData.gender || "male",
      place_of_birth: formData.place_of_birth || "",
      avatar: formData.avatar || "",
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

  const { setValue, watch, trigger, handleSubmit, getValues } = form;
  const formAvatar = watch("avatar", user?.avatar || formData.avatar);

  // Keep form fields synchronized when user auth profile loads or updates
  React.useEffect(() => {
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

  const handleStepOneNext = async () => {
    const isValid = await trigger(["first_name", "date_of_birth", "gender"]);
    if (!isValid) {
      toast.error("Please fill in the required details to continue.");
      return;
    }
    setFormData(getValues());
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepTwoNext = async () => {
    const isValid = await trigger("preferences.languages");
    if (!isValid) {
      toast.error("Please select at least one language to continue.");
      return;
    }
    setFormData(getValues());
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepTwoBack = () => {
    setFormData(getValues());
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepThreeBack = () => {
    setFormData(getValues());
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    try {
      const mergedData = {
        ...formData,
        ...data,
      };
      setFormData(mergedData);

      const payload: OnboardingFormData = {
        ...mergedData,
        avatar: data.avatar || formAvatar || user?.avatar || "",
      };
      const result = await saveOnboardingAction(payload);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          result.message || "Profile completed successfully! Welcome aboard.",
        );
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
    <div className="w-full max-w-[1160px] mx-auto px-4 md:px-8 py-6 md:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Section: Welcome Message & Step Timeline (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-4 lg:sticky lg:top-8 flex-col justify-between py-2 lg:py-4 lg:pr-2 xl:pr-4">
          <OnboardHero currentStep={step} />
        </div>

        {/* Right Section: Multi-Step Form */}
        <Card className="lg:col-span-8 bg-transparent sm:bg-white rounded-none sm:rounded-3xl p-0 sm:p-8 md:p-10 border-0 sm:border sm:border-border/80 shadow-none sm:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] flex flex-col">
          <CardContent className="p-0 flex flex-col flex-1">
            <OnboardingStepTransition key={step}>
              {/* Step Detail, Primary Title, and Description */}
              <div className="mb-6 sm:mb-8 space-y-1.5">
                <Badge
                  variant="secondary"
                  className="px-2.5 py-0.5 text-xs font-semibold text-muted-foreground bg-muted w-fit mb-1"
                >
                  Step {step} of 3
                </Badge>

                <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight leading-snug">
                  {step === 1
                    ? "Personal & Birth Details"
                    : step === 2
                      ? "Consultation Preferences"
                      : "Expert Specialization"}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {step === 1
                    ? "Provide your birth details and contact info for accurate Kundli charts and predictions."
                    : step === 2
                      ? "Choose your preferred languages and the topics you are seeking guidance on."
                      : "Select the astrological disciplines and expert types you are most interested in."}
                </p>
              </div>

              {/* Form */}
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
                  {step === 1 ? (
                    <StepOnePersonalDetails onNext={handleStepOneNext} />
                  ) : step === 2 ? (
                    <StepTwoPreferences
                      onBack={handleStepTwoBack}
                      onNext={handleStepTwoNext}
                    />
                  ) : (
                    <StepThreeSpecialization
                      onBack={handleStepThreeBack}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </form>
              </Form>
            </OnboardingStepTransition>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

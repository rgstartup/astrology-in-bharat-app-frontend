"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { OnboardingFormData } from "@/lib/types";
import { saveOnboardingAction } from "@/actions/onboard";
import { OnboardHero } from "./components/OnboardHero";
import { OnboardStepper } from "./components/OnboardStepper";
import { StepOnePersonalDetails } from "./components/StepOnePersonalDetails";
import { StepTwoPreferences } from "./components/StepTwoPreferences";
import { useAuth } from "@/store/useAuthStore";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

export const OnboardContainer = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();

  const defaultFirstName =
    user?.first_name ||
    (user?.name ? user.name.trim().split(" ")[0] : "") ||
    "";
  const defaultLastName =
    user?.last_name !== undefined && user?.last_name !== null
      ? user.last_name
      : user?.name && user.name.trim().split(" ").length > 1
        ? user.name.trim().split(" ").slice(1).join(" ")
        : "";

  const form = useForm<OnboardingFormData>({
    defaultValues: {
      first_name: defaultFirstName,
      last_name: defaultLastName,
      date_of_birth: "",
      time_of_birth: "",
      gender: user?.gender || "male",
      place_of_birth: "",
      avatar: user?.avatar || "",
      address: {
        line1: "",
        city: "",
        state: "",
        pincode: "",
      },
      languages: ["English", "Hindi"],
      consultation_categories: ["love_relationships", "career_job"],
      expert_categories: ["vedic_astrology"],
    },
    mode: "onBlur",
  });

  const { setValue, watch, trigger, handleSubmit } = form;
  const formAvatar = watch("avatar", user?.avatar);

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

  const handleNext = async () => {
    // Validate step 1 required fields
    const isValid = await trigger(["first_name", "date_of_birth", "gender"]);
    if (!isValid) {
      toast.error("Please fill in the required details to continue.");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    try {
      const payload: OnboardingFormData = {
        ...data,
        avatar: data.avatar || formAvatar || user?.avatar || "",
      };
      const result = await saveOnboardingAction(payload);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          result.message || "Profile completed successfully! Welcome aboard.",
        );
        // Refresh and navigate to client profile
        window.location.href = "/client/profile";
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        {/* Left Section: Welcome Message & Astrology Quote */}
        <div className="lg:col-span-5 bg-[#FFF9F4] rounded-3xl p-6 sm:p-8 md:p-10 border border-orange/15 shadow-xs flex flex-col justify-between">
          <OnboardHero />
        </div>

        {/* Right Section: Multi-Step Form */}
        <Card className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-100 shadow-[0_10px_50px_rgba(0,0,0,0.06)] flex flex-col">
          <CardContent className="p-0 flex flex-col flex-1">
            {/* Header Title */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                {step === 1
                  ? "Complete Your Profile"
                  : "Your Astrological Preferences"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
                {step === 1
                  ? "Provide your birth details for accurate Kundli charts and predictions."
                  : "Choose your languages, consultation topics, and expert specializations."}
              </p>
            </div>

            {/* Stepper Indicator */}
            <OnboardStepper
              currentStep={step}
              onStepClick={(targetStep) => {
                if (targetStep === 1) setStep(1);
                if (targetStep === 2) handleNext();
              }}
            />

            {/* Form */}
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
                {step === 1 ? (
                  <StepOnePersonalDetails onNext={handleNext} />
                ) : (
                  <StepTwoPreferences
                    onBack={() => setStep(1)}
                    isSubmitting={isSubmitting}
                  />
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

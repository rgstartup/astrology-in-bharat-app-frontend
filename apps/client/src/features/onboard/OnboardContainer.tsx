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

export const OnboardContainer = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    defaultValues: {
      full_name: user?.name || "",
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

  const formAvatar = watch("avatar", user?.avatar);

  // Keep form fields synchronized when user auth profile loads or updates
  React.useEffect(() => {
    if (user) {
      if (user.name && !watch("full_name")) {
        setValue("full_name", user.name);
      }
      if (user.gender && !watch("gender")) {
        setValue("gender", user.gender);
      }
      if (user.avatar && !watch("avatar")) {
        setValue("avatar", user.avatar, { shouldDirty: true });
      }
    }
  }, [user, setValue, watch]);

  console.log({ userAvatar: user?.avatar, formAvatar });

  const handleNext = async () => {
    // Validate step 1 required fields
    const isValid = await trigger(["date_of_birth", "gender"]);
    if (!isValid) {
      toast.error("Please fill in the required birth details to continue.");
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
        <div className="lg:col-span-5 bg-[#FFF9F4] rounded-3xl p-6 sm:p-8 md:p-10 border border-orange/15 shadow-sm flex flex-col justify-between">
          <OnboardHero />
        </div>

        {/* Right Section: Multi-Step Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-100 shadow-[0_10px_50px_rgba(0,0,0,0.06)] flex flex-col">
          {/* Header Title */}
          <div className="mb-6">
            <span className="text-xs font-bold text-orange uppercase tracking-wider block mb-1">
              Step {step} of 2
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#301118]">
              {step === 1
                ? "Complete Your Profile"
                : "Your Astrological Preferences"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
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
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
            {step === 1 ? (
              <StepOnePersonalDetails
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                onNext={handleNext}
              />
            ) : (
              <StepTwoPreferences
                setValue={setValue}
                watch={watch}
                onBack={() => setStep(1)}
                isSubmitting={isSubmitting}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

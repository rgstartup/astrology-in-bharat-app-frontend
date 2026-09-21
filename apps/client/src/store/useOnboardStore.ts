import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { OnboardingFormData, OnboardingAddress } from "@/lib/types/onboard";

export const INITIAL_ONBOARDING_DATA: OnboardingFormData = {
  first_name: "",
  last_name: "",
  date_of_birth: "",
  time_of_birth: "",
  gender: "male",
  place_of_birth: "",
  avatar: "",
  address: {
    line1: "",
    city: "",
    state: "",
    pincode: "",
  },
  preferences: {
    languages: ["English", "Hindi"],
    topics: [],
    specializations: [],
  },
};

export interface OnboardState {
  step: 1 | 2 | 3;
  direction: "forward" | "backward";
  formData: OnboardingFormData;
  isSubmitting: boolean;

  // Actions
  setStep: (step: 1 | 2 | 3, direction?: "forward" | "backward") => void;
  nextStep: () => void;
  prevStep: () => void;
  setFormData: (data: Partial<OnboardingFormData>) => void;
  updateField: <K extends keyof OnboardingFormData>(
    field: K,
    value: OnboardingFormData[K],
  ) => void;
  updateAddress: (address: Partial<OnboardingAddress>) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  resetOnboard: () => void;
}

export const useOnboardStore = create<OnboardState>()(
  persist(
    (set) => ({
      step: 1,
      direction: "forward",
      formData: INITIAL_ONBOARDING_DATA,
      isSubmitting: false,

      setStep: (step, direction) =>
        set((state) => ({
          step,
          direction:
            direction || (step >= state.step ? "forward" : "backward"),
        })),
      nextStep: () =>
        set((state) => ({
          step: Math.min(state.step + 1, 3) as 1 | 2 | 3,
          direction: "forward",
        })),
      prevStep: () =>
        set((state) => ({
          step: Math.max(state.step - 1, 1) as 1 | 2 | 3,
          direction: "backward",
        })),
      setFormData: (data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            ...data,
            address: {
              ...(state.formData.address || {}),
              ...(data.address || {}),
            },
            preferences: {
              ...(state.formData.preferences || {}),
              ...(data.preferences || {}),
            },
          },
        })),
      updateField: (field, value) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [field]: value,
          },
        })),
      updateAddress: (address) =>
        set((state) => ({
          formData: {
            ...state.formData,
            address: {
              ...(state.formData.address || {}),
              ...address,
            },
          },
        })),
      setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
      resetOnboard: () =>
        set({
          step: 1,
          direction: "forward",
          formData: INITIAL_ONBOARDING_DATA,
          isSubmitting: false,
        }),
    }),
    {
      name: "aib-onboard-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

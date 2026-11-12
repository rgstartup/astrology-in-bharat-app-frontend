"use client";

import { create } from "zustand";
import type { OnboardingStatus } from "../types";
import type {
  ExpertAccount,
  ProfessionItem,
  SpecializationItem,
} from "@repo/lib/contracts/expert/account-api";

export interface OnboardingWizardStore {
  // Server-fetched state
  status: OnboardingStatus | null;
  account: ExpertAccount | null;
  loading: boolean;
  error: unknown | null;

  // Wizard step
  step: number;
  submitting: boolean;
  skipping: boolean;

  // Step 0: Professions
  professions: ProfessionItem[];
  selectedProfessions: number[];

  // Step 1: Specializations
  specializations: SpecializationItem[];
  selectedSpecializations: number[];

  // Step 2: Profile
  fullName: string;
  phone: string;
  aboutMe: string;
  avatarUrl: string | null;

  // Actions — server data
  setStatus: (status: OnboardingStatus | null) => void;
  setAccount: (account: ExpertAccount | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: unknown | null) => void;

  // Actions — wizard navigation
  setStep: (step: number) => void;
  setSubmitting: (submitting: boolean) => void;
  setSkipping: (skipping: boolean) => void;

  // Actions — step 0
  setProfessions: (professions: ProfessionItem[]) => void;
  toggleProfession: (id: number) => void;

  // Actions — step 1
  setSpecializations: (specializations: SpecializationItem[]) => void;
  toggleSpecialization: (id: number) => void;

  // Actions — step 2
  setFullName: (value: string) => void;
  setPhone: (value: string) => void;
  setAboutMe: (value: string) => void;
  setAvatarUrl: (url: string | null) => void;

  // Lifecycle
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingWizardStore>((set) => ({
  // Server-fetched state
  status: null,
  account: null,
  loading: true,
  error: null,

  // Wizard step
  step: 0,
  submitting: false,
  skipping: false,

  // Step 0: Professions
  professions: [],
  selectedProfessions: [],

  // Step 1: Specializations
  specializations: [],
  selectedSpecializations: [],

  // Step 2: Profile
  fullName: "",
  phone: "",
  aboutMe: "",
  avatarUrl: null,

  // Actions — server data
  setStatus: (status) => set({ status }),
  setAccount: (account) => set({ account }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Actions — wizard navigation
  setStep: (step) => set({ step }),
  setSubmitting: (submitting) => set({ submitting }),
  setSkipping: (skipping) => set({ skipping }),

  // Actions — step 0
  setProfessions: (professions) => set({ professions }),
  toggleProfession: (id) =>
    set((state) => ({
      selectedProfessions: state.selectedProfessions.includes(id)
        ? state.selectedProfessions.filter((p) => p !== id)
        : [...state.selectedProfessions, id],
    })),

  // Actions — step 1
  setSpecializations: (specializations) => set({ specializations }),
  toggleSpecialization: (id) =>
    set((state) => ({
      selectedSpecializations: state.selectedSpecializations.includes(id)
        ? state.selectedSpecializations.filter((sid) => sid !== id)
        : [...state.selectedSpecializations, id],
    })),

  // Actions — step 2
  setFullName: (fullName) => set({ fullName }),
  setPhone: (phone) => set({ phone }),
  setAboutMe: (aboutMe) => set({ aboutMe }),
  setAvatarUrl: (avatarUrl) => set({ avatarUrl }),

  // Lifecycle
  reset: () =>
    set({
      status: null,
      account: null,
      loading: true,
      error: null,
      step: 0,
      submitting: false,
      skipping: false,
      professions: [],
      selectedProfessions: [],
      specializations: [],
      selectedSpecializations: [],
      fullName: "",
      phone: "",
      aboutMe: "",
      avatarUrl: null,
    }),
}));

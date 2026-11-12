export interface OnboardingStatus {
  onboarding_completed: boolean;
  onboarding_completed_at: string | null;
  steps: {
    professions: boolean;
    specializations: boolean;
    profile_photo: boolean;
  };
  bank_linked: boolean;
}

export interface Profession {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Specialization {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
}

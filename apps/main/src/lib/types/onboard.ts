export interface OnboardingAddress {
  line1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface OnboardingFormData {
  avatar?: string;
  full_name?: string;
  date_of_birth?: string;
  time_of_birth?: string;
  gender?: "male" | "female" | "other";
  place_of_birth?: string;
  address?: OnboardingAddress;
  languages?: string[];
  consultation_categories?: string[];
  expert_categories?: string[];
}

export interface OnboardingActionResponse {
  success?: boolean;
  error?: string;
  message?: string;
  avatar?: string;
}

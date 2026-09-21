import type { ClientPreferences } from "./user";

export interface OnboardingAddress {
  line1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface OnboardingFormData {
  avatar?: string;
  first_name?: string;
  last_name?: string | null;
  full_name?: string;
  date_of_birth?: string;
  time_of_birth?: string;
  gender?: string;
  place_of_birth?: string;
  address?: OnboardingAddress;
  preferences?: ClientPreferences;
}

export interface OnboardingActionResponse {
  success?: boolean;
  error?: string;
  message?: string;
  avatar?: string;
}

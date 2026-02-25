export interface Expert {
  id: number;
  name: string;
  email: string;

  // Auth / Verification fields (both formats for compatibility)
  emailVerified?: boolean;
  email_verified_at?: string | Date | null;
  createdAt?: string;
  created_at?: string;
  updated_at?: string;

  avatar?: string;
  phone_number?: string;
  is_blocked?: boolean;

  // Flat profile fields (from new flattened API)
  bio?: string;
  intro_video_url?: string;
  gallery?: string[];
  documents?: {
    type: string;
    url: string;
    title?: string;
    status?: string;
    category?: string;
    side?: string;
  }[];
  experience_in_years?: number;
  specialization?: string;
  rating?: number;
  consultation_count?: number;
  total_likes?: number;
  total_reviews?: number;
  kyc_status?: string;
  rejection_reason?: string | null;
  languages?: string;
  gender?: string;
  date_of_birth?: string | Date | null;
  is_available?: boolean;

  // Pricing fields
  price?: number;
  chat_price?: number;
  call_price?: number;
  video_call_price?: number;

  // Addresses
  addresses?: {
    id?: number;
    house_no?: string;
    line1?: string;
    city?: string;
    district?: string;
    state?: string;
    country?: string;
    pincode?: string;
    tag?: string;
  }[];

  // Nested profile (backward compatibility with old API shape)
  profile_expert?: {
    id?: number;
    specialization?: string;
    experience_in_years?: number;
    rating?: number;
    consultation_count?: number;
    total_earnings?: number;
    bio?: string;
    intro_video_url?: string;
    gallery?: string[];
    phone_number?: string;
    price?: number;
    chat_price?: number;
    call_price?: number;
    video_call_price?: number;
    documents?: {
      type: string;
      url: string;
      title?: string;
      status?: string;
      category?: string;
      side?: string;
    }[];
    addresses?: {
      city?: string;
      state?: string;
      country?: string;
    }[];
    languages?: string[];
    kycStatus?: "Verified" | "Pending" | "Rejected";
    kyc_status?: string;
  };

  // UI-only fields
  status?: string;
  totalConsultations?: number;
  joinDate?: string;
  lastActive?: string;
  certificates?: string[];
}

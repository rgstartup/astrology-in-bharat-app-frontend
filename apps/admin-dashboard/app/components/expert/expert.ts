export interface Expert {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | Date | null;
  created_at: string;
  updated_at: string;
  avatar?: string;
  phone_number?: string;
  is_blocked: boolean;

  // Detailed Profile data from the new API
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

  // Addresses
  addresses?: {
    id: number;
    house_no?: string;
    line1?: string;
    city?: string;
    district?: string;
    state?: string;
    country?: string;
    pincode?: string;
    tag?: string;
  }[];

  // Nested Structure support (Backward compatibility)
  profile_expert?: {
    id: number;
    specialization?: string;
    experience_in_years?: number;
    rating?: number;
    consultation_count?: number;
    bio?: string;
    intro_video_url?: string;
    gallery?: string[];
    documents?: any[];
    addresses?: any[];
    languages?: string;
    kyc_status?: "pending" | "approved" | "rejected";
    rejection_reason?: string | null;
    phone_number?: string;
    price?: number;
    chat_price?: number;
    call_price?: number;
    video_call_price?: number;
    bank_details?: string;
  };

  // UI specific fields
  joinDate?: string;
  lastActive?: string;
  certificates?: string[];
}





export interface Expert {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  avatar?: string;
  phone?: string;
  status?: string;

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
  experience?: number;
  specialization?: string;
  rating?: number;
  consultationCount?: number;
  totalConsultations?: number;
  totalEarnings?: number;
  kycStatus?: string;
  languages?: string[];
  city?: string;
  state?: string;
  gender?: string;
  dob?: string;
  house_no?: string;
  district?: string;
  country?: string;
  pincode?: string;
  addresses?: {
    id: number;
    line1?: string;
    houseNo?: string;
    city?: string;
    district?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    pincode?: string;
    tag?: string;
  }[];
  kyc_details?: {
    status: string;
  };

  // Nested Structure support (Backward compatibility)
  profile_expert?: {
    id: number;
    specialization?: string;
    experience?: number;
    rating?: number;
    totalConsultations?: number;
    totalEarnings?: number;
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
    addresses?: {
      city?: string;
      state?: string;
      country?: string;
    }[];
    languages?: string[];
    kycStatus?: "Verified" | "Pending" | "Rejected";
  };

  // UI specific fields
  joinDate?: string;
  lastActive?: string;
  certificates?: string[];
}





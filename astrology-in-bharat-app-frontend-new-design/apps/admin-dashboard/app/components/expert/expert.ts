export interface Expert {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  avatar?: string;

  // Profile data
  profile_expert?: {
    id: number;
    specialization?: string;
    experience?: number;
    rating?: number;
    totalConsultations?: number;
    totalEarnings?: number;
    addresses?: {
      city?: string;
      state?: string;
      country?: string;
    }[];
    languages?: string[];
    kycStatus?: "Verified" | "Pending" | "Rejected"; // Check actual API enum
  };

  // Flattened/Legacy fields for UI if API doesn't nest everything (adjust based on actual response)
  // For now assuming nesting based on user description

  phone?: string;
  // status might be derived from emailVerified or roles
  status?: string;
}
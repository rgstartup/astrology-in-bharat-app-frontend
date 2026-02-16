export interface User {
  id: number;
  name: string;
  email: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  avatar?: string; // Potentially missing from API, handle carefully
  profile_client?: {
    id: number;
    addresses?: {
      city?: string;
      state?: string;
      country?: string;
      street?: string;
      zipCode?: string;
    }[];
  };
  // Legacy/Optional fields for UI compatibility
  phone?: string;
  status?: string; // Derived in UI possibly
  isBlocked?: boolean;
  joinDate?: string;
  address?: string;
  city?: string;
  state?: string;
  dateOfBirth?: string;
  gender?: string;
  totalConsultations?: number;
  totalSpent?: number;
  lastActive?: string;
  // ... other fields as needed
}




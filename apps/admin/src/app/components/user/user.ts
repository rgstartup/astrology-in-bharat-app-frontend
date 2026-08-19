export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at?: string | Date | null;
  created_at?: string;
  updated_at?: string;
  avatar?: string;
  is_blocked: boolean;
  blocked_by_name?: string | null;  // Kisne block kiya (admin/sub-admin email)
  blocked_at?: string | null;       // Kab block kiya

  profile_client?: {
    id: string;
    phone_number?: string;
    gender?: string;
    date_of_birth?: string | Date | null;
    avatar?: string;
    profile_picture?: string;
    addresses?: {
      id: string;
      house_no?: string;
      line1?: string;
      city?: string;
      district?: string;
      state?: string;
      country?: string;
      pincode?: string;
      tag?: string;
    }[];
  };

  profile_expert?: {
    id: string;
    avatar?: string;
    [key: string]: any;
  };

  // UI / Logic derived fields
  phone?: string;
  total_spent?: number;
  total_consultations?: number;
  wallet_balance?: number;
}




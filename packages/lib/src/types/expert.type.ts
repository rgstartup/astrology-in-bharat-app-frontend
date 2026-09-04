import { ExpertKycStatus } from "../enums/kyc-status.enum";

export interface Expert {
  id: string;
  is_blocked: boolean;
  name: string;
  email: string;
  avatar?: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  specialization: string;
  bio?: string;
  about?: string;
  languages?: string;
  experience_in_years: number;
  total_likes: number;
  total_reviews: number;
  rating: number;
  kyc_status?: ExpertKycStatus;
  rejection_reason?: string;
  consultation_count: number;
  phone_number?: string;
  price: number;
  chat_price: number;
  call_price: number;
  video_call_price: number;
  report_price?: number;
  horoscope_price?: number;
  custom_services?: CustomService[];
  video?: string;
  is_available: boolean;
  about_me: string;
  total_earning: number;
  razorpay_contact_id: any;
  agent_commission_rate: any;
  created_at: string;
  updated_at: string;
}

export interface CustomService {
  id: string;
  name: string;
  price: number;
  unit: string;
}

import { PaginatedResponse } from "./paginated.response";
import { Specialization } from "..";

export interface CustomService {
  id: string | number;
  name: string;
  price: number;
  unit: string;
}

export interface Profession {
  id: number | string;
  title: string;
  slug?: string;
  icon?: string;
  description?: string;
}

export interface ExpertProfession {
  id: number | string;
  profession_id?: number | string;
  is_primary?: boolean;
  profession?: Profession;
}

export interface SpecializationDetail {
  id: number | string;
  title: string;
  slug?: string;
  icon?: string;
  description?: string;
}

export interface ExpertSpecialization {
  id: number | string;
  specialization_id?: number | string;
  specialization: SpecializationDetail | Specialization | string;
}

export interface Pricing {
  id?: string | number;
  chat_price?: number;
  call_price?: number;
  video_call_price?: number;
  report_price?: number;
  horoscope_price?: number;
  currency?: string;
}

export interface Expert {
  id: string | number;
  name: string;
  avatar?: string | null;
  about?: string;
  languages?: string | string[];
  experience_in_years?: number;
  rating?: number;
  professions?: ExpertProfession[];
  specializations?: ExpertSpecialization[];
  pricing?: Pricing;
  // Runtime / backward-compatibility fields
  profession?: string | Profession;
  specialization?: string;
  experience?: number;
  price?: number;
  chat_price?: number;
  call_price?: number;
  video_call_price?: number;
  report_price?: number;
  horoscope_price?: number;
  video?: string;
  is_available?: boolean;
  is_busy?: boolean;
  total_likes?: number;
  total_reviews?: number;
  consultation_count?: number;
  custom_services?: CustomService[];
  expert_products?: import("./product").ExpertProduct[];
  [key: string]: any;
}

export interface PaginatedExpertResponse extends PaginatedResponse<Expert> {}

import { PaginatedResponse } from "./paginated.response";
import { ExpertProduct, Specialization } from "..";

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

export interface ExpertSpecialization {
  id: number | string;
  specialization: Specialization;
}

export interface Pricing {
  id?: string | number;
  chat_price?: number;
  call_price?: number;
  video_call_price?: number;
  currency?: string;
}

export interface Expert {
  id: number;
  name: string;
  avatar?: string | null;
  about?: string;
  languages?: string;
  experience_in_years?: number;
  rating?: number;
  professions?: ExpertProfession[];
  specializations?: ExpertSpecialization[];
  pricing?: Pricing;
  // Runtime / backward-compatibility fields
  profession?: Profession;
  video?: string;
  is_available?: boolean;
  is_busy?: boolean;
  total_likes?: number;
  total_reviews?: number;
  consultation_count?: number;
  expert_products?: ExpertProduct[];
  [key: string]: any;
}

export interface PaginatedExpertResponse extends PaginatedResponse<Expert> {}

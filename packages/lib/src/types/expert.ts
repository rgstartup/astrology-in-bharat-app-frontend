import { PaginatedResponse } from "./paginated.response";
import { Specialization } from "..";

export interface CustomService {
  id: string;
  name: string;
  price: number;
  unit: string;
}

export interface ExpertSpecialization {
  id: string;
  specialization: Specialization;
}

export interface Pricing {
  id?: string;
  chat_price?: number;
  call_price?: number;
  video_call_price?: number;
  report_price?: number;
  horoscope_price?: number;
  currency?: string;
}

export interface Expert {
  id: string;
  name: string;
  avatar?: string;
  about?: string;
  languages?: string;
  experience_in_years?: number;
  rating?: number;
  specializations?: ExpertSpecialization[];
  pricing?: Pricing;
  // Runtime / backward-compatibility fields
  specialization?: string;
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
  [key: string]: any;
}

export interface PaginatedExpertResponse extends PaginatedResponse<Expert> {}

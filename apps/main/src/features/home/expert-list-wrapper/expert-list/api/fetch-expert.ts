export interface ExpertProfile {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    language?: string;
  };
  specialization: string;
  experience_in_years: number;
  languages: string[];
  price: number;
  rating: number;
  is_available: boolean;
  video?: string;
  chat_price?: number;
  call_price?: number;
  video_call_price?: number;
  report_price?: number;
  horoscope_price?: number;
  custom_services?: { id: string; name: string; price: number; unit: string }[];
  [key: string]: unknown;
}

export interface IFetchExpertsResponse {
  data: ExpertProfile[];
  pagination: {
    hasMore: boolean;
    total: number;
  };
}

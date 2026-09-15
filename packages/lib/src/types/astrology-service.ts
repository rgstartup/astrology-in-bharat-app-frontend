import { PaginatedResponse } from "./paginated.response";

export interface AstrologyServiceItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  delivery_type: "REPORT_PDF" | "LIVE_CONSULTATION" | string | null;
  suggested_duration_mins: number | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PaginatedAstrologyServiceResponse = PaginatedResponse<AstrologyServiceItem>;
export type IAstrologyServiceResponse = PaginatedResponse<AstrologyServiceItem>;

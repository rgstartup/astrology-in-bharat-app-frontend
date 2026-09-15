import { PaginatedResponse } from "./paginated.response";

export interface SamagriItem {
  item: string;
  quantity: string;
}

export interface DevotionalRitualItem {
  id: string;
  slug: string;
  title: string;
  deity: string | null;
  description: string | null;
  significance: string | null;
  default_samagri_list: SamagriItem[] | null;
  suggested_duration_hours: number | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PaginatedDevotionalRitualResponse = PaginatedResponse<DevotionalRitualItem>;
export type IDevotionalRitualResponse = PaginatedResponse<DevotionalRitualItem>;

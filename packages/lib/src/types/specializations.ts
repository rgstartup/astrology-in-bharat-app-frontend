import { PaginatedResponse } from "./paginated.response";

export interface Specialization {
  id: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface IPaginatedSpecializationResponse extends PaginatedResponse<Specialization> {}

import { PaginationMeta } from "./paginated.response";

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

/** Envelope instance paginated response format: { data: T[], meta: PaginationMeta } */
export interface PaginatedEnvelopeResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export type IPaginatedSpecializationResponse = PaginatedEnvelopeResponse<Specialization>;

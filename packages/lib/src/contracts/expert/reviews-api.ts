/**
 * Expert Reviews API Response Contracts
 */

import { PaginationMeta } from "../../types/paginated.response";

export interface ExpertReviewClient {
  id: number;
  full_name: string | null;
  email: string | null;
}

export interface ExpertReview {
  id: number;
  client_id: number;
  order_id: number | null;
  expert_id: number | null;
  merchant_id: number | null;
  session_id: number | null;
  call_session_id: number | null;
  rating: number;
  comment: string | null;
  status: string;
  review_type: string;
  tags: string[];
  created_at: string; // ISO date string
  client?: ExpertReviewClient | null;
}

export interface ExpertReviewsResponse {
  success: boolean;
  data: ExpertReview[];
  meta: PaginationMeta;
  message?: string;
}

export interface ExpertReviewsStats {
  rating: number;
  totalReviews: number;
  counts: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
}

export interface GetExpertReviewsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  role?: string;
  startDate?: string; // ISO date string
  endDate?: string;   // ISO date string
}

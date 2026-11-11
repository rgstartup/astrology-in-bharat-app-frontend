"use client";

import api from "@/actions/api";
import type { Result } from "@repo/safe-fetch";
import type {
  ExpertReview,
  ExpertReviewsResponse,
  ExpertReviewsStats,
} from "@repo/lib";

export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  user: { name: string; avatar?: string };
  created_at: string;
  reply?: string;
}

/**
 * Fetch paginated reviews for an expert.
 *
 * Uses the actions api instance (@/actions/api) and response contracts from @repo/lib.
 * Returns {@link Result} discriminated union ({ ok: true, data } | { ok: false, error }).
 *
 * @deprecated Import from {@link features/dashboard/api} instead of {@link @/lib/reviews}.
 */
export async function getReviews(
  expertId: string,
  page: number = 1,
  limit: number = 10,
): Promise<Result<ExpertReviewsResponse>> {
  return api.get<ExpertReviewsResponse>(
    `/reviews/expert/${expertId}?page=${page}&limit=${limit}`,
  );
}

/**
 * Fetch review statistics (rating distribution) for an expert.
 * @deprecated Import from {@link features/dashboard/api} instead of {@link @/lib/reviews}.
 */
export async function getReviewStats(
  expertId: string,
): Promise<Result<ExpertReviewsStats>> {
  return api.get<ExpertReviewsStats>(`/reviews/expert/${expertId}/stats`);
}

/**
 * Post a reply to a review.
 * @deprecated Import from {@link features/dashboard/api} instead of {@link @/lib/reviews}.
 */
export async function replyToReview(
  id: string,
  reply: string,
): Promise<Result<any>> {
  return api.post(`/expert/reviews/${id}/reply`, { reply });
}

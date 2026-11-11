"use client";

import api from "@/actions/api";
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
 * @deprecated Import from {@link features/dashboard/api} instead of {@link @/lib/reviews}.
 */
export async function getReviews(
  expertId: string,
  page: number = 1,
  limit: number = 10
): Promise<[{ reviews: Review[]; total: number } | null, any | null]> {
  const result = await api.get<ExpertReviewsResponse>(
    `/reviews/expert/${expertId}?page=${page}&limit=${limit}`
  );
  if (!result.ok) return [null, result.error];

  const data = result.data;
  const reviews: Review[] = (data.data || []).map((r: ExpertReview) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    user: {
      name: r.client?.full_name || "Anonymous",
      avatar: undefined,
    },
    created_at: r.created_at,
  }));

  return [{ reviews, total: data.meta.total }, null];
}

/**
 * Fetch review statistics (rating distribution) for an expert.
 * @deprecated Import from {@link features/dashboard/api} instead of {@link @/lib/reviews}.
 */
export async function getReviewStats(
  expertId: string
): Promise<[ExpertReviewsStats | null, any | null]> {
  const result = await api.get<ExpertReviewsStats>(
    `/reviews/expert/${expertId}/stats`
  );
  if (!result.ok) return [null, result.error];
  return [result.data, null];
}

/**
 * Post a reply to a review.
 * @deprecated Import from {@link features/dashboard/api} instead of {@link @/lib/reviews}.
 */
export async function replyToReview(
  id: string,
  reply: string
): Promise<[any | null, any | null]> {
  return api.post(`/expert/reviews/${id}/reply`, { reply });
}

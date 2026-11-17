"use client";

import api from "@/api/api";
import type { Result } from "@repo/safe-fetch";
import type { ExpertReview, ExpertReviewsStats } from "@repo/lib";
import { API_ROUTES } from "@/utils/api.routes";

export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  user: { name: string; avatar?: string };
  created_at: string;
  reply?: string;
}

/**
 * Fetch paginated reviews for the current expert.
 *
 * Uses the envelope api instance (@/api/api) which auto-unwraps the
 * backend { success, data, error, meta } envelope, so result.data is
 * the plain payload (no unwrap needed). Returns {@link Result}.
 */
export async function getReviews(
  page: number = 1,
  limit: number = 10,
  startDate?: string,
  endDate?: string,
): Promise<Result<ExpertReview[]>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  return api.get<ExpertReview[]>(
    `${API_ROUTES.REVIEWS.LIST}?${params.toString()}`,
  );
}

/**
 * Fetch review statistics (rating distribution) for the current expert.
 */
export async function getReviewStats(): Promise<Result<ExpertReviewsStats>> {
  return api.get<ExpertReviewsStats>(API_ROUTES.REVIEWS.STATS);
}

/**
 * Post a reply to a review.
 * @deprecated Import from {@link features/dashboard/api} instead of {@link @/lib/reviews}.
 */
export async function replyToReview(
  id: string,
  reply: string,
): Promise<Result<any>> {
  return api.post(API_ROUTES.REVIEWS.REPLY(id), { reply });
}

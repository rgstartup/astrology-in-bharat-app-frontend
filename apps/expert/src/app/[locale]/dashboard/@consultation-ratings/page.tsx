import { getReviewStats, getReviews } from "@/features/dashboard/api/server";
import { ConsultationRatingsClient } from "@/components/dashboard/ConsultationRatingsClient";

export default async function ConsultationRatingsPage() {
  const [statsResult, reviewsResult] = await Promise.all([
    getReviewStats(),
    getReviews(1, 10),
  ]);
  const initialStats = statsResult.ok ? statsResult.data : null;
  const initialReviews = reviewsResult.ok ? reviewsResult.data : [];
  return (
    <ConsultationRatingsClient
      initialStats={initialStats}
      initialReviews={initialReviews}
    />
  );
}

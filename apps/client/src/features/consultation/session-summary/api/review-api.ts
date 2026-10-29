import { apiV2 } from "@/actions";

/** Submit a review for a completed consultation session. */
export async function submitReview(
  sessionId: string,
  expertId: number,
  rating: number,
  comment: string,
) {
  const payload = {
    sessionId,
    expert_id: expertId,
    rating,
    comment,
  };

  return apiV2.post("/reviews", payload);
}

export type { Review } from "./reviews.api";
export type { DashboardStats } from "./dashboard.api";

export {
  getReviews,
  getReviewStats,
  replyToReview,
} from "./reviews.api";

export {
  getDashboardStats,
  getRecentAppointments,
  getRecentSessions,
} from "./dashboard.api";

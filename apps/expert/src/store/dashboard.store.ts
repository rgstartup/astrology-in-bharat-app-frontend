import { create } from "zustand";
import { getReviewStats, getReviews, Review } from "@/features/dashboard/api";
import { getDashboardStats, DashboardStats } from "@/features/dashboard/api";
import type { ExpertReview, ExpertReviewsResponse } from "@repo/lib";
import { ReviewStats } from "@/types/expert";

interface DashboardState {
  // Data
  ratingStats: ReviewStats | null;
  reviews: Review[];
  reviewsTotal: number;
  dashboardStats: DashboardStats | null;

  // UI State
  loading: boolean;
  isModalOpen: boolean;

  // Actions
  fetchDashboardData: (expertId: string) => Promise<void>;
  setRatingStats: (stats: ReviewStats | null) => void;
  setReviews: (reviews: Review[]) => void;
  setReviewsTotal: (total: number) => void;
  setDashboardStats: (stats: DashboardStats | null) => void;
  setLoading: (loading: boolean) => void;
  setIsModalOpen: (open: boolean) => void;
  reset: () => void;
}

const initialState = {
  ratingStats: null,
  reviews: [],
  reviewsTotal: 0,
  dashboardStats: null,
  loading: true,
  isModalOpen: false,
};

export const useDashboardStore = create<DashboardState>()((set, get) => ({
  ...initialState,

  fetchDashboardData: async (expertId: number) => {
    set({ loading: true });

    try {
      const [
        [stats, statsErr],
        [reviewsData, reviewsErr],
        [dStats, dStatsErr],
      ] = await Promise.all([
        getReviewStats(expertId),
        getReviews(expertId, 1, 10),
        getDashboardStats("total"),
      ]);

      if (statsErr)
        console.error("[Dashboard] Review stats fetch failed:", statsErr);
      if (reviewsErr)
        console.error("[Dashboard] Reviews fetch failed:", reviewsErr);
      if (dStatsErr)
        console.error("[Dashboard] Dashboard stats fetch failed:", dStatsErr);

      if (stats) {
        console.log(
          "[Dashboard] Rating stats received:",
          JSON.stringify(stats),
        );
        set({ ratingStats: stats });
      }
      if (reviewsData) {
        const expertReviews: ExpertReview[] = reviewsData.data?.data || [];
        const mappedReviews: Review[] = expertReviews.map((r: ExpertReview) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          user: {
            name: r.client?.full_name || "Anonymous",
            avatar: undefined,
          },
          created_at: r.created_at,
        }));
        set({
          reviews: mappedReviews,
          reviewsTotal: reviewsData.data?.meta.total || 0,
        });
      }
      if (dStats) set({ dashboardStats: dStats });
    } catch (error) {
      console.error("[Dashboard] Fetch error:", error);
    } finally {
      set({ loading: false });
    }
  },

  setRatingStats: (stats) => set({ ratingStats: stats }),
  setReviews: (reviews) => set({ reviews }),
  setReviewsTotal: (total) => set({ reviewsTotal: total }),
  setDashboardStats: (stats) => set({ dashboardStats: stats }),
  setLoading: (loading) => set({ loading }),
  setIsModalOpen: (open) => set({ isModalOpen: open }),
  reset: () => set(initialState),
}));

export const dashboardStore = useDashboardStore;
export default useDashboardStore;

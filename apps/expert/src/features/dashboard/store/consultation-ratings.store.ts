import { create } from "zustand";
import type { ExpertReviewsStats } from "@repo/lib";
import apiV2 from "@/api/apiV2";

interface ConsultationRatingsState {
  stats: ExpertReviewsStats | null;
  reviews: any[];
  page: number;
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  fetchReviews: (page: number) => Promise<void>;
}

export const useConsultationRatingsStore = create<ConsultationRatingsState>(
  (set) => ({
    stats: null,
    reviews: [],
    page: 1,
    loading: false,
    error: null,

    fetchStats: async () => {
      set({ loading: true, error: null });
      try {
        const result = await apiV2.get<ExpertReviewsStats>(
          "/expert/me/reviews/stats",
        );
        if (result.ok) {
          set({ stats: result.data, loading: false, error: null });
        } else {
          set({ error: result.error.message, loading: false });
        }
      } catch (e) {
        set({ error: String(e), loading: false });
      }
    },

    fetchReviews: async (page) => {
      set({ loading: true, error: null, page });
      try {
        const result = await apiV2.get<any[]>(
          `/expert/me/reviews?page=${page}&limit=10`,
        );
        if (result.ok) {
          set({ reviews: result.data || [], loading: false, error: null });
        } else {
          set({ error: result.error.message, loading: false });
        }
      } catch (e) {
        set({ error: String(e), loading: false });
      }
    },
  }),
);

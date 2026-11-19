import { create } from "zustand";
import type { DashboardStats } from "@repo/lib";
import apiV2 from "@/api/apiV2";

interface StatsState {
  data: DashboardStats | null;
  period: string;
  loading: boolean;
  error: string | null;
  fetch: (period: string) => Promise<void>;
  setPeriod: (period: string) => void;
}

export const useStatsStore = create<StatsState>((set) => ({
  data: null,
  period: "monthly",
  loading: false,
  error: null,

  setPeriod: (period) => set({ period }),

  fetch: async (period) => {
    set({ loading: true, error: null });
    try {
      const result = await apiV2.get<DashboardStats>(
        `/expert/me/dashboard/stats?period=${period}`,
      );
      if (result.ok) {
        set({ data: result.data, period, loading: false, error: null });
      } else {
        set({ error: result.error.message, loading: false });
      }
    } catch (e) {
      set({ error: String(e), loading: false });
    }
  },
}));

import { create } from "zustand";
import apiV2 from "@/api/apiV2";

interface RecentActivityState {
  data: any[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export const useRecentActivityStore = create<RecentActivityState>((set) => ({
  data: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const [
        pendingChatRes,
        completedChatRes,
        pendingCallRes,
        completedCallRes,
        pujaRes,
      ] = await Promise.all([
        apiV2.get<any>("/chat/sessions/appointments/pending"),
        apiV2.get<any>("/chat/sessions/appointments/completed"),
        apiV2.get<any>("/call/sessions/appointments/pending"),
        apiV2.get<any>("/call/sessions/appointments/completed"),
        apiV2.get<any>("/puja-appointments/expert"),
      ]);

      const extractData = (result: any) => {
        if (!result.ok) return [];
        const data = result.data?.data?.data || result.data?.data || result.data;
        return Array.isArray(data) ? data : [];
      };

      const allSessions = [
        ...extractData(pendingChatRes),
        ...extractData(completedChatRes),
        ...extractData(pendingCallRes),
        ...extractData(completedCallRes),
        ...extractData(pujaRes),
      ];

      const uniqueSessions = Array.from(
        new Map(
          allSessions.map((item) => {
            const typePrefix = (item as any).type ? "call" : "chat";
            return [`${typePrefix}_${item.id}`, item];
          }),
        ).values(),
      );

      const sortedSessions = uniqueSessions.sort((a: any, b: any) => {
        const dateA = new Date(
          a.created_at || a.createdAt || a.start_time || 0,
        ).getTime();
        const dateB = new Date(
          b.created_at || b.createdAt || a.start_time || 0,
        ).getTime();
        return dateB - dateA;
      });

      set({ data: sortedSessions.slice(0, 5), loading: false, error: null });
    } catch (e) {
      set({ error: String(e), loading: false });
    }
  },
}));

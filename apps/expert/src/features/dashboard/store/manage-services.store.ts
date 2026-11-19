import { create } from "zustand";
import apiV2 from "@/api/apiV2";

interface ManageServicesState {
  profile: any | null;
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  updateService: (data: any) => Promise<any | null>;
}

export const useManageServicesStore = create<ManageServicesState>((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const result = await apiV2.get<any>("/expert");
      if (result.ok) {
        set({ profile: result.data, loading: false, error: null });
      } else {
        set({ error: result.error.message, loading: false });
      }
    } catch (e) {
      set({ error: String(e), loading: false });
    }
  },

  updateService: async (data) => {
    try {
      const result = await apiV2.patch<any>("/expert", data);
      if (result.ok) {
        set((state) => ({
          profile: result.data ? { ...state.profile, ...result.data } : state.profile,
        }));
        return result.data;
      }
      return null;
    } catch (e) {
      set({ error: String(e) });
      return null;
    }
  },
}));

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Minimal identity of the client's live consultation, persisted in
 * sessionStorage so the floating tracker survives in-app navigation
 * (but never leaks across tabs/sessions).
 */
export interface ConsultationTrackerSession {
  consultationId: number;
  sessionId: number | null;
  expertId: string;
  expertName: string;
  expertAvatar?: string | null;
  startedAt: string;
  paused: boolean;
}

type ConsultationTrackerState = {
  session: ConsultationTrackerSession | null;
  setSession: (session: ConsultationTrackerSession) => void;
  setPaused: (paused: boolean) => void;
  clearSession: () => void;
};

export const useConsultationTrackerStore = create<ConsultationTrackerState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      setPaused: (paused) =>
        set((s) => (s.session ? { session: { ...s.session, paused } } : s)),
      clearSession: () => set({ session: null }),
    }),
    {
      name: "consultation-tracker",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ session: s.session }),
    },
  ),
);

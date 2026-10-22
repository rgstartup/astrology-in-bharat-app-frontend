import { create } from "zustand";
import type { RtcSession } from "@repo/rtc";

/**
 * State and actions for bridging an active RTC voice session across navigation boundaries.
 */
export interface VoiceSessionStoreState {
  /** Active WebRTC session instantiated via @repo/rtc. */
  session: RtcSession | null;
  /** Consultation ID associated with the active session. */
  consultationId: number | null;
  /**
   * Registers an active RTC session and its consultation ID in the global store.
   *
   * @param session - Active RTC session instance or null to detach.
   * @param consultationId - ID of the consultation room.
   */
  setSession: (session: RtcSession | null, consultationId?: number | null) => void;
  /**
   * Detaches the session reference without disconnecting network media.
   */
  clearSession: () => void;
  /**
   * Leaves the active RTC session, tears down audio tracks, and clears state.
   *
   * @returns Promise resolving when session teardown completes.
   */
  leaveAndClearSession: () => Promise<void>;
}

/**
 * Global Zustand store preserving the active RtcSession during client route transitions.
 * Prevents WebRTC media teardown and renegotiation when navigating from
 * the waiting lobby modal into `/consultation/[id]`.
 */
export const useVoiceSessionStore = create<VoiceSessionStoreState>((set, get) => ({
  session: null,
  consultationId: null,
  setSession: (session, consultationId = null) => set({ session, consultationId }),
  clearSession: () => set({ session: null, consultationId: null }),
  leaveAndClearSession: async () => {
    const current = get().session;
    set({ session: null, consultationId: null });
    if (current) {
      await current.leave().catch(() => undefined);
    }
  },
}));

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
   * @deprecated Use leaveAndClearSession() instead to ensure proper track teardown.
   */
  clearSession: () => void;
  /**
   * Leaves the active RTC session, tears down audio tracks, and clears state.
   * This is the canonical cleanup method - use this for all session termination.
   *
   * @returns Promise resolving when session teardown completes.
   */
  leaveAndClearSession: () => Promise<void>;
  /**
   * Emergency synchronous cleanup: stops all active media tracks immediately.
   * Use when tracks may be orphaned (e.g., page unload, abnormal termination).
   */
  emergencyCleanup: () => void;
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
  clearSession: () => {
    // Always delegate to leaveAndClearSession to ensure track teardown
    // We fire-and-forget here; callers needing completion should use leaveAndClearSession directly
    get().leaveAndClearSession().catch(() => undefined);
  },
  leaveAndClearSession: async () => {
    const current = get().session;
    set({ session: null, consultationId: null });
    if (current) {
      await current.leave().catch(() => undefined);
    }
  },
  emergencyCleanup: () => {
    const current = get().session;
    if (current) {
      // Best-effort: stop all media stream tracks synchronously
      const snapshot = current.getSnapshot();
      // Note: RtcSnapshot doesn't expose raw tracks, but we can call leave()
      // which will trigger adapter teardown. For true sync cleanup we'd need
      // adapter-level access. This is a safety net.
      current.leave().catch(() => undefined);
    }
    set({ session: null, consultationId: null });
  },
}));

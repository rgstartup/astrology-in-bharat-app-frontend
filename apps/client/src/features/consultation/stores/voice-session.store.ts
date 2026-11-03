import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { RtcSession } from "@repo/rtc";

export interface AcceptTimeVoiceToken {
  token: string | null;
  tokenExpiresAt: string | null;
  channelName: string | null;
}

/**
 * State and actions for bridging an active RTC voice session across navigation boundaries.
 */
export interface VoiceSessionStoreState {
  /** Active WebRTC session instantiated via @repo/rtc. */
  session: RtcSession | null;
  /** Consultation ID associated with the active session (persisted for hard-refresh rejoin). */
  consultationId: number | null;
  /** Client identity used to join the Agora channel (persisted for hard-refresh rejoin). */
  identity: string | null;
  /** Accept-time Agora credentials keyed by consultation until the RTC join consumes them. */
  voiceTokensByConsultationId: Record<number, AcceptTimeVoiceToken>;
  /** ID of the consultation currently in the process of joining, to prevent race conditions. */
  joiningConsultationId: number | null;
  /** Sets or clears the in-flight joining consultation ID. */
  setJoiningConsultationId: (id: number | null) => void;
  /** Retain an accept-time token for the RTC session responsible for consuming it. */
  setVoiceToken: (
    consultationId: number,
    token: AcceptTimeVoiceToken,
  ) => void;
  /** Return and remove a consultation token so it can be used for one RTC join. */
  takeVoiceToken: (consultationId: number) => AcceptTimeVoiceToken | null;
  /**
   * Registers an active RTC session and its consultation ID in the global store.
   *
   * @param session - Active RTC session instance or null to detach.
   * @param consultationId - ID of the consultation room.
   */
  setSession: (
    session: RtcSession | null,
    consultationId?: number | null,
    identity?: string | null,
  ) => void;
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
  leaveAndClearSession: (expectedSession?: RtcSession | null) => Promise<void>;
  /**
   * Emergency synchronous cleanup: stops all active media tracks immediately.
   * Use when tracks may be orphaned (e.g., page unload, abnormal termination).
   */
  emergencyCleanup: () => void;
  /**
   * Full reset for consultation restart: leaves the active RTC session,
   * detaches it from the store, and clears all cached accept-time tokens so
   * the next restart creates a fresh session with fresh tokens.
   *
   * @returns Promise resolving when teardown completes.
   */
  reset: () => Promise<void>;
  /**
   * Clears all cached accept-time voice tokens without touching the session.
   * Use when ending a voice session so the next restart fetches fresh tokens.
   */
  clearVoiceTokens: () => void;
}

/**
 * Global Zustand store preserving the active RtcSession during client route transitions.
 * Prevents WebRTC media teardown and renegotiation when navigating from
 * the waiting lobby modal into `/consultation/[id]`.
 */
export const useVoiceSessionStore = create<VoiceSessionStoreState>()(
  persist(
    (set, get) => ({
    session: null,
    consultationId: null,
    identity: null,
    joiningConsultationId: null,
    setJoiningConsultationId: (joiningConsultationId) => set({ joiningConsultationId }),
    voiceTokensByConsultationId: {},
    setVoiceToken: (consultationId, token) =>
      set((state) => ({
        voiceTokensByConsultationId: {
          ...state.voiceTokensByConsultationId,
          [consultationId]: token,
        },
      })),
    takeVoiceToken: (consultationId) => {
      const token = get().voiceTokensByConsultationId[consultationId] ?? null;
      if (token) {
        set((state) => {
          const voiceTokensByConsultationId = {
            ...state.voiceTokensByConsultationId,
          };
          delete voiceTokensByConsultationId[consultationId];
          return { voiceTokensByConsultationId };
        });
      }
      return token;
    },
    setSession: (session, consultationId = null, identity = null) =>
      set({ session, consultationId, identity }),
    clearSession: () => {
      // Always delegate to leaveAndClearSession to ensure track teardown
      // We fire-and-forget here; callers needing completion should use leaveAndClearSession directly
      get()
        .leaveAndClearSession()
        .catch(() => undefined);
    },
    leaveAndClearSession: async (expectedSession) => {
      const current = get().session;
      if (!current && !expectedSession) return;
      if (expectedSession !== undefined && current !== expectedSession) {
        await expectedSession?.leave().catch(() => undefined);
        return;
      }
      set({ session: null, consultationId: null, joiningConsultationId: null });
      const session = expectedSession ?? current;
      if (session) {
        await session.leave().catch(() => undefined);
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
      set({ session: null, consultationId: null, identity: null, joiningConsultationId: null });
    },
    reset: async () => {
      const current = get().session;
      console.log("[VoiceConsultation] store reset called", {
        hasSession: Boolean(current),
        consultationId: get().consultationId,
      });
      if (current) {
        await current.leave().catch(() => undefined);
      }
      set({
          session: null,
          consultationId: null,
          identity: null,
          joiningConsultationId: null,
          voiceTokensByConsultationId: {},
        });
      console.log("[VoiceConsultation] store reset completed — session=null, tokens cleared");
    },
    clearVoiceTokens: () => {
      console.log("[VoiceConsultation] store clearVoiceTokens called");
      set({ voiceTokensByConsultationId: {} });
      console.log("[VoiceConsultation] store clearVoiceTokens completed");
    },
    }),
    {
      name: "astrology-voice-session-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        consultationId: state.consultationId,
        identity: state.identity,
      }),
    }
  )
);


"use client";

import { create } from "zustand";
import type { RtcSession } from "@repo/rtc";
import type { ConsultationMode } from "@/realtime/types/consultation";

/**
 * Global consultation room state - single source of truth for both
 * the consultation room and the floating tracker.
 * The room component is the writer; the tracker is a reader.
 *
 * Voice session metadata (channelName, token, voiceSession, voiceActive)
 * is consolidated here so the RTC session bridges navigation boundaries
 * without a separate voiceSessionStore.
 */
export interface ConsultationRoomState {
  // Consultation identity
  consultationId: number | null;
  sessionId: number | null;
  mode: ConsultationMode | null;
  
  // Expert info
  expertId: string | null;
  expertName: string | null;
  expertAvatar: string | null;
  
  // Session status: "pending" | "active" | "completed" | null
  sessionStatus: "pending" | "active" | "completed" | null;
  
  // Billing state
  elapsedSeconds: number; // elapsed time from room timer
  timeLeft: number | null; // remaining seconds
  maxMinutes: number | null;
  paused: boolean;
  
  // Terminal state
  ended: boolean;
  endedVerdict: {
    totalDurationSeconds?: number;
    reason?: string;
    endedBy?: string;
  } | null;
  
  // Voice session state
  voiceSession: RtcSession | null;
  channelName: string | null;
  token: string | null;
  voiceActive: boolean;
  
  // Actions (called by room component)
  setConsultation: (data: Partial<ConsultationRoomState>) => void;
  setTimer: (elapsedSeconds: number, timeLeft: number | null) => void;
  setPaused: (paused: boolean) => void;
  setEnded: (ended: boolean, verdict?: ConsultationRoomState["endedVerdict"]) => void;
  setVoiceSession: (session: RtcSession | null, channelName: string | null, token: string | null) => void;
  clearVoiceSession: () => void;
  resetForResume: (elapsedSeconds: number, timeLeft: number | null) => void;
  clear: () => void;
}

const initialState: Omit<ConsultationRoomState, keyof { setConsultation: any; setTimer: any; setPaused: any; setEnded: any; setVoiceSession: any; clearVoiceSession: any; resetForResume: any; clear: any }> = {
  consultationId: null,
  sessionId: null,
  mode: null,
  expertId: null,
  expertName: null,
  expertAvatar: null,
  sessionStatus: null,
  elapsedSeconds: 0,
  timeLeft: null,
  maxMinutes: null,
  paused: false,
  ended: false,
  endedVerdict: null,
  voiceSession: null,
  channelName: null,
  token: null,
  voiceActive: false,
};

export const useConsultationRoomStore = create<ConsultationRoomState>((set) => ({
  ...initialState,
  
  setConsultation: (data) => set((state) => ({ ...state, ...data })),
  
  setTimer: (elapsedSeconds, timeLeft) => set({ elapsedSeconds, timeLeft }),
  
  setPaused: (paused) => set({ paused }),
  
  setEnded: (ended, verdict) => set({ ended, endedVerdict: verdict ?? null, sessionStatus: ended ? "completed" : null }),
  
  setVoiceSession: (session, channelName, token) => set({
    voiceSession: session,
    channelName,
    token,
    voiceActive: session !== null && channelName !== null && token !== null,
  }),
  
  clearVoiceSession: () => set({ voiceSession: null, channelName: null, token: null, voiceActive: false }),

  resetForResume: (elapsedSeconds, timeLeft) =>
    set({
      sessionStatus: "active",
      elapsedSeconds,
      timeLeft,
      paused: false,
      ended: false,
      endedVerdict: null,
      voiceSession: null,
      channelName: null,
      token: null,
      voiceActive: false,
    }),
  
  clear: () => set(initialState),
}));

/**
 * Selector for tracker: returns only the fields it needs
 */
export const useConsultationRoomForTracker = () => useConsultationRoomStore((state) => ({
  consultationId: state.consultationId,
  sessionId: state.sessionId,
  mode: state.mode,
  expertId: state.expertId,
  expertName: state.expertName,
  expertAvatar: state.expertAvatar,
  sessionStatus: state.sessionStatus,
  elapsedSeconds: state.elapsedSeconds,
  timeLeft: state.timeLeft,
  maxMinutes: state.maxMinutes,
  paused: state.paused,
  ended: state.ended,
  endedVerdict: state.endedVerdict,
}));

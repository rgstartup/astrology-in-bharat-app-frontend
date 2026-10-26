"use client";

import { createScopedStore } from "./utils/create-scoped-store";

export type ConsultationMode = "chat" | "voice" | "video";

const PENDING_STORAGE_KEY = "consultation-prep-pending";

/**
 * Reads pending expert and mode from sessionStorage (used when user selected an expert while unauthenticated).
 *
 * @returns Object with pendingExpertId and pendingMode
 */
function readPendingSession(): {
  pendingExpertId: string | null;
  pendingMode: ConsultationMode;
} {
  if (typeof window === "undefined") {
    return { pendingExpertId: null, pendingMode: "chat" };
  }
  try {
    const raw = window.sessionStorage.getItem(PENDING_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        pendingExpertId: parsed.pendingExpertId ?? null,
        pendingMode: parsed.pendingMode ?? "chat",
      };
    }
  } catch {
    // nothing to do here
  }
  return { pendingExpertId: null, pendingMode: "chat" };
}

/**
 * Persists or removes pending expert selection in sessionStorage across login redirects.
 *
 * @param pendingExpertId - ID of expert or null to clear
 * @param pendingMode - Consultation mode
 */
function writePendingSession(
  pendingExpertId: string | null,
  pendingMode: ConsultationMode,
): void {
  if (typeof window === "undefined") return;
  try {
    if (pendingExpertId) {
      window.sessionStorage.setItem(
        PENDING_STORAGE_KEY,
        JSON.stringify({ pendingExpertId, pendingMode }),
      );
    } else {
      window.sessionStorage.removeItem(PENDING_STORAGE_KEY);
    }
  } catch {
    // do nothing
  }
}

/**
 * Reactive data state for consultation preparation.
 */
export interface ConsultationPrepDataState {
  expertId: string | null;
  mode: ConsultationMode;
  isOpen: boolean;
  /** Existing consultation to re-initiate into (e.g. continue from the room). */
  consultationId: number | null;
  /** Expert picked while logged out; reopened automatically after login. */
  pendingExpertId: string | null;
  pendingMode: ConsultationMode;
}

/**
 * Actions modifying consultation preparation state.
 */
export interface ConsultationPrepActions {
  openConsultationPrep: (
    expertId: string,
    mode?: ConsultationMode,
    consultationId?: number | null,
  ) => void;
  closeConsultationPrep: () => void;
  setConsultationPrepOpen: (open: boolean) => void;
  setPendingExpert: (expertId: string | null, mode?: ConsultationMode) => void;
  setMode: (mode: ConsultationMode) => void;
}

/**
 * Unified consultation prep store type combining reactive data and actions.
 */
export type ConsultationPrepState = ConsultationPrepDataState &
  ConsultationPrepActions;

/**
 * Scoped consultation prep store bundle providing Provider and boundary hooks.
 */
export const {
  Provider: ConsultationPrepProvider,
  useStore: useConsultationPrepStore,
  useStoreApi: useConsultationPrepStoreApi,
} = createScopedStore<ConsultationPrepDataState, ConsultationPrepActions>(
  (set) => {
    const initialPending = readPendingSession();

    return {
      expertId: null,
      mode: "chat",
      isOpen: false,
      consultationId: null,
      pendingExpertId: initialPending.pendingExpertId,
      pendingMode: initialPending.pendingMode,
      openConsultationPrep: (expertId, mode = "chat", consultationId = null) => {
        writePendingSession(null, "chat");
        set({
          expertId,
          mode,
          isOpen: true,
          consultationId,
          pendingExpertId: null,
          pendingMode: mode,
        });
      },
      closeConsultationPrep: () =>
        set({
          isOpen: false,
          expertId: null,
          consultationId: null,
        }),
      setConsultationPrepOpen: (open) =>
        set(open
          ? { isOpen: true }
          : { isOpen: false }),
      setPendingExpert: (pendingExpertId, mode = "chat") => {
        writePendingSession(pendingExpertId, mode);
        set({ pendingExpertId, pendingMode: mode });
      },
      setMode: (mode) => set({ mode }),
    };
  },
);

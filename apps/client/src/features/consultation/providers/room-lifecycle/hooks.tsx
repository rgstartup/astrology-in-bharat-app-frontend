"use client";

import { useContext } from "react";
import { RoomLifecycleContext } from "./contexts";
import { RoomIdentityContext } from "./contexts";
import { RoomSessionContext } from "./contexts";
import { RoomBillingContext } from "./contexts";
import { RoomReviewContext } from "./contexts";
import { RoomActionsContext } from "./contexts";
import type { RoomLifecycleContextValue } from "./types";

/**
 * Hook to access the consultation room lifecycle context.
 *
 * @returns RoomLifecycleContextValue
 * @throws Error if used outside RoomLifecycleProvider
 */
export function useRoomLifecycle(): RoomLifecycleContextValue {
  const context = useContext(RoomLifecycleContext);
  if (!context) {
    throw new Error(
      "useRoomLifecycle must be used within a RoomLifecycleProvider",
    );
  }
  return context;
}

/**
 * Hook to access identity slice (user, balance, expertData, roomConsultationId, router).
 */
export function useRoomIdentity() {
  const context = useContext(RoomIdentityContext);
  if (!context) {
    throw new Error(
      "useRoomIdentity must be used within a RoomLifecycleProvider",
    );
  }
  return context;
}

/**
 * Hook to access session slice (sessions, sessionId, sessionStatus, roomMode,
 * maxMinutes, elapsedTime, timeLeft, displayElapsedTime, displayTimeLeft,
 * isSessionEnded, pendingExpiresAt, voiceLive, setVoiceLive, voiceConnecting).
 */
export function useRoomSession() {
  const context = useContext(RoomSessionContext);
  if (!context) {
    throw new Error(
      "useRoomSession must be used within a RoomLifecycleProvider",
    );
  }
  return context;
}

/**
 * Hook to access billing slice (chatRate, sessionSummary, isWarning).
 */
export function useRoomBilling() {
  const context = useContext(RoomBillingContext);
  if (!context) {
    throw new Error(
      "useRoomBilling must be used within a RoomLifecycleProvider",
    );
  }
  return context;
}

/**
 * Hook to access review slice (reviewRating, setReviewRating, reviewComment,
 * setReviewComment, reviewSubmitted, setReviewSubmitted).
 */
export function useRoomReview() {
  const context = useContext(RoomReviewContext);
  if (!context) {
    throw new Error(
      "useRoomReview must be used within a RoomLifecycleProvider",
    );
  }
  return context;
}

/**
 * Hook to access actions slice (showModal, setShowModal, handleEndChat,
 * decision, consultationState, endedVerdict, pausedState, pauseLiveChat,
 * resumeLiveChat, endLiveChat, liveMessages, sendLiveMessage, sendLiveTyping,
 * remoteTyping, sessionRevision, resumeRevision).
 */
export function useRoomActions() {
  const context = useContext(RoomActionsContext);
  if (!context) {
    throw new Error(
      "useRoomActions must be used within a RoomLifecycleProvider",
    );
  }
  return context;
}

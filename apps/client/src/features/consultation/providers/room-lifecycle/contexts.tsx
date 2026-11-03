"use client";

import React, { createContext } from "react";
import type {
  RoomLifecycleContextValue,
  RoomLifecycleProviderProps,
} from "./types";

/** Identity: auth-derived values + expert + router. */
export const RoomIdentityContext = createContext<{
  user: RoomLifecycleContextValue["user"];
  balance: RoomLifecycleContextValue["balance"];
  expertData: RoomLifecycleContextValue["expertData"];
  roomConsultationId: RoomLifecycleContextValue["roomConsultationId"];
  router: RoomLifecycleContextValue["router"];
} | null>(null);

/** Session: room timing, status, mode, and session list. */
export const RoomSessionContext = createContext<{
  sessions: RoomLifecycleContextValue["sessions"];
  refreshSessions: RoomLifecycleContextValue["refreshSessions"];
  sessionId: RoomLifecycleContextValue["sessionId"];
  sessionStatus: RoomLifecycleContextValue["sessionStatus"];
  roomMode: RoomLifecycleContextValue["roomMode"];
  maxMinutes: RoomLifecycleContextValue["maxMinutes"];
  elapsedTime: RoomLifecycleContextValue["elapsedTime"];
  timeLeft: RoomLifecycleContextValue["timeLeft"];
  displayElapsedTime: RoomLifecycleContextValue["displayElapsedTime"];
  displayTimeLeft: RoomLifecycleContextValue["displayTimeLeft"];
  isSessionEnded: RoomLifecycleContextValue["isSessionEnded"];
  pendingExpiresAt: RoomLifecycleContextValue["pendingExpiresAt"];
  voiceLive: RoomLifecycleContextValue["voiceLive"];
  setVoiceLive: RoomLifecycleContextValue["setVoiceLive"];
  voiceConnecting: RoomLifecycleContextValue["voiceConnecting"];
} | null>(null);

/** Billing: chat rate, session summary, warning. */
export const RoomBillingContext = createContext<{
  chatRate: RoomLifecycleContextValue["chatRate"];
  sessionSummary: RoomLifecycleContextValue["sessionSummary"];
  isWarning: RoomLifecycleContextValue["isWarning"];
} | null>(null);

/** Review: local review draft state. */
export const RoomReviewContext = createContext<{
  reviewRating: RoomLifecycleContextValue["reviewRating"];
  setReviewRating: RoomLifecycleContextValue["setReviewRating"];
  reviewComment: RoomLifecycleContextValue["reviewComment"];
  setReviewComment: RoomLifecycleContextValue["setReviewComment"];
  reviewSubmitted: RoomLifecycleContextValue["reviewSubmitted"];
  setReviewSubmitted: RoomLifecycleContextValue["setReviewSubmitted"];
} | null>(null);

/** Actions: modal, end chat, and live chat control. */
export const RoomActionsContext = createContext<{
  showModal: RoomLifecycleContextValue["showModal"];
  setShowModal: RoomLifecycleContextValue["setShowModal"];
  handleEndChat: RoomLifecycleContextValue["handleEndChat"];
  decision: RoomLifecycleContextValue["decision"];
  consultationState: RoomLifecycleContextValue["consultationState"];
  endedVerdict: RoomLifecycleContextValue["endedVerdict"];
  pausedState: RoomLifecycleContextValue["pausedState"];
  pauseLiveChat: RoomLifecycleContextValue["pauseLiveChat"];
  resumeLiveChat: RoomLifecycleContextValue["resumeLiveChat"];
  endLiveChat: RoomLifecycleContextValue["endLiveChat"];
  liveMessages: RoomLifecycleContextValue["liveMessages"];
  sendLiveMessage: RoomLifecycleContextValue["sendLiveMessage"];
  sendLiveTyping: RoomLifecycleContextValue["sendLiveTyping"];
  remoteTyping: RoomLifecycleContextValue["remoteTyping"];
  sessionRevision: RoomLifecycleContextValue["sessionRevision"];
  resumeRevision: RoomLifecycleContextValue["resumeRevision"];
} | null>(null);

/** Main combined context for backward compatibility. */
export const RoomLifecycleContext = createContext<RoomLifecycleContextValue | null>(
  null,
);

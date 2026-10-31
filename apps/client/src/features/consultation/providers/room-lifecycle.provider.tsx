"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/authStore";
import { useConsultation } from "@/realtime/hooks/use-consultation";
import { useRoomVerdict } from "../hooks/use-room-verdict";
import { useRoomTimer } from "../hooks/use-room-timer";
import { useRoomBudget } from "../../../realtime/hooks/use-room-budget";
import { useRoomSessionSummary } from "../hooks/use-room-session-summary";
import { resolveRoomMode } from "../utils/session-mode";
import { useRoomStoreSync } from "./use-room-store-sync";
import { useRoomSessionTiming } from "./use-room-session-timing";
import { useRoomSessions } from "./use-room-sessions";
import type {
  RoomLifecycleContextValue,
  RoomLifecycleProviderProps,
} from "./room-lifecycle.types";

const RoomLifecycleContext = createContext<RoomLifecycleContextValue | null>(
  null,
);

/**
 * Provider wrapping consultation lifecycle state: sockets, session revisions,
 * budget, timer, and global store synchronization.
 *
 * @param props - Provider configuration with consultation ID, expert, and initial sessions
 */
export function RoomLifecycleProvider({
  roomConsultationId,
  expertData,
  initialSessions = [],
  children,
}: RoomLifecycleProviderProps) {
  const router = useRouter();
  const { user, balance } = useAuthStore();
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  /** RTC live gate: timer stays paused until RTC reports live (voice/video). Defaults true for chat. */
  const [voiceLive, setVoiceLive] = useState<boolean>(true);

  const { sessions, sessionId, refreshSessions } = useRoomSessions({
    roomConsultationId,
    initialSessions,
    sessionRevision: 0,
  });

  const {
    decision,
    voiceToken: acceptedVoiceToken,
    state: consultationState,
    ended,
    paused,
    pause: pauseLiveChat,
    resume: resumeLiveChat,
    end: endLiveChat,
    // Chat delegated to useConsultation (which wraps useChat)
    messages: liveMessages,
    send: sendLiveMessage,
    typing: sendLiveTyping,
    remoteTyping,
    sessionRevision,
    resumeRevision,
  } = useConsultation(roomConsultationId, sessionId);

  // Refresh sessions when the chat hook bumps sessionRevision (e.g. new
  // session created on "continue"), so sessionId tracks the active session
  // and socket hooks re-subscribe with the right session filter.
  useEffect(() => {
    if (sessionRevision > 0) void refreshSessions();
  }, [sessionRevision, refreshSessions]);

  const acceptedBudget = useMemo(
    () => ({
      maxMinutes: consultationState?.maxMinutes ?? null,
      startedAt: consultationState?.startedAt ?? null,
    }),
    [consultationState?.maxMinutes, consultationState?.startedAt],
  );

  const { sessionStatus, showModal, setShowModal, handleEndChat } =
    useRoomVerdict({
      decision,
      endedVerdict: ended,
      joinedStatus: consultationState?.state ?? null,
      endLiveChat,
    });

  const { pendingExpiresAt, maxMinutes, startedAt, baseSeconds, isWarning } =
    useRoomBudget({
      consultationId: roomConsultationId,
      decision,
      joinStatus: consultationState?.state ?? null,
      acceptedBudget,
      consultationState,
    });

  const { elapsedTime, timeLeft } = useRoomTimer({
    maxMinutes,
    startedAt,
    baseSeconds,
    sessionStatus,
    paused: paused !== null,
    voiceLive,
  });

  const { chatRate, sessionSummary } = useRoomSessionSummary({
    expertData,
    endedVerdict: ended,
    pausedState: paused,
    elapsedTime,
    balance,
    isFree: false,
    freeMinutes: 0,
  });

  const roomMode = resolveRoomMode(initialSessions, consultationState?.mode);

  const { isSessionEnded, displayElapsedTime, displayTimeLeft } =
    useRoomSessionTiming({
      sessions,
      consultationState,
      decision,
      joinedStatus: consultationState?.state ?? null,
      endedVerdict: ended,
      elapsedTime,
      timeLeft,
    });

  useRoomStoreSync({
    roomConsultationId,
    sessionId,
    roomMode,
    expertData,
    sessionStatus,
    maxMinutes,
    pausedState: paused,
    endedVerdict: ended,
    displayElapsedTime,
    displayTimeLeft,
  });

  const contextValue = useMemo<RoomLifecycleContextValue>(
    () => ({
      roomConsultationId,
      expertData,
      user,
      balance,
      router,
      roomMode,
      sessions,
      refreshSessions,
      sessionId,
      sessionStatus,
      showModal,
      setShowModal,
      handleEndChat,
      pendingExpiresAt,
      maxMinutes,
      elapsedTime,
      timeLeft,
      displayElapsedTime,
      displayTimeLeft,
      isSessionEnded,
      chatRate,
      sessionSummary,
      decision,
      acceptedVoiceToken,
      isWarning,
      consultationState,
      endedVerdict: ended,
      pausedState: paused,
      pauseLiveChat,
      resumeLiveChat,
      endLiveChat,
      voiceLive,
      setVoiceLive,
      voiceConnecting: !voiceLive,
      liveMessages,
      sendLiveMessage,
      sendLiveTyping,
      remoteTyping,
      resumeRevision,
      reviewRating,
      setReviewRating,
      reviewComment,
      setReviewComment,
      reviewSubmitted,
      setReviewSubmitted,
    }),
    [
      roomConsultationId,
      expertData,
      user,
      balance,
      router,
      roomMode,
      sessions,
      refreshSessions,
      sessionId,
      sessionStatus,
      showModal,
      setShowModal,
      handleEndChat,
      pendingExpiresAt,
      maxMinutes,
      elapsedTime,
      timeLeft,
      displayElapsedTime,
      displayTimeLeft,
      isSessionEnded,
      chatRate,
      sessionSummary,
      decision,
      acceptedVoiceToken,
      isWarning,
      consultationState,
      ended,
      paused,
      pauseLiveChat,
      resumeLiveChat,
      endLiveChat,
      voiceLive,
      setVoiceLive,
      liveMessages,
      sendLiveMessage,
      sendLiveTyping,
      remoteTyping,
      resumeRevision,
      reviewRating,
      reviewComment,
      reviewSubmitted,
    ],
  );

  return (
    <RoomLifecycleContext.Provider value={contextValue}>
      {children}
    </RoomLifecycleContext.Provider>
  );
}

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

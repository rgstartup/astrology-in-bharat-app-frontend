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
import { resolveRoomMode } from "../application/use-consultation-mode";
import { useRoomStoreSync } from "./use-room-store-sync";
import { useRoomSessionTiming } from "./use-room-session-timing";
import { useRoomSessions } from "./use-room-sessions";
import type {
  RoomLifecycleContextValue,
  RoomLifecycleProviderProps,
} from "./room-lifecycle.types";

/** Identity: auth-derived values + expert + router. */
const RoomIdentityContext = createContext<{
  user: RoomLifecycleContextValue["user"];
  balance: RoomLifecycleContextValue["balance"];
  expertData: RoomLifecycleContextValue["expertData"];
  roomConsultationId: RoomLifecycleContextValue["roomConsultationId"];
  router: RoomLifecycleContextValue["router"];
} | null>(null);

/** Session: room timing, status, mode, and session list. */
const RoomSessionContext = createContext<{
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
const RoomBillingContext = createContext<{
  chatRate: RoomLifecycleContextValue["chatRate"];
  sessionSummary: RoomLifecycleContextValue["sessionSummary"];
  isWarning: RoomLifecycleContextValue["isWarning"];
} | null>(null);

/** Review: local review draft state. */
const RoomReviewContext = createContext<{
  reviewRating: RoomLifecycleContextValue["reviewRating"];
  setReviewRating: RoomLifecycleContextValue["setReviewRating"];
  reviewComment: RoomLifecycleContextValue["reviewComment"];
  setReviewComment: RoomLifecycleContextValue["setReviewComment"];
  reviewSubmitted: RoomLifecycleContextValue["reviewSubmitted"];
  setReviewSubmitted: RoomLifecycleContextValue["setReviewSubmitted"];
} | null>(null);

/** Actions: modal, end chat, and live chat control. */
const RoomActionsContext = createContext<{
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

  const identityValue = useMemo(
    () => ({ user, balance, expertData, roomConsultationId, router }),
    [user, balance, expertData, roomConsultationId, router],
  );

  const sessionValue = useMemo(
    () => ({
      sessions,
      refreshSessions,
      sessionId,
      sessionStatus,
      roomMode,
      maxMinutes,
      elapsedTime,
      timeLeft,
      displayElapsedTime,
      displayTimeLeft,
      isSessionEnded,
      pendingExpiresAt,
      voiceLive,
      setVoiceLive,
      voiceConnecting: !voiceLive,
    }),
    [
      sessions,
      refreshSessions,
      sessionId,
      sessionStatus,
      roomMode,
      maxMinutes,
      elapsedTime,
      timeLeft,
      displayElapsedTime,
      displayTimeLeft,
      isSessionEnded,
      pendingExpiresAt,
      voiceLive,
      setVoiceLive,
    ],
  );

  const billingValue = useMemo(
    () => ({ chatRate, sessionSummary, isWarning }),
    [chatRate, sessionSummary, isWarning],
  );

  const reviewValue = useMemo(
    () => ({
      reviewRating,
      setReviewRating,
      reviewComment,
      setReviewComment,
      reviewSubmitted,
      setReviewSubmitted,
    }),
    [
      reviewRating,
      setReviewRating,
      reviewComment,
      setReviewComment,
      reviewSubmitted,
      setReviewSubmitted,
    ],
  );

  const actionsValue = useMemo(
    () => ({
      showModal,
      setShowModal,
      handleEndChat,
      decision,
      consultationState,
      endedVerdict: ended,
      pausedState: paused,
      pauseLiveChat,
      resumeLiveChat,
      endLiveChat,
      liveMessages,
      sendLiveMessage,
      sendLiveTyping,
      remoteTyping,
      sessionRevision,
      resumeRevision,
    }),
    [
      showModal,
      setShowModal,
      handleEndChat,
      decision,
      consultationState,
      ended,
      paused,
      pauseLiveChat,
      resumeLiveChat,
      endLiveChat,
      liveMessages,
      sendLiveMessage,
      sendLiveTyping,
      remoteTyping,
      sessionRevision,
      resumeRevision,
    ],
  );

  return (
    <RoomIdentityContext.Provider value={identityValue}>
      <RoomSessionContext.Provider value={sessionValue}>
        <RoomBillingContext.Provider value={billingValue}>
          <RoomReviewContext.Provider value={reviewValue}>
            <RoomActionsContext.Provider value={actionsValue}>
              <RoomLifecycleContext.Provider value={contextValue}>
                {children}
              </RoomLifecycleContext.Provider>
            </RoomActionsContext.Provider>
          </RoomReviewContext.Provider>
        </RoomBillingContext.Provider>
      </RoomSessionContext.Provider>
    </RoomIdentityContext.Provider>
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

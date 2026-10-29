"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/authStore";
import type { ChatMessage } from "@/lib/types";
import type { IExpert } from "@repo/lib";
import { ChatVerdictWatcher } from "@/features/consultation/root/components/chat-verdict-watcher";
import { ConsultationSidebar } from "@/features/consultation/sidebar";
import { ChatColumnHeader } from "@/features/consultation/root/components/chat-column-header";
import { SessionSummaryModal } from "@/features/consultation/session-summary";
import { useChat } from "@/realtime/hooks/use-chat-session";
import { useConsultation } from "@/realtime/hooks/use-consultation";
import {
  useChatMessages,
  useChatTypingDisplay,
  useChatTimeline,
} from "@repo/chat";
import { useConsultationRoomStore } from "@/features/consultation/root/stores/consultation-room.store";
import { useRoomVerdict } from "../hooks/use-room-verdict";
import { useRoomComposer } from "../hooks/use-room-composer";
import { useRoomTimer } from "../hooks/use-room-timer";
import { useRoomBudget } from "../hooks/use-room-budget";
import { useRoomSessionSummary } from "../hooks/use-room-session-summary";
import { liveMessageKey, toChatMessage } from "../utils/message-keys";
import {
  getChatHistoryAction,
  type ChatHistorySessionDto,
} from "@/actions/chat";
import RoomPendingBanner from "./room-pending-banner";
import RoomPausedDialog from "./room-paused-dialog";
import RoomBody from "./room-body";
import MainArea from "./main-area";
import { useVoiceUpgrade } from "@/features/consultation/voice/hooks/use-voice-upgrade";
import { useDirectVoice } from "../hooks/use-direct-voice";
import { useConsultationMedia } from "@/features/consultation/voice/hooks/use-consultation-media";
import { resolveRoomMode } from "../utils/session-mode";
import { resolveVoiceRate } from "@/lib/pricing";
import {
  VoiceCancelDialog,
  type SessionDockProps,
  type SessionPhase,
} from "@/features/consultation/session";

const formatTime = (seconds: number) => {
  const mins = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.abs(seconds) % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

type RoomContentProps = {
  roomConsultationId: number | null;
  expertData: IExpert;
  initialMessages: ChatMessage[];
  initialSessions?: ChatHistorySessionDto[];
};

/**
 * Room root for chat, voice, and video consultations: composes the realtime
 * hooks, billing window, and view switchers, then lays out the room tree.
 */
export default function RoomContent({
  roomConsultationId,
  expertData,
  initialMessages,
  initialSessions = [],
}: RoomContentProps) {
  const router = useRouter();

  console.log("[VoiceConsultation] RoomContent mount", {
    roomConsultationId,
    expertId: expertData?.id,
  });

  const { user, balance } = useAuthStore();
  const isFree = false;
  const freeMinutes = 0;

  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [micConfirmed, setMicConfirmed] = useState<boolean>(true);
  const handledResumeRevision = React.useRef(0);

  const {
    messages: liveMessages,
    send: sendLiveMessage,
    typing: sendLiveTyping,
    remoteTyping,
    ended: endedVerdict,
    end: endLiveChat,
    consultationStatus: joinedStatus,
    budget: liveBudget,
    paused: pausedState,
    pause: pauseLiveChat,
    resume: resumeLiveChat,
    sessionRevision,
    resumeRevision,
  } = useChat(roomConsultationId);

  // Single subscription: the decision shim used to mount a second copy here
  // and ChatVerdictWatcher a third. Fields derived below match the shim.
  const {
    decision,
    voiceToken: acceptedVoiceToken,
    isWarning,
    state: consultationState,
  } = useConsultation(roomConsultationId);

  const acceptedBudget = {
    maxMinutes: consultationState?.maxMinutes ?? null,
    startedAt: consultationState?.startedAt ?? null,
  };

  const media = useConsultationMedia({
    consultationId: roomConsultationId ?? 0,
    actorType: "client",
  });

  // Room list = seeded history + live traffic merged with key-based dedup.
  const { messages, setMessages } = useChatMessages({
    initial: initialMessages,
    live: liveMessages,
    liveKey: (m) => liveMessageKey(m),
    baseKeys: (m) => [liveMessageKey(m)],
    toMessage: toChatMessage,
  });
  const [sessions, setSessions] =
    useState<ChatHistorySessionDto[]>(initialSessions);
  const timeline = useChatTimeline(messages, sessions);

  // Live session id, derived from refreshed history instead of a (stale)
  // `?sessionId=` route param: composer attachments + the tracker always
  // target the active session, else the newest known one.
  const sessionId = React.useMemo<string | null>(() => {
    const source = sessions.length > 0 ? sessions : initialSessions;
    const active = source.find((s) => s.status === "active");
    const latest = active ?? source[source.length - 1];
    return latest ? String(latest.sessionId) : null;
  }, [sessions, initialSessions]);

  // The switch closes the call session server-side; re-seed so its ended_at
  // (and the new chat session) reaches the timeline without a page reload.
  const refreshSessions = React.useCallback(async () => {
    if (!roomConsultationId) return;
    const history = await getChatHistoryAction(roomConsultationId);
    if (history.ok && history.data) {
      setSessions(history.data.sessions ?? []);
    }
  }, [roomConsultationId]);

  // Pause closes a session and resume opens a new one; re-seed on both so the
  // timeline shows the boundary without a reload.
  React.useEffect(() => {
    if (sessionRevision === 0) return;
    void refreshSessions();
  }, [sessionRevision, refreshSessions]);

  const { sessionStatus, showModal, setShowModal, handleEndChat } =
    useRoomVerdict({
      decision,
      endedVerdict,
      joinedStatus,
      endLiveChat,
    });

  const { pendingExpiresAt, maxMinutes, startedAt, baseSeconds } =
    useRoomBudget({
      consultationId: roomConsultationId,
      decision,
      joinStatus: joinedStatus,
      liveBudget,
      acceptedBudget,
      consultationState,
    });

  const { elapsedTime, timeLeft } = useRoomTimer({
    maxMinutes,
    startedAt,
    baseSeconds,
    sessionStatus,
    paused: pausedState !== null,
  });

  const { chatRate, sessionSummary } = useRoomSessionSummary({
    expertData,
    endedVerdict,
    pausedState,
    elapsedTime,
    balance,
    isFree,
    freeMinutes,
  });

  const typingStatus = useChatTypingDisplay(
    remoteTyping,
    (expertData as { name?: string } | null)?.name ?? "Expert",
  );

  // Write room state to global store (single source of truth for room + tracker)
  const setConsultation = useConsultationRoomStore((s) => s.setConsultation);
  const setTimer = useConsultationRoomStore((s) => s.setTimer);
  const setPaused = useConsultationRoomStore((s) => s.setPaused);
  const setEnded = useConsultationRoomStore((s) => s.setEnded);
  const resetRoomForResume = useConsultationRoomStore((s) => s.resetForResume);
  const expertId = (expertData as { id?: number | string } | null)?.id;
  const expertName = (expertData as { name?: string } | null)?.name ?? "Expert";
  const expertAvatar =
    (expertData as { avatar?: string | null } | null)?.avatar ?? null;
  const parsedSessionId = sessionId !== null ? Number(sessionId) : NaN;
  const roomMode = resolveRoomMode(initialSessions, consultationState?.mode);
  console.log("[VoiceConsultation] room mode resolved", {
    roomConsultationId,
    roomMode,
    consultationStateMode: consultationState?.mode,
  });

  // Sync consultation identity + status
  React.useEffect(() => {
    setConsultation({
      consultationId: roomConsultationId,
      sessionId: Number.isNaN(parsedSessionId) ? null : parsedSessionId,
      mode: roomMode,
      expertId: expertId ? String(expertId) : null,
      expertName,
      expertAvatar,
      sessionStatus,
      maxMinutes,
      paused: pausedState !== null,
      ended: endedVerdict !== null,
      endedVerdict: endedVerdict
        ? {
            totalDurationSeconds: endedVerdict.totalDurationSeconds,
            reason: endedVerdict.reason,
            endedBy: endedVerdict.endedBy,
          }
        : null,
    });
  }, [
    roomConsultationId,
    parsedSessionId,
    roomMode,
    expertId,
    expertName,
    expertAvatar,
    sessionStatus,
    maxMinutes,
    pausedState,
    endedVerdict,
    setConsultation,
  ]);

  const handleAttachmentSent = (message: ChatMessage) => {
    setMessages((prev: ChatMessage[]) => {
      const known = new Set(prev.map((m) => liveMessageKey(m)));
      return known.has(liveMessageKey(message)) ? prev : [...prev, message];
    });
  };

  const {
    inputValue,
    setInputValue,
    pendingAttachment,
    removePendingAttachment,
    uploading,
    uploadProgress,
    fileInputRef,
    handleSendMessage,
    handleInputTyping,
    handleFileUpload,
  } = useRoomComposer({
    roomConsultationId,
    user,
    sessionId,
    sendLiveMessage,
    sendLiveTyping,
    onAttachmentSent: handleAttachmentSent,
  });

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const voice = useVoiceUpgrade({
    expertId: expertData.id,
    userId: user?.id ?? null,
  });

  // Reset the room store for every backend resume event, independently of
  // the consultation-state subscription or whether this is the first cycle.
  React.useEffect(() => {
    if (resumeRevision === 0 || handledResumeRevision.current === resumeRevision) return;
    handledResumeRevision.current = resumeRevision;
    resetRoomForResume(elapsedTime, timeLeft);
    voice.returnToVoice();
  }, [resumeRevision, elapsedTime, timeLeft, resetRoomForResume, voice.returnToVoice]);

  const voiceRate = React.useMemo(
    () => resolveVoiceRate(expertData),
    [expertData],
  );
  const displayVoiceRate = voice.voicePrice ?? voiceRate;

  // Authoritative room mode: live consultation state wins, latest history
  // session seeds first paint. Replaces the old spoofable `?mode=` query.
  const isDirectVoice = roomMode === "voice";
  console.log("[VoiceConsultation] voice stage eligibility", {
    isDirectVoice,
    roomMode,
  });
  // Determine if session is ended: check live state first, then history
  // A consultation is ended if:
  // - Live state is completed/rejected/cancelled/expired
  // - Or all historical sessions are completed and no active session exists
  const isLiveEnded = consultationState
    ? ["completed", "rejected", "cancelled", "expired"].includes(
        consultationState.state,
      )
    : false;
  const hasActiveHistorySession = sessions.some(
    (s) => s.status === "active",
  );
  const hasLiveActiveSignal =
    decision === "accepted" ||
    joinedStatus === "accepted" ||
    joinedStatus === "active" ||
    consultationState?.state === "accepted" ||
    consultationState?.state === "active";
  const isHistoryEnded =
    sessions.length > 0 &&
    !hasActiveHistorySession &&
    !hasLiveActiveSignal &&
    sessions.every(
      (s) =>
        s.status === "completed" ||
        s.status === "rejected" ||
        s.status === "cancelled",
    );
  const isSessionEnded = isLiveEnded || isHistoryEnded || Boolean(endedVerdict);

  // For an ended session the live timer (now - startedAt) keeps growing with
  // wall-clock time, producing nonsense like "370:24". Freeze the elapsed
  // value to the actual billable duration instead.
  const endedElapsedSeconds = React.useMemo(() => {
    if (!isSessionEnded) return null;
    if (
      endedVerdict &&
      typeof endedVerdict.totalDurationSeconds === "number" &&
      endedVerdict.totalDurationSeconds > 0
    ) {
      return endedVerdict.totalDurationSeconds;
    }
    let total = 0;
    for (const s of sessions) {
      if (s.startedAt && s.endedAt) {
        const ms =
          new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime();
        if (ms > 0) total += Math.floor(ms / 1000);
      }
    }
    return total > 0 ? total : null;
  }, [isSessionEnded, endedVerdict, sessions]);

  const displayElapsedTime = endedElapsedSeconds ?? elapsedTime;
  const displayTimeLeft = isSessionEnded ? 0 : (timeLeft ?? 0);

  // Sync timer (single source of truth) - must be after displayElapsedTime/displayTimeLeft are defined
  React.useEffect(() => {
    setTimer(displayElapsedTime, displayTimeLeft);
  }, [displayElapsedTime, displayTimeLeft, setTimer]);

  // Sync paused separately for quick response
  React.useEffect(() => {
    setPaused(pausedState !== null);
  }, [pausedState, setPaused]);

  // Sync ended
  React.useEffect(() => {
    if (endedVerdict) {
      setEnded(true, {
        totalDurationSeconds: endedVerdict.totalDurationSeconds,
        reason: endedVerdict.reason,
        endedBy: endedVerdict.endedBy,
      });
    }
  }, [endedVerdict, setEnded]);

  const directVoice = useDirectVoice({
    consultationId: roomConsultationId,
    userId: user?.id ?? null,
    sessionStatus,
    decision,
    enabled:
      isDirectVoice &&
      micConfirmed &&
      !isSessionEnded &&
      (pausedState === null || pausedState.reason === "billing_hold"),
    voiceToken: acceptedVoiceToken,
    onLocalReady: media.setLocalReady,
    // Error toasts and leave-on-END now live inside the voice hooks, keyed on
    // primitives instead of these whole hook-result objects.
    ended: isSessionEnded,
  });

  const [voiceCancelOpen, setVoiceCancelOpen] = useState(false);
  const [voiceCancelBusy, setVoiceCancelBusy] = useState(false);
  // Dialog-driven billing hold: pause/resume are serialized so a fast dismiss
  // can never land the hold after the resume and freeze the clock forever.
  const voiceHoldActive = React.useRef(false);
  const voiceHoldChain = React.useRef<Promise<unknown>>(Promise.resolve());

  const queueVoiceHold = React.useCallback(
    (command: "hold" | "release") => {
      const next = voiceHoldChain.current
        .catch(() => undefined)
        .then(() =>
          command === "hold" ? pauseLiveChat("billing_hold") : resumeLiveChat(),
        );
      voiceHoldChain.current = next;
      return next.catch(() => undefined);
    },
    [pauseLiveChat, resumeLiveChat],
  );

  const openVoiceCancel = React.useCallback(() => {
    setVoiceCancelOpen(true);
    // Only a live call burns budget; a pending request has no clock to hold.
    if (sessionStatus !== "active") return;
    voiceHoldActive.current = true;
    void queueVoiceHold("hold");
  }, [queueVoiceHold, sessionStatus]);

  const handleVoiceCancelOpenChange = React.useCallback(
    (open: boolean) => {
      // While the switch is in flight it owns the hold; ignore Escape/backdrop.
      if (!open && voiceCancelBusy) return;
      setVoiceCancelOpen(open);
      if (open || !voiceHoldActive.current) return;
      voiceHoldActive.current = false;
      void queueVoiceHold("release");
    },
    [queueVoiceHold, voiceCancelBusy],
  );

  // Leaving a voice call offers a chat continuation: the backend closes the
  // call session, opens a chat session, and flips the consultation mode.
  const handleVoiceContinueOverChat = React.useCallback(async () => {
    setVoiceCancelBusy(true);
    // The switch re-anchors the clock from frozen elapsed; let any in-flight
    // hold land first so the two commands cannot interleave.
    await voiceHoldChain.current.catch(() => undefined);
    voiceHoldActive.current = false;
    const switched = await directVoice.switchToChat();
    setVoiceCancelBusy(false);
    if (switched) {
      setVoiceCancelOpen(false);
      await refreshSessions();
      return;
    }
    // The call is still up and likely still held: closing must release it.
    voiceHoldActive.current = true;
  }, [directVoice, refreshSessions]);

  const handleVoiceEndSession = React.useCallback(async () => {
    setVoiceCancelOpen(false);
    await voiceHoldChain.current.catch(() => undefined);
    voiceHoldActive.current = false;
    if (sessionStatus === "active") {
      await directVoice.endVoice();
      return;
    }
    await directVoice.cancelVoice();
  }, [directVoice, sessionStatus]);

  const handleUpgrade = React.useCallback(
    (mode: "voice" | "video") => {
      if (mode !== "voice") return;
      void voice.startVoice();
    },
    [voice],
  );

  // Voice stage shows for the chat→voice upgrade path (voice.voiceActive) AND
  // for resume/direct-voice rooms, where the stage would otherwise never
  // appear because voiceActive only tracks the upgrade hook. dockProps uses
  // the same directVoice condition, so both paths render identical controls.
  const showVoiceStage =
    !isSessionEnded &&
    !voice.minimized &&
    (voice.voiceActive ||
      (isDirectVoice && directVoice.active && directVoice.phase !== "ended"));

  const dockProps: SessionDockProps | null = React.useMemo(() => {
    if (
      isSessionEnded ||
      directVoice.phase === "ended" ||
      !directVoice.active
    ) {
      return null;
    }
    if (isDirectVoice) {
      return {
        kind: "voice",
        phase: directVoice.phase as SessionPhase,
        elapsedText: formatTime(elapsedTime),
        rate: displayVoiceRate,
        muted: directVoice.muted,
        onToggleMute: () => void directVoice.toggleMic(),
        speakerMuted: directVoice.speakerMuted,
        onToggleSpeaker: () => void directVoice.toggleSpeaker(),
        onEnd: openVoiceCancel,
        onCancelRequest: openVoiceCancel,
      };
    }
    return null;
  }, [
    isSessionEnded,
    isDirectVoice,
    directVoice,
    elapsedTime,
    displayVoiceRate,
    openVoiceCancel,
  ]);

  // Shared sidebar facts: desktop sidebar renders in parallel with the main
  // column; the mobile drawer takes the same group inside MainArea.
  const sidebarProps = {
    expertData,
    sessionStatus,
    formatTime,
    elapsedTime: displayElapsedTime,
    timeLeft: displayTimeLeft,
    handleEndChat,
    isWarning,
    onUpgrade: handleUpgrade,
    isSessionEnded,
    consultationId: roomConsultationId,
  };

  // Disconnect pauses freeze billing/RTC during the grace window, but they do
  // not mean the wallet is empty and must not open the recharge modal.
  const isRechargePause =
    pausedState !== null &&
    (pausedState.reason == null || pausedState.reason === "insufficient_balance");
  const rechargePaused = !endedVerdict && isRechargePause ? pausedState : null;

  return (
    <div className="font-sans fixed inset-0 z-50 flex overflow-hidden bg-[#f5f1ec] text-[#111111]">
      <RoomPendingBanner
        sessionStatus={sessionStatus}
        expiresAt={pendingExpiresAt}
      />
      <RoomPausedDialog
        paused={rechargePaused}
        onResume={() => {
          resumeLiveChat().catch(() => undefined);
        }}
        onExit={() => {
          endLiveChat().catch(() => undefined);
        }}
      />
      <VoiceCancelDialog
        open={voiceCancelOpen}
        onOpenChange={handleVoiceCancelOpenChange}
        onContinueOverChat={() => {
          void handleVoiceContinueOverChat();
        }}
        onEndSession={() => {
          void handleVoiceEndSession();
        }}
        busy={voiceCancelBusy}
      />
      <ChatVerdictWatcher
        consultationId={roomConsultationId}
        decision={decision}
      />

      {/* 75% Main Chat Area */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f5f1ec]">
        <ChatColumnHeader
          router={router}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          handleEndChat={handleEndChat}
          isSessionEnded={isSessionEnded}
        />

        <MainArea
          expertData={expertData}
          banner={{
            visible: !isSessionEnded && voice.voiceActive && voice.minimized,
            elapsedText: formatTime(elapsedTime),
            onReturn: voice.returnToVoice,
          }}
          stage={{
            elapsedText: formatTime(elapsedTime),
            chatRate,
            voiceRate: displayVoiceRate,
            messages,
            onBackToChat: voice.backToChat,
            onExpandChat: voice.backToChat,
          }}
          upgrade={
            showVoiceStage
              ? {
                  phase: voice.voicePhase,
                  muted: voice.muted,
                  onToggleMute: () => void voice.toggleMic(),
                  speakerMuted: voice.speakerMuted,
                  onToggleSpeaker: () => void voice.toggleSpeaker(),
                  onEndVoice: () => void voice.endVoice(),
                  onCancelRequest: () => void voice.cancelVoice(),
                }
              : null
          }
          drawer={{
            open: mobileSidebarOpen,
            onOpenChange: setMobileSidebarOpen,
            router,
            ...sidebarProps,
          }}
        >
          <RoomBody
            sessionStatus={sessionStatus}
            sessionSummary={sessionSummary}
            messages={messages}
            timeline={timeline}
            expertData={expertData}
            typingStatus={typingStatus}
            user={user}
            pendingAttachment={pendingAttachment}
            removePendingAttachment={removePendingAttachment}
            handleFileUpload={handleFileUpload}
            fileInputRef={fileInputRef}
            uploading={uploading}
            uploadProgress={uploadProgress}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSendMessage={handleSendMessage}
            handleInputTyping={handleInputTyping}
            dock={dockProps}
          />
        </MainArea>
      </div>

      {/* 25% (280-320px) Desktop sidebar, parallel to the main column.
          The mobile drawer takes the same sidebar group inside MainArea. */}
      <ConsultationSidebar {...sidebarProps} />

      <SessionSummaryModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        sessionSummary={sessionSummary}
        freeMinutes={freeMinutes}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        reviewComment={reviewComment}
        setReviewComment={setReviewComment}
        reviewSubmitted={reviewSubmitted}
        setReviewSubmitted={setReviewSubmitted}
        sessionId={sessionId}
        expertData={expertData}
        router={router}
      />
    </div>
  );
}

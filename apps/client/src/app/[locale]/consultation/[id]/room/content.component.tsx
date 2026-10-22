"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/authStore";
import type { ChatMessage } from "@/lib/types";
import type { IExpert } from "@repo/lib";
import { ChatVerdictWatcher } from "../chat-verdict-watcher.component";
import { ConsultationSidebar } from "../sidebar";
import { ChatColumnHeader } from "../chat-column-header.component";
import SessionSummaryModal from "../session-summary";
import { useChat } from "@/realtime/hooks/use-chat";
import { useConsultation } from "@/realtime/hooks/use-consultation";
import {
  useChatMessages,
  useChatTypingDisplay,
  useChatTimeline,
} from "@repo/chat";
import { useRoomVerdict } from "./hooks/use-room-verdict";
import { useRoomComposer } from "./hooks/use-room-composer";
import { useRoomTimer } from "./hooks/use-room-timer";
import { useRoomBudget } from "./hooks/use-room-budget";
import { useRoomSessionSummary } from "./hooks/use-room-session-summary";
import { useRoomTrackerSync } from "./hooks/use-room-tracker-sync";
import { liveMessageKey, toChatMessage } from "./message-keys";
import type { ChatHistorySessionDto } from "@/actions/chat";
import RoomPendingBanner from "./room-pending-banner.component";
import RoomPausedDialog from "./room-paused-dialog.component";
import RoomBody from "./room-body.component";
import MainArea from "./main-area.component";
import { useVoiceUpgrade } from "../voice/use-voice-upgrade.hook";
import { useDirectVoice } from "./hooks/use-direct-voice";
import { useConsultationMedia } from "../voice/use-consultation-media";
import { resolveRoomMode } from "./session-mode";
import { resolveVoiceRate } from "@/lib/pricing";
import {
  VoiceCancelDialog,
  type SessionDockProps,
  type SessionPhase,
} from "../session";

const formatTime = (seconds: number) => {
  const mins = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.abs(seconds) % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

type RoomContentProps = {
  sessionId: string | null;
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
  sessionId,
  roomConsultationId,
  expertData,
  initialMessages,
  initialSessions = [],
}: RoomContentProps) {
  const router = useRouter();

  const { user, balance } = useAuthStore();
  const isFree = false;
  const freeMinutes = 0;

  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [micConfirmed, setMicConfirmed] = useState<boolean>(true);

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
  const [sessions] = useState<ChatHistorySessionDto[]>(initialSessions);
  const timeline = useChatTimeline(messages, sessions);

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

  // useRoomTimer latches onExhausted itself and re-arms on anchor change,
  // so no caller-side guard is needed.
  const { elapsedTime, timeLeft } = useRoomTimer({
    maxMinutes,
    startedAt,
    baseSeconds,
    sessionStatus,
    paused: pausedState !== null,
    onExhausted: () => {
      pauseLiveChat().catch(() => undefined);
    },
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

  useRoomTrackerSync({
    consultationId: roomConsultationId,
    sessionId,
    expertData,
    liveStartedAt: liveBudget.startedAt,
    acceptedStartedAt: acceptedBudget.startedAt,
    paused: pausedState !== null,
    ended: endedVerdict !== null,
  });

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
  const voiceRate = React.useMemo(
    () => resolveVoiceRate(expertData),
    [expertData],
  );
  const displayVoiceRate = voice.voicePrice ?? voiceRate;

  // Authoritative room mode: live consultation state wins, latest history
  // session seeds first paint. Replaces the old spoofable `?mode=` query.
  const roomMode = resolveRoomMode(initialSessions, consultationState?.mode);
  const isDirectVoice = roomMode === "voice";
  const isSessionEnded = sessionStatus === "completed" || Boolean(endedVerdict);
  const directVoice = useDirectVoice({
    consultationId: roomConsultationId,
    userId: user?.id ?? null,
    enabled: isDirectVoice && micConfirmed && !isSessionEnded,
    voiceToken: acceptedVoiceToken,
    onLocalReady: media.setLocalReady,
    // Error toasts and leave-on-END now live inside the voice hooks, keyed on
    // primitives instead of these whole hook-result objects.
    ended: isSessionEnded,
  });

  const [voiceCancelOpen, setVoiceCancelOpen] = useState(false);
  const [voiceCancelBusy, setVoiceCancelBusy] = useState(false);

  // Leaving a voice call offers a chat continuation: the backend closes the
  // call session, opens a chat session, and flips the consultation mode.
  const handleVoiceContinueOverChat = React.useCallback(async () => {
    setVoiceCancelBusy(true);
    const switched = await directVoice.switchToChat();
    setVoiceCancelBusy(false);
    if (switched) {
      setVoiceCancelOpen(false);
    }
  }, [directVoice]);

  const handleVoiceEndSession = React.useCallback(async () => {
    setVoiceCancelOpen(false);
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

  const showVoiceStage = !isSessionEnded && voice.voiceActive && !voice.minimized;

  const dockProps: SessionDockProps | null = React.useMemo(() => {
    if (isSessionEnded || directVoice.phase === "ended") {
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
        onEnd: () => setVoiceCancelOpen(true),
        onCancelRequest: () => setVoiceCancelOpen(true),
      };
    }
    return null;
  }, [isSessionEnded, isDirectVoice, directVoice, elapsedTime, displayVoiceRate]);

  // Shared sidebar facts: desktop sidebar renders in parallel with the main
  // column; the mobile drawer takes the same group inside MainArea.
  const sidebarProps = {
    expertData,
    sessionStatus,
    formatTime,
    elapsedTime,
    timeLeft: timeLeft || 0,
    handleEndChat,
    isWarning,
    onUpgrade: handleUpgrade,
  };

  return (
    <div className="font-sans fixed inset-0 z-50 flex overflow-hidden bg-[#f5f1ec] text-[#111111]">
      <RoomPendingBanner
        sessionStatus={sessionStatus}
        expiresAt={pendingExpiresAt}
      />
      <RoomPausedDialog
        paused={endedVerdict ? null : pausedState}
        onResume={() => {
          resumeLiveChat().catch(() => undefined);
        }}
        onExit={() => {
          endLiveChat().catch(() => undefined);
        }}
      />
      <VoiceCancelDialog
        open={voiceCancelOpen}
        onOpenChange={setVoiceCancelOpen}
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

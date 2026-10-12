"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/authStore";
import type { ChatMessage, ChatSession } from "@/lib/types";
import type { IExpert } from "@repo/lib";
import { cn } from "@/lib/utils";
import { ChatVerdictWatcher } from "../chat-verdict-watcher.component";
import Header from "../header.component";
import SessionSummaryModal from "../session-summary";
import { useChat } from "@/realtime/hooks/use-chat";
import { useChatDecision } from "@/realtime/hooks/use-chat-decision";
import { useConsultation } from "@/realtime/hooks/use-consultation";
import { useRoomVerdict } from "./hooks/use-room-verdict";
import { useRoomComposer } from "./hooks/use-room-composer";
import { useRoomTimer } from "./hooks/use-room-timer";
import { liveMessageKey, toChatMessage } from "./message-keys";
import { toTimeline } from "../message-area/timeline";
import type { ChatHistorySessionDto } from "@/actions/chat";
import RoomPendingBanner from "./room-pending-banner.component";
import RoomPausedDialog from "./room-paused-dialog.component";
import RoomBody from "./room-body.component";

const formatTime = (seconds: number) => {
  const mins = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.abs(seconds) % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

/** sessionStorage fallback seeded by use-chat-prep when the socket budget is unavailable. */
const readStoredBudget = (consultationId: number | null): number | null => {
  if (consultationId === null || typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(`chat:budget:${consultationId}`);
  const mins = raw === null ? NaN : Number(raw);
  return Number.isFinite(mins) && mins > 0 ? mins : null;
};

type ChatRoomContentProps = {
  sessionId: string | null;
  roomConsultationId: number | null;
  expertData: IExpert;
  initialMessages: ChatMessage[];
  initialSessions?: ChatHistorySessionDto[];
};

export default function ChatRoomContent({
  sessionId,
  roomConsultationId,
  expertData,
  initialMessages,
  initialSessions = [],
}: ChatRoomContentProps) {
  const router = useRouter();

  const { user } = useAuthStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isFree = false;
  const freeMinutes = 0;

  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [sessions] = useState<ChatHistorySessionDto[]>(initialSessions);
  const timeline = React.useMemo(
    () => toTimeline(sessions, messages),
    [sessions, messages],
  );

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
  const { decision, budget: acceptedBudget } = useChatDecision(roomConsultationId);
  const { isWarning } = useConsultation(roomConsultationId);

  const { sessionStatus, showModal, setShowModal, handleEndChat } = useRoomVerdict({
    decision,
    endedVerdict,
    joinedStatus,
    endLiveChat,
  });

  const storedMinutes = React.useMemo(
    () => readStoredBudget(roomConsultationId),
    [roomConsultationId],
  );
  const pendingExpiresAt = React.useMemo(() => {
    if (roomConsultationId === null || typeof window === "undefined") return null;
    return window.sessionStorage.getItem(`chat:pending:${roomConsultationId}`);
  }, [roomConsultationId]);
  const maxMinutes =
    liveBudget.maxMinutes ?? acceptedBudget.maxMinutes ?? storedMinutes;
  const startedAt = liveBudget.startedAt ?? acceptedBudget.startedAt;

  const exhaustGuard = React.useRef(false);
  const { elapsedTime, timeLeft } = useRoomTimer({
    maxMinutes,
    startedAt,
    sessionStatus,
    paused: pausedState !== null,
    onExhausted: () => {
      if (exhaustGuard.current) return;
      exhaustGuard.current = true;
      pauseLiveChat().catch(() => undefined);
    },
  });
  useEffect(() => {
    exhaustGuard.current = false;
  }, [startedAt]);

  const [consumedAmount, setConsumedAmount] = useState(0);
  useEffect(() => {
    if (pausedState) setConsumedAmount(Number(pausedState.consumedAmount) || 0);
  }, [pausedState]);

  const sessionSummary = React.useMemo(() => {
    if (!endedVerdict) return null;
    const reason =
      endedVerdict.reason === "balance_exhausted" ? "insufficient_balance" : endedVerdict.reason;
    return {
      status: "completed",
      reason,
      totalCost: consumedAmount,
    } as ChatSession;
  }, [endedVerdict, consumedAmount]);

  const typingStatus = remoteTyping
    ? {
        senderName: (expertData as { name?: string } | null)?.name ?? "Expert",
        isTyping: true,
      }
    : null;

  useEffect(() => {
    if (liveMessages.length === 0) return;
    setMessages((prev: ChatMessage[]) => {
      const known = new Set(prev.map((m) => liveMessageKey(m)));
      const fresh = liveMessages.filter((m) => !known.has(liveMessageKey(m))).map(toChatMessage);
      return fresh.length ? [...prev, ...fresh] : prev;
    });
  }, [liveMessages, setMessages]);

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

  return (
    <div
      className={cn(
        "font-outfit fixed inset-0 z-50 flex flex-col overflow-hidden transition-colors duration-500",
        isDarkMode ? "bg-muted text-foreground" : "bg-background text-foreground",
      )}
    >
      <RoomPendingBanner sessionStatus={sessionStatus} expiresAt={pendingExpiresAt} />
      <RoomPausedDialog
        paused={pausedState}
        onResume={() => {
          exhaustGuard.current = false;
          resumeLiveChat().catch(() => undefined);
        }}
        onExit={() => {
          endLiveChat().catch(() => undefined);
        }}
      />
      <ChatVerdictWatcher consultationId={roomConsultationId} />

      <Header
        router={router}
        expertData={expertData}
        isFree={isFree}
        sessionStatus={sessionStatus}
        formatTime={formatTime}
        elapsedTime={elapsedTime}
        timeLeft={timeLeft || 0}
        handleEndChat={handleEndChat}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isWarning={isWarning}
      />

      <RoomBody
        isDarkMode={isDarkMode}
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
      />

      <SessionSummaryModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        isDarkMode={isDarkMode}
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

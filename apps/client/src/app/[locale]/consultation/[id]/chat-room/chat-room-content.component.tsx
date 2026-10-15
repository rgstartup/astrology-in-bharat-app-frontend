"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/authStore";
import type { ChatMessage, ChatSession } from "@/lib/types";
import type { IExpert } from "@repo/lib";
import { ChatVerdictWatcher } from "../chat-verdict-watcher.component";
import { ConsultationSidebar, MobileSidebarDrawer } from "../sidebar";
import { ChatColumnHeader } from "../chat-column-header.component";
import SessionSummaryModal from "../session-summary";
import { useChat } from "@/realtime/hooks/use-chat";
import { useChatDecision } from "@/realtime/hooks/use-chat-decision";
import { useConsultation } from "@/realtime/hooks/use-consultation";
import { useConsultationTrackerStore } from "@/store/consultationTrackerStore";
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

/**
 * Resolves the per-minute chat rate from expert data with waterfall fallbacks.
 *
 * @param expert - The expert object.
 * @returns Rate per minute in INR.
 */
const resolveChatRate = (expert: IExpert | null | undefined): number => {
  if (!expert) return 0;
  if (expert.pricing?.chat_price !== undefined) {
    return Number(expert.pricing.chat_price) || 0;
  }
  const dynamicExpert = expert as Record<string, unknown>;
  if (typeof dynamicExpert.chat_price === "number") {
    return dynamicExpert.chat_price;
  }
  if (typeof dynamicExpert.price === "number") {
    return dynamicExpert.price;
  }
  return 0;
};

/**
 * Normalizes backend end reasons into client summary keys.
 *
 * @param reason - Raw reason string from socket or server.
 * @returns Clean reason token.
 */
const normalizeEndReason = (reason: string | undefined): string | undefined => {
  if (!reason) return undefined;
  if (reason === "balance_exhausted") return "insufficient_balance";
  return reason;
};

/**
 * Computes session total cost using consumed amount or elapsed duration.
 *
 * @param consumed - Consumed amount reported by socket pause/verdict.
 * @param elapsedSecs - Total elapsed seconds from timer.
 * @param ratePerMin - Per-minute rate.
 * @returns Total charged amount.
 */
const calculateSessionCost = (
  consumed: number,
  elapsedSecs: number,
  ratePerMin: number,
): number => {
  if (consumed > 0) return Math.round(consumed);
  if (elapsedSecs > 0 && ratePerMin > 0) {
    const minutes = Math.ceil(elapsedSecs / 60);
    return Math.round(minutes * ratePerMin);
  }
  return 0;
};

/**
 * Computes remaining wallet balance after deducting session cost.
 *
 * @param currentBalance - Starting wallet balance from authStore.
 * @param sessionCost - Total session cost.
 * @returns Net remaining balance.
 */
const calculateRemainingBalance = (currentBalance: number, sessionCost: number): number => {
  const net = currentBalance - sessionCost;
  if (net < 0) return 0;
  return net;
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

  const { user, balance } = useAuthStore();
  const isFree = false;
  const freeMinutes = 0;

  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [sessions] = useState<ChatHistorySessionDto[]>(initialSessions);
  const timeline = React.useMemo(() => toTimeline(sessions, messages), [sessions, messages]);

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
  /**
   * True once the consultation is live by any signal (fresh accept verdict,
   * rejoin ack after a refresh, or a resolved billing anchor). While true the
   * request-window expiry is stale by definition and must never drive UI.
   */
  const consultationActive = React.useMemo(() => {
    if (decision === "accepted") return true;
    if (joinedStatus === "accepted" || joinedStatus === "active") return true;
    return liveBudget.startedAt !== null;
  }, [decision, joinedStatus, liveBudget.startedAt]);

  useEffect(() => {
    if (!consultationActive || roomConsultationId === null || typeof window === "undefined") return;
    window.sessionStorage.removeItem(`chat:pending:${roomConsultationId}`);
  }, [consultationActive, roomConsultationId]);

  const pendingExpiresAt = React.useMemo(() => {
    if (roomConsultationId === null || typeof window === "undefined") return null;
    if (consultationActive) return null;
    return window.sessionStorage.getItem(`chat:pending:${roomConsultationId}`);
  }, [roomConsultationId, consultationActive]);
  const maxMinutes = liveBudget.maxMinutes ?? acceptedBudget.maxMinutes ?? storedMinutes;
  const startedAt = liveBudget.startedAt ?? acceptedBudget.startedAt;
  const baseSeconds = liveBudget.baseSeconds ?? 0;

  const exhaustGuard = React.useRef(false);
  const { elapsedTime, timeLeft } = useRoomTimer({
    maxMinutes,
    startedAt,
    baseSeconds,
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
  }, [startedAt, baseSeconds]);

  const [consumedAmount, setConsumedAmount] = useState(0);
  useEffect(() => {
    if (pausedState) setConsumedAmount(Number(pausedState.consumedAmount) || 0);
  }, [pausedState]);

  const chatRate = React.useMemo(() => resolveChatRate(expertData), [expertData]);

  const sessionSummary = React.useMemo(() => {
    if (!endedVerdict) return null;
    const reason = normalizeEndReason(endedVerdict.reason);
    let finalDuration = elapsedTime;
    if (
      typeof endedVerdict.totalDurationSeconds === "number" &&
      endedVerdict.totalDurationSeconds > 0
    ) {
      finalDuration = endedVerdict.totalDurationSeconds;
    }
    const totalCost = calculateSessionCost(consumedAmount, finalDuration, chatRate);
    const remainingBalance = calculateRemainingBalance(balance, totalCost);
    const durationMinutes = finalDuration > 0 ? finalDuration / 60 : 0;

    return {
      status: "completed",
      reason,
      duration_seconds: finalDuration,
      durationMins: durationMinutes,
      pricePerMinute: chatRate,
      price_per_minute: chatRate,
      totalCost,
      total_cost: totalCost,
      remainingBalance,
      isFree,
      is_free: isFree,
      freeMinutes,
    } as unknown as ChatSession;
  }, [endedVerdict, consumedAmount, elapsedTime, chatRate, balance, isFree, freeMinutes]);

  const typingStatus = React.useMemo(() => {
    if (!remoteTyping) return null;
    const expertName = (expertData as { name?: string } | null)?.name ?? "Expert";
    return {
      senderName: expertName,
      isTyping: true,
    };
  }, [remoteTyping, expertData]);

  useEffect(() => {
    if (liveMessages.length === 0) return;
    setMessages((prev: ChatMessage[]) => {
      const known = new Set(prev.map((m) => liveMessageKey(m)));
      const fresh = liveMessages.filter((m) => !known.has(liveMessageKey(m))).map(toChatMessage);
      return fresh.length ? [...prev, ...fresh] : prev;
    });
  }, [liveMessages, setMessages]);

  /**
   * Keeps the global floating tracker in sync while the room is mounted:
   * authoritative expert identity + billing anchor on entry, paused flag
   * on budget hold, and session cleanup once the consultation ends.
   */
  useEffect(() => {
    if (roomConsultationId === null) return;
    const tracker = useConsultationTrackerStore.getState();
    if (endedVerdict) {
      tracker.clearSession();
      return;
    }
    const expertName = (expertData as { name?: string } | null)?.name ?? "Expert";
    const expertAvatar = (expertData as { avatar?: string | null } | null)?.avatar ?? null;
    const expertId = (expertData as { id?: number | string } | null)?.id;
    if (expertId === undefined || expertId === null) return;
    const parsedSessionId = sessionId !== null ? Number(sessionId) : NaN;
    const anchor =
      liveBudget.startedAt ??
      acceptedBudget.startedAt ??
      tracker.session?.startedAt ??
      new Date().toISOString();
    tracker.setSession({
      consultationId: roomConsultationId,
      sessionId: Number.isNaN(parsedSessionId) ? null : parsedSessionId,
      expertId: String(expertId),
      expertName,
      expertAvatar,
      startedAt: anchor,
      paused: pausedState !== null,
    });
  }, [
    roomConsultationId,
    sessionId,
    expertData,
    liveBudget.startedAt,
    acceptedBudget.startedAt,
    pausedState,
    endedVerdict,
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

  return (
    <div className="font-sans fixed inset-0 z-50 flex overflow-hidden bg-[#f5f1ec] text-[#111111]">
      <RoomPendingBanner sessionStatus={sessionStatus} expiresAt={pendingExpiresAt} />
      <RoomPausedDialog
        paused={endedVerdict ? null : pausedState}
        onResume={() => {
          exhaustGuard.current = false;
          resumeLiveChat().catch(() => undefined);
        }}
        onExit={() => {
          endLiveChat().catch(() => undefined);
        }}
      />
      <ChatVerdictWatcher consultationId={roomConsultationId} />

      {/* 75% Main Chat Area */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f5f1ec]">
        <ChatColumnHeader
          router={router}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          handleEndChat={handleEndChat}
        />

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
        />
      </div>

      {/* 25% (280-320px) Persistent Desktop Sidebar on Right */}
      <ConsultationSidebar
        expertData={expertData}
        sessionStatus={sessionStatus}
        formatTime={formatTime}
        elapsedTime={elapsedTime}
        timeLeft={timeLeft || 0}
        handleEndChat={handleEndChat}
        isWarning={isWarning}
      />

      {/* Mobile Drawer (< 768px) */}
      <MobileSidebarDrawer
        open={mobileSidebarOpen}
        onOpenChange={setMobileSidebarOpen}
        expertData={expertData}
        sessionStatus={sessionStatus}
        formatTime={formatTime}
        elapsedTime={elapsedTime}
        timeLeft={timeLeft || 0}
        handleEndChat={handleEndChat}
        isWarning={isWarning}
        router={router}
      />

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

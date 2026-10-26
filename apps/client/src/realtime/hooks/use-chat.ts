"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { realtimeSocket } from "@/realtime/socket";
import {
  CHAT_EVENTS,
  joinChat,
  leaveChat,
  sendChatMessage,
  sendChatTyping,
  type SendChatMessageInput,
} from "@/realtime/topics/chat";
import {
  CONSULTATION_EVENTS,
  endConsultation,
  pauseConsultation,
  resumeConsultation,
} from "@/realtime/topics/consultation";
import type {
  ChatEndedPayload,
  ChatMessagePayload,
  ChatPausedPayload,
  ChatResumedPayload,
  ChatTypingPayload,
  JoinChatAck,
} from "@/realtime/types/chat";

export interface ChatBudget {
  maxMinutes: number | null;
  startedAt: string | null;
  /** Pre-anchor consumed seconds (resume base); null before start or on older servers. */
  baseSeconds: number | null;
}

/**
 * Join a consultation's chat room for its lifetime. Failures are silent —
 * REST history remains the source of truth.
 */
export const useChat = (consultationId?: number | string | null) => {
  const id = Number(consultationId);
  const isValidId = Boolean(id && !isNaN(id));
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const [ended, setEnded] = useState<ChatEndedPayload | null>(null);
  const [paused, setPaused] = useState<ChatPausedPayload | null>(null);
  const [consultationStatus, setConsultationStatus] = useState<string | null>(null);
  const [budget, setBudget] = useState<ChatBudget>({ maxMinutes: null, startedAt: null, baseSeconds: null });
  /** Bumped on pause/resume so the room can re-seed session history. */
  const [sessionRevision, setSessionRevision] = useState(0);
  // A `consultation:paused` racing a completed end must never revive the
  // recharge dialog — the server now guards this too, this covers in-flight emits.
  const endedRef = useRef(false);

  useEffect(() => {
    if (!isValidId) return;
    const socket = realtimeSocket();
    /**
     * Merge a server budget into state. `elapsedSeconds` is the server's live
     * elapsed (base + anchor drift at send time), so the resume base is
     * recovered by subtracting local anchor drift at receive time. A fresh
     * anchor without `elapsedSeconds` (older servers) resets the base.
     */
    const applyBudget = (ack?: JoinChatAck | ChatResumedPayload | null) => {
      if (!ack) return;
      setBudget((prev) => {
        const startedAt =
          typeof ack.startedAt === "string" ? ack.startedAt : prev.startedAt;
        let baseSeconds = prev.baseSeconds;
        if (typeof ack.elapsedSeconds === "number" && typeof ack.startedAt === "string") {
          const anchorMs = new Date(ack.startedAt).getTime();
          const drift = !isNaN(anchorMs)
            ? Math.max(0, Math.floor((Date.now() - anchorMs) / 1000))
            : 0;
          baseSeconds = Math.max(0, Math.floor(ack.elapsedSeconds - drift));
        } else if (typeof ack.startedAt === "string") {
          baseSeconds = 0;
        }
        return {
          maxMinutes:
            typeof ack.maxMinutes === "number" ? ack.maxMinutes : prev.maxMinutes,
          startedAt,
          baseSeconds,
        };
      });
    };

    const handleMessage = (payload: ChatMessagePayload) => {
      if (payload && Number(payload.consultationId) === id) {
        setMessages((prev) => [...prev, payload]);
      }
    };

    const handleTyping = (payload: ChatTypingPayload) => {
      if (payload && Number(payload.consultationId) === id) {
        setRemoteTyping(Boolean(payload.isTyping));
      }
    };

    const handleEnded = (payload: ChatEndedPayload) => {
      if (payload && Number(payload.consultationId) === id) {
        endedRef.current = true;
        setEnded(payload);
        setPaused(null);
        // The budget seed and pending deadline are dead once the session
        // ends — clear them so a later continue with new pricing/options
        // can't inherit stale values.
        if (typeof window !== "undefined") {
          window.sessionStorage.removeItem(`chat:pending:${id}`);
          window.sessionStorage.removeItem(`chat:budget:${id}`);
        }
        // Re-seed chat history so session ended_at / ended_reason changes
        // (e.g. a paused call row cleared on end) reach the timeline.
        setSessionRevision((value) => value + 1);
      }
    };

    const handlePaused = (payload: any) => {
      if (endedRef.current) return;
      if (payload && Number(payload.consultationId) === id) {
        setPaused({
          ...payload,
          pauseExpiresInSec:
            typeof payload.pauseExpiresInSec === "number" && !isNaN(payload.pauseExpiresInSec)
              ? payload.pauseExpiresInSec
              : typeof payload.graceDurationSeconds === "number" && !isNaN(payload.graceDurationSeconds)
                ? payload.graceDurationSeconds
                : 300,
          consumedAmount: Number(payload.consumedAmount) || 0,
        });
        if (typeof payload.maxMinutes === "number") {
          setBudget((prev) => ({ ...prev, maxMinutes: payload.maxMinutes }));
        }
        setSessionRevision((value) => value + 1);
      }
    };

    const handleResumed = (payload: ChatResumedPayload) => {
      if (payload && Number(payload.consultationId) === id) {
        setPaused(null);
        applyBudget(payload);
        setSessionRevision((value) => value + 1);
      }
    };

    const handleBudgetTick = (payload: any) => {
      if (payload && Number(payload.consultationId) === id) {
        setBudget((prev) => ({
          maxMinutes: typeof payload.maxMinutes === "number" ? payload.maxMinutes : prev.maxMinutes,
          startedAt: prev.startedAt,
          baseSeconds: prev.baseSeconds,
        }));
      }
    };

    const handleAccepted = (payload: any) => {
      if (payload && Number(payload.consultationId) === id) {
        // Continue-consultation re-accept: unlatch an ended session and
        // refresh budget + session history for the new session's timeline.
        endedRef.current = false;
        setEnded(null);
        setPaused(null);
        applyBudget({
          maxMinutes: payload.maxMinutes,
          startedAt: payload.startedAt,
        } as JoinChatAck);
        setSessionRevision((value) => value + 1);
      }
    };

    const handleBudgetRestored = (payload: any) => {
      if (payload && Number(payload.consultationId) === id) {
        setPaused(null);
        applyBudget(payload);
      }
    };

    const handleConnect = () => {
      joinChat(id)
        .then((ack) => {
          applyBudget(ack);
          if (ack?.consultationStatus) setConsultationStatus(ack.consultationStatus);
        })
        .catch(() => undefined);
    };

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    socket.on(CHAT_EVENTS.MESSAGE, handleMessage);
    socket.on(CHAT_EVENTS.TYPING, handleTyping);
    socket.on(CONSULTATION_EVENTS.EVENTS.ENDED, handleEnded);
    socket.on(CONSULTATION_EVENTS.EVENTS.PAUSED, handlePaused);
    socket.on(CONSULTATION_EVENTS.EVENTS.RESUMED, handleResumed);
    socket.on(CONSULTATION_EVENTS.EVENTS.ACCEPTED, handleAccepted);
    socket.on(CONSULTATION_EVENTS.BUDGET.TICK, handleBudgetTick);
    socket.on(CONSULTATION_EVENTS.BUDGET.RESTORED, handleBudgetRestored);
    socket.on("connect", handleConnect);

    return () => {
      socket.off(CHAT_EVENTS.MESSAGE, handleMessage);
      socket.off(CHAT_EVENTS.TYPING, handleTyping);
      socket.off(CONSULTATION_EVENTS.EVENTS.ENDED, handleEnded);
      socket.off(CONSULTATION_EVENTS.EVENTS.PAUSED, handlePaused);
      socket.off(CONSULTATION_EVENTS.EVENTS.RESUMED, handleResumed);
      socket.off(CONSULTATION_EVENTS.EVENTS.ACCEPTED, handleAccepted);
      socket.off(CONSULTATION_EVENTS.BUDGET.TICK, handleBudgetTick);
      socket.off(CONSULTATION_EVENTS.BUDGET.RESTORED, handleBudgetRestored);
      socket.off("connect", handleConnect);
      setConsultationStatus(null);
      leaveChat(id).catch(() => undefined);
    };
  }, [id, isValidId]);

  const send = useCallback(
    (input: Omit<SendChatMessageInput, "consultationId">) => {
      if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
      return sendChatMessage({ ...input, consultationId: id });
    },
    [id, isValidId],
  );

  const typing = useCallback(
    (isTyping = true) => {
      if (isValidId) sendChatTyping(id, isTyping);
    },
    [id, isValidId],
  );

  const end = useCallback(() => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return endConsultation(id, "manual");
  }, [id, isValidId]);

  const pause = useCallback((reason?: string) => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return pauseConsultation(id, reason);
  }, [id, isValidId]);

  const resume = useCallback(() => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return resumeConsultation(id);
  }, [id, isValidId]);

  return {
    messages,
    send,
    typing,
    remoteTyping,
    ended,
    end,
    consultationStatus,
    budget,
    paused,
    pause,
    resume,
    sessionRevision,
  };
};

export type { ChatTypingPayload };

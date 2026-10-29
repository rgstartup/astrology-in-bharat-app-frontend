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
} from "@/realtime/topics/consultation";
import type {
  ChatEndedPayload,
  ChatMessagePayload,
  ChatPausedPayload,
  ChatResumedPayload,
  ChatTypingPayload,
} from "@/realtime/types/chat";
import type { ConsultationMode } from "@/realtime/types/consultation";

/**
 * Join a consultation's chat room for its lifetime. Failures are silent —
 * REST history remains the source of truth.
 */
export const useChat = (
  consultationId?: number | string | null,
  mode: ConsultationMode = "chat",
) => {
  const id = Number(consultationId);
  const isValidId = Boolean(id && !isNaN(id));
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);
  const [ended, setEnded] = useState<ChatEndedPayload | null>(null);
  const [paused, setPaused] = useState<ChatPausedPayload | null>(null);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const [clientName, setClientName] = useState<string | null>(null);
  const [consultationStatus, setConsultationStatus] = useState<string | null>(null);
  const [budget, setBudget] = useState<{ maxMinutes: number | null; startedAt: string | null; baseSeconds: number | null }>({
    maxMinutes: null,
    startedAt: null,
    baseSeconds: null,
  });
  const [voiceToken, setVoiceToken] = useState<{ token: string | null; tokenExpiresAt: string | null; channelName: string | null }>({
    token: null,
    tokenExpiresAt: null,
    channelName: null,
  });
  // Terminal latch: ENDED is final. Late PAUSED / RESUMED / RESTORED racing
  // the end commit must never revive the paused banner post-end.
  const endedRef = useRef(false);

  useEffect(() => {
    if (!isValidId) return;
    const socket = realtimeSocket();

    /**
     * Merge a server budget into state. `elapsedSeconds` is the server's live
     * elapsed, so the resume base is recovered by subtracting local anchor
     * drift at receive time; a fresh anchor without it (older servers) resets.
     */
    const applyBudget = (ack: {
      maxMinutes?: number;
      startedAt?: string | null;
      elapsedSeconds?: number;
    }) => {
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
      }
    };

    const handleAccepted = (payload: any) => {
      if (!payload || Number(payload.consultationId) !== id) return;
      endedRef.current = false;
      setEnded(null);
      setPaused(null);
      setConsultationStatus("accepted");
      setBudget({
        maxMinutes: typeof payload.maxMinutes === "number" ? payload.maxMinutes : null,
        startedAt: null,
        baseSeconds: 0,
      });
      setVoiceToken({
        token: payload.token ?? null,
        tokenExpiresAt: payload.tokenExpiresAt ?? null,
        channelName: payload.channelName ?? null,
      });
    };

    const handleStarted = (payload: any) => {
      if (!payload || Number(payload.consultationId) !== id) return;
      endedRef.current = false;
      setEnded(null);
      setPaused(null);
      setConsultationStatus("active");
      applyBudget(payload);
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
      }
    };

    const handleResumed = (payload: ChatResumedPayload) => {
      if (payload && Number(payload.consultationId) === id) {
        // RESUMED starts a fresh active lifecycle after the paused cycle.
        endedRef.current = false;
        setEnded(null);
        setPaused(null);
        setConsultationStatus("active");
        applyBudget(payload);
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

    const handleBudgetRestored = (payload: any) => {
      if (endedRef.current) return;
      if (payload && Number(payload.consultationId) === id) {
        setPaused(null);
        applyBudget(payload);
      }
    };

    const handleConnect = () => {
      joinChat(id, mode)
        .then((ack) => {
          if (ack) applyBudget(ack);
          if (ack && typeof ack.clientName === "string" && ack.clientName) {
            setClientName(ack.clientName);
          }
          if (ack?.consultationStatus) setConsultationStatus(ack.consultationStatus);
          if (ack?.token) {
            setVoiceToken({
              token: ack.token,
              tokenExpiresAt: ack.tokenExpiresAt ?? null,
              channelName: ack.channelName ?? null,
            });
          }
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
    socket.on(CONSULTATION_EVENTS.EVENTS.ACCEPTED, handleAccepted);
    socket.on(CONSULTATION_EVENTS.EVENTS.STARTED, handleStarted);
    socket.on(CONSULTATION_EVENTS.EVENTS.PAUSED, handlePaused);
    socket.on(CONSULTATION_EVENTS.EVENTS.RESUMED, handleResumed);
    socket.on(CONSULTATION_EVENTS.BUDGET.TICK, handleBudgetTick);
    socket.on(CONSULTATION_EVENTS.BUDGET.RESTORED, handleBudgetRestored);
    socket.on("connect", handleConnect);

    return () => {
      socket.off(CHAT_EVENTS.MESSAGE, handleMessage);
      socket.off(CHAT_EVENTS.TYPING, handleTyping);
      socket.off(CONSULTATION_EVENTS.EVENTS.ENDED, handleEnded);
      socket.off(CONSULTATION_EVENTS.EVENTS.ACCEPTED, handleAccepted);
      socket.off(CONSULTATION_EVENTS.EVENTS.STARTED, handleStarted);
      socket.off(CONSULTATION_EVENTS.EVENTS.PAUSED, handlePaused);
      socket.off(CONSULTATION_EVENTS.EVENTS.RESUMED, handleResumed);
      socket.off(CONSULTATION_EVENTS.BUDGET.TICK, handleBudgetTick);
      socket.off(CONSULTATION_EVENTS.BUDGET.RESTORED, handleBudgetRestored);
      socket.off("connect", handleConnect);
      setConsultationStatus(null);
      leaveChat(id).catch(() => undefined);
    };
  }, [id, isValidId, mode]);

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

  return { messages, send, typing, remoteTyping, clientName, ended, end, consultationStatus, budget, paused, voiceToken };
};


export type { ChatTypingPayload };

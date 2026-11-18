"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRealtime } from "@/realtime/socket-provider";
import { useSocketEvents } from "@/realtime/hooks/use-socket-event";
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
import type {
  ConsultationBudgetTickPayload,
  ConsultationMode,
} from "@/realtime/types/consultation";

/**
 * Join a consultation's chat room for its lifetime. Failures are silent —
 * REST history remains the source of truth.
 */
export const useChat = (
  consultationId?: number | string | null,
  sessionId?: number | string | null,
  mode: ConsultationMode = "chat",
) => {
  const id = Number(consultationId);
  const sessionIdNum = sessionId != null ? Number(sessionId) : null;
  const isValidSessionId = sessionIdNum != null && !isNaN(sessionIdNum);
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
  const [budgetTick, setBudgetTick] = useState<ConsultationBudgetTickPayload | null>(null);
  const [voiceToken, setVoiceToken] = useState<{ token: string | null; tokenExpiresAt: string | null; channelName: string | null }>({
    token: null,
    tokenExpiresAt: null,
    channelName: null,
  });
  // Terminal latch: ENDED is final. Late PAUSED / RESUMED / RESTORED racing
  // the end commit must never revive the paused banner post-end.
  const endedRef = useRef(false);
  // joinChat can fail on hard refresh if the socket hasn't finished
  // authenticating yet. Retry a few times so the room still recovers.
  const joinChatRetryRef = useRef(0);
  const { socket } = useRealtime();

  /**
   * Merge a server budget into state. `elapsedSeconds` is the server's live
   * elapsed, so the resume base is recovered by subtracting local anchor
   * drift at receive time; a fresh anchor without it (older servers) resets.
   */
  const applyBudget = useCallback(
    (ack: {
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
    },
    [],
  );

  const handleMessage = useCallback(
    (payload: ChatMessagePayload) => {
      if (payload && Number(payload.consultationId) === id) {
        setMessages((prev) => [...prev, payload]);
      }
    },
    [id],
  );

  const handleTyping = useCallback(
    (payload: ChatTypingPayload) => {
      if (payload && Number(payload.consultationId) === id) {
        setRemoteTyping(Boolean(payload.isTyping));
      }
    },
    [id],
  );

  const handleEnded = useCallback(
    (payload: ChatEndedPayload) => {
      if (
        payload &&
        Number(payload.consultationId) === id &&
        !(isValidSessionId && payload.sessionId != null && Number(payload.sessionId) !== sessionIdNum)
      ) {
        endedRef.current = true;
        setEnded(payload);
        setPaused(null);
        // Mark the consultation status completed so the room timer stops
        // immediately on this side instead of relying solely on the
        // endedVerdict relay in useChatRoomSession.
        setConsultationStatus("completed");
      }
    },
    [id, isValidSessionId, sessionIdNum],
  );

  const handleAccepted = useCallback(
    (payload: any) => {
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
    },
    [id],
  );

  const handleStarted = useCallback(
    (payload: any) => {
      if (!payload || Number(payload.consultationId) !== id) return;
      endedRef.current = false;
      setEnded(null);
      setPaused(null);
      setConsultationStatus("active");
      applyBudget(payload);
    },
    [id, applyBudget],
  );

  const handlePaused = useCallback(
    (payload: any) => {
      if (endedRef.current) return;
      if (
        payload &&
        Number(payload.consultationId) === id &&
        !(isValidSessionId && payload.sessionId != null && Number(payload.sessionId) !== sessionIdNum)
      ) {
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
    },
    [id, isValidSessionId, sessionIdNum],
  );

  const handleResumed = useCallback(
    (payload: ChatResumedPayload) => {
      if (!payload || Number(payload.consultationId) !== id) return;
      // RESUMED starts a fresh active lifecycle after the paused cycle.
      endedRef.current = false;
      setEnded(null);
      setPaused(null);
      setConsultationStatus("active");
      applyBudget(payload);
    },
    [id, applyBudget],
  );

  const handleBudgetTick = useCallback(
    (payload: any) => {
      if (
        payload &&
        Number(payload.consultationId) === id &&
        !(isValidSessionId && payload.sessionId != null && Number(payload.sessionId) !== sessionIdNum)
      ) {
        setBudgetTick(payload as ConsultationBudgetTickPayload);
        setBudget((prev) => ({
          maxMinutes: typeof payload.maxMinutes === "number" ? payload.maxMinutes : prev.maxMinutes,
          startedAt: prev.startedAt,
          baseSeconds: prev.baseSeconds,
        }));
      }
    },
    [id, isValidSessionId, sessionIdNum],
  );

  const handleBudgetRestored = useCallback(
    (payload: any) => {
      if (endedRef.current) return;
      if (
        payload &&
        Number(payload.consultationId) === id &&
        !(isValidSessionId && payload.sessionId != null && Number(payload.sessionId) !== sessionIdNum)
      ) {
        setPaused(null);
        applyBudget(payload);
      }
    },
    [id, isValidSessionId, sessionIdNum, applyBudget],
  );

  const handleConnect = useCallback(() => {
    const auth = socket?.auth as { token?: string } | undefined;
    if (!auth?.token) {
      // Socket is anonymous — JWT auth hasn't been applied yet.
      // connectRealtimeSocket(token) will reconnect with auth and fire
      // another 'connect' event; skip joinChat until then.
      console.info("[ExpertVoice] handleConnect: anonymous socket, skipping joinChat", {
        consultationId: id,
      });
      return;
    }
    // Reset retry counter on each connection attempt so a fresh connect
    // (e.g. after JWT auth resolves and socket reconnects) gets full retries.
    joinChatRetryRef.current = 0;
    const attempt = ++joinChatRetryRef.current;
    console.info("[ExpertVoice] handleConnect: joinChat", {
      consultationId: id,
      mode,
      attempt,
      endedRef: endedRef.current,
    });
    joinChat(id, mode)
      .then((ack) => {
        // Only accept a valid joinChat ack; an auth error resolves truthy
        // but lacks consultationStatus — treat as failure and retry.
        if (ack && typeof ack.consultationStatus === "string") {
          joinChatRetryRef.current = 0;
          console.info("[ExpertVoice] handleConnect: joinChat ack", {
            consultationId: id,
            hasAck: Boolean(ack),
            consultationStatus: ack?.consultationStatus ?? null,
            hasVoiceToken: Boolean(ack?.token),
            channelName: ack?.channelName ?? null,
          });
          applyBudget(ack);
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
          return;
        }
        throw new Error(
          `Invalid joinChat ack: ${JSON.stringify(ack)?.slice(0, 200)}`,
        );
      })
      .catch((err) => {
        console.error("[ExpertVoice] handleConnect: joinChat failed", {
          consultationId: id,
          attempt,
          error: err instanceof Error ? err.message : String(err),
        });
        if (attempt < 3) {
          console.info("[ExpertVoice] handleConnect: retrying joinChat", {
            consultationId: id,
            nextAttempt: attempt + 1,
          });
          setTimeout(() => handleConnect(), 1000);
        }
      });
  }, [id, mode, socket, applyBudget]);

  useSocketEvents(
    {
      [CHAT_EVENTS.MESSAGE]: handleMessage,
      [CHAT_EVENTS.TYPING]: handleTyping,
      [CONSULTATION_EVENTS.EVENTS.ENDED]: handleEnded,
      [CONSULTATION_EVENTS.EVENTS.ACCEPTED]: handleAccepted,
      [CONSULTATION_EVENTS.EVENTS.STARTED]: handleStarted,
      [CONSULTATION_EVENTS.EVENTS.PAUSED]: handlePaused,
      [CONSULTATION_EVENTS.EVENTS.RESUMED]: handleResumed,
      [CONSULTATION_EVENTS.EVENTS.RESUMED_CHAT]: handleResumed,
      [CONSULTATION_EVENTS.EVENTS.RESUMED_VOICE]: handleResumed,
      [CONSULTATION_EVENTS.EVENTS.RESUMED_VIDEO]: handleResumed,
      [CONSULTATION_EVENTS.BUDGET.TICK]: handleBudgetTick,
      [CONSULTATION_EVENTS.BUDGET.RESTORED]: handleBudgetRestored,
      connect: handleConnect,
    },
    isValidId,
  );

  useEffect(() => {
    if (!isValidId) return;
    return () => {
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

  return { messages, send, typing, remoteTyping, clientName, ended, end, consultationStatus, budget, budgetTick, paused, voiceToken };
};


export type { ChatTypingPayload };

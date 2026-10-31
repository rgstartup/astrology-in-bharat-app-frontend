"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { realtimeSocket } from "@/realtime/socket";
import {
  CONSULTATION_EVENTS,
  cancelConsultation,
  endConsultation,
  getConsultationStatus,
  joinConsultationRooms,
  leaveConsultationRooms,
  pauseConsultation,
  resumeConsultation,
  resumeConsultationChat,
  resumeConsultationVoice,
  resumeConsultationVideo,
  startConsultation,
} from "@/realtime/topics/consultation";
import type { ConsultationDecisionPayload } from "@/realtime/types/chat";
import type {
  ConsultationBudgetHoldPayload,
  ConsultationBudgetTickPayload,
  ConsultationBudgetWarningPayload,
  ConsultationEndedPayload,
  ConsultationMode,
  ConsultationStatePayload,
} from "@/realtime/types/consultation";

/**
 * Decision lifecycle mirrors the backend `ConsultationLifecycleState`
 * decision subset: waiting → accepted/rejected/cancelled.
 */
export type ConsultationDecision =
  "waiting" | "accepted" | "rejected" | "cancelled";

/**
 * Root consultation orchestrator hook for client app.
 * Manages socket subscriptions, state events, and commands across chat, voice, and video.
 * Re-joins rooms and re-pulls status on every (re)connect — server-side room
 * membership is lost across reconnects, so a mount-only join would leave the
 * room deaf to broadcasts after a backend restart.
 * Terminal latch: ENDED is final until the backend confirms a new acceptance
 * or resume. Late pause/budget events cannot revive an ended consultation;
 * an explicit RESUMED event starts a fresh active lifecycle for every room
 * mode consuming this hook.
 */
export const useConsultation = (
  consultationId?: number | string | null,
  sessionId?: number | string | null,
) => {
  const id = Number(consultationId);
  const isValidId = Boolean(id && !isNaN(id));
  const sessionIdNum = sessionId != null ? Number(sessionId) : null;
  const isValidSessionId = sessionIdNum != null && !isNaN(sessionIdNum);

  const [state, setState] = useState<ConsultationStatePayload | null>(null);
  const [ended, setEnded] = useState<ConsultationEndedPayload | null>(null);
  const [budgetTick, setBudgetTick] =
    useState<ConsultationBudgetTickPayload | null>(null);
  const [budgetWarning, setBudgetWarning] =
    useState<ConsultationBudgetWarningPayload | null>(null);
  const [budgetHold, setBudgetHold] =
    useState<ConsultationBudgetHoldPayload | null>(null);
  const [decision, setDecision] = useState<ConsultationDecision>("waiting");
  const [voiceToken, setVoiceToken] = useState<{
    token: string | null;
    tokenExpiresAt: string | null;
    channelName: string | null;
  }>({ token: null, tokenExpiresAt: null, channelName: null });
  // Terminal latch (see docblock): refs stay current inside socket handlers.
  const endedRef = useRef(false);

  useEffect(() => {
    if (!isValidId) return;
    const socket = realtimeSocket();

    const handleState = (payload: ConsultationStatePayload) => {
      if (!payload || Number(payload.consultationId) !== id) return;
      // 'active' (STARTED / STATE active) always restarts the lifecycle —
      // even for a session we haven't synced to local state yet (local
      // sessionId lags behind until chat history refreshes).
      if (payload.state === "active") {
        endedRef.current = false;
        setEnded(null);
        setState(payload);
        setBudgetHold(null);
        return;
      }
      // Non-active state events belong to a specific session; ignore late
      // events from a previous session (same consultationId, new sessionId).
      if (
        isValidSessionId &&
        payload.sessionId != null &&
        Number(payload.sessionId) !== sessionIdNum
      ) {
        return;
      }
      if (endedRef.current) return;
      setState(payload);
      if (payload.state === "budget_hold") {
        setBudgetHold(payload as unknown as ConsultationBudgetHoldPayload);
      }
    };

    const handleResumed = (payload: ConsultationStatePayload) => {
      if (!payload || Number(payload.consultationId) !== id) return;
      // RESUMED is a session-establishing event: always process so a
      // re-initiated session restarts even if local sessionId is stale.
      endedRef.current = false;
      setEnded(null);
      setDecision("accepted");
      setState({ ...payload, state: "active" });
      if (payload.token || payload.channelName) {
        setVoiceToken({
          token: payload.token ?? null,
          tokenExpiresAt: payload.tokenExpiresAt ?? null,
          channelName: payload.channelName ?? null,
        });
      }
      setBudgetHold(null);
      setBudgetWarning(null);
    };

    const handleEnded = (payload: ConsultationEndedPayload) => {
      if (
        payload &&
        Number(payload.consultationId) === id &&
        !(isValidSessionId && payload.sessionId != null && Number(payload.sessionId) !== sessionIdNum)
      ) {
        endedRef.current = true;
        setEnded(payload);
        setState((prev) => (prev ? { ...prev, state: "completed" } : null));
        setBudgetHold(null);
      }
    };

    const handleBudgetTick = (payload: ConsultationBudgetTickPayload) => {
      if (
        payload &&
        Number(payload.consultationId) === id &&
        !(isValidSessionId && payload.sessionId != null && Number(payload.sessionId) !== sessionIdNum)
      ) {
        setBudgetTick(payload);
      }
    };

    const handleBudgetWarning = (payload: ConsultationBudgetWarningPayload) => {
      if (
        payload &&
        Number(payload.consultationId) === id &&
        !(isValidSessionId && payload.sessionId != null && Number(payload.sessionId) !== sessionIdNum)
      ) {
        setBudgetWarning(payload);
      }
    };

    const handleBudgetExhausted = (payload: ConsultationBudgetHoldPayload) => {
      if (
        payload &&
        Number(payload.consultationId) === id &&
        !(isValidSessionId && payload.sessionId != null && Number(payload.sessionId) !== sessionIdNum)
      ) {
        setBudgetHold(payload);
      }
    };

    const handleBudgetRestored = (payload: ConsultationStatePayload) => {
      if (
        payload &&
        Number(payload.consultationId) === id &&
        !(isValidSessionId && payload.sessionId != null && Number(payload.sessionId) !== sessionIdNum)
      ) {
        setBudgetHold(null);
        setBudgetWarning(null);
        setState(payload);
      }
    };

    const matchDecision = (p: ConsultationDecisionPayload) =>
      Number(p.consultationId) === id;

    const onAccepted = (p: ConsultationDecisionPayload) => {
      if (!matchDecision(p)) return;
      // ACCEPTED is session-establishing: always process even if local
      // sessionId is stale (it lags behind until chat history refreshes).
      // Continue-consultation re-accept: clear the ENDED terminal latch so
      // subsequent state/budget events the new session emits still apply.
      endedRef.current = false;
      setEnded(null);
      setDecision("accepted");
      setVoiceToken({
        token: p.token ?? null,
        tokenExpiresAt: p.tokenExpiresAt ?? null,
        channelName: p.channelName ?? null,
      });
      setState((prev) => ({
        consultationId: p.consultationId,
        mode: prev?.mode ?? "chat",
        state: "accepted",
        startedAt: p.startedAt ?? null,
        maxMinutes: p.maxMinutes ?? prev?.maxMinutes,
        timestamp: p.timestamp,
      }));
      setBudgetHold(null);
    };

    const onRejected = (p: ConsultationDecisionPayload) => {
      if (!matchDecision(p)) return;
      if (isValidSessionId && p.sessionId != null && Number(p.sessionId) !== sessionIdNum) return;
      setDecision("rejected");
      setState((prev) => ({
        consultationId: p.consultationId,
        mode: prev?.mode ?? "chat",
        state: "rejected",
        timestamp: p.timestamp,
      }));
    };

    const onCancelled = (p: ConsultationDecisionPayload) => {
      if (!matchDecision(p)) return;
      if (isValidSessionId && p.sessionId != null && Number(p.sessionId) !== sessionIdNum) return;
      setDecision("cancelled");
      setState((prev) => ({
        consultationId: p.consultationId,
        mode: prev?.mode ?? "chat",
        state: "cancelled",
        timestamp: p.timestamp,
      }));
    };

    const onDisconnected = (p: ConsultationDecisionPayload) => {
      if (!matchDecision(p)) return;
      if (isValidSessionId && p.sessionId != null && Number(p.sessionId) !== sessionIdNum) return;
      setState((prev) => ({
        consultationId: p.consultationId,
        mode: prev?.mode ?? "chat",
        state: "reconnecting",
        timestamp: p.timestamp,
      }));
    };

    /** Rejoin rooms + refresh state; safe to run on every (re)connect. */
    const handleConnect = () => {
      joinConsultationRooms(id)
        .then(() => getConsultationStatus(id))
        .then((status) => {
          if (status) setState(status);
        })
        .catch(() => undefined);
    };

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    socket.on(CONSULTATION_EVENTS.EVENTS.STATE, handleState);
    socket.on(CONSULTATION_EVENTS.EVENTS.STARTED, handleState);
    socket.on(CONSULTATION_EVENTS.EVENTS.PAUSED, handleState);
    socket.on(CONSULTATION_EVENTS.EVENTS.RESUMED, handleResumed);
    socket.on(CONSULTATION_EVENTS.EVENTS.RESUMED_CHAT, handleResumed);
    socket.on(CONSULTATION_EVENTS.EVENTS.RESUMED_VOICE, handleResumed);
    socket.on(CONSULTATION_EVENTS.EVENTS.RESUMED_VIDEO, handleResumed);
    socket.on(CONSULTATION_EVENTS.EVENTS.ENDED, handleEnded);
    socket.on(CONSULTATION_EVENTS.EVENTS.ACCEPTED, onAccepted);
    socket.on(CONSULTATION_EVENTS.EVENTS.REJECTED, onRejected);
    socket.on(CONSULTATION_EVENTS.EVENTS.CANCELLED, onCancelled);
    socket.on(CONSULTATION_EVENTS.EVENTS.DISCONNECTED, onDisconnected);
    socket.on(CONSULTATION_EVENTS.BUDGET.TICK, handleBudgetTick);
    socket.on(CONSULTATION_EVENTS.BUDGET.WARNING, handleBudgetWarning);
    socket.on(CONSULTATION_EVENTS.BUDGET.EXHAUSTED, handleBudgetExhausted);
    socket.on(CONSULTATION_EVENTS.BUDGET.RESTORED, handleBudgetRestored);
    socket.on("connect", handleConnect);

    return () => {
      socket.off(CONSULTATION_EVENTS.EVENTS.STATE, handleState);
      socket.off(CONSULTATION_EVENTS.EVENTS.STARTED, handleState);
      socket.off(CONSULTATION_EVENTS.EVENTS.PAUSED, handleState);
      socket.off(CONSULTATION_EVENTS.EVENTS.RESUMED, handleResumed);
      socket.off(CONSULTATION_EVENTS.EVENTS.RESUMED_CHAT, handleResumed);
      socket.off(CONSULTATION_EVENTS.EVENTS.RESUMED_VOICE, handleResumed);
      socket.off(CONSULTATION_EVENTS.EVENTS.RESUMED_VIDEO, handleResumed);
      socket.off(CONSULTATION_EVENTS.EVENTS.ENDED, handleEnded);
      socket.off(CONSULTATION_EVENTS.EVENTS.ACCEPTED, onAccepted);
      socket.off(CONSULTATION_EVENTS.EVENTS.REJECTED, onRejected);
      socket.off(CONSULTATION_EVENTS.EVENTS.CANCELLED, onCancelled);
      socket.off(CONSULTATION_EVENTS.EVENTS.DISCONNECTED, onDisconnected);
      socket.off(CONSULTATION_EVENTS.BUDGET.TICK, handleBudgetTick);
      socket.off(CONSULTATION_EVENTS.BUDGET.WARNING, handleBudgetWarning);
      socket.off(CONSULTATION_EVENTS.BUDGET.EXHAUSTED, handleBudgetExhausted);
      socket.off(CONSULTATION_EVENTS.BUDGET.RESTORED, handleBudgetRestored);
      socket.off("connect", handleConnect);
      leaveConsultationRooms(id).catch(() => undefined);
    };
  }, [id, isValidId, sessionId, sessionIdNum]);

  const cancel = useCallback(() => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return cancelConsultation(id);
  }, [id, isValidId]);

  const start = useCallback(() => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return startConsultation(id);
  }, [id, isValidId]);

  const pause = useCallback(() => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return pauseConsultation(id);
  }, [id, isValidId]);

  const resume = useCallback(
    (mode?: ConsultationMode) => {
      if (!isValidId)
        return Promise.reject(new Error("Missing consultationId"));
      return resumeConsultation(id, mode);
    },
    [id, isValidId],
  );

  const resumeChat = useCallback(() => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return resumeConsultationChat(id);
  }, [id, isValidId]);

  const resumeVoice = useCallback(() => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return resumeConsultationVoice(id);
  }, [id, isValidId]);

  const resumeVideo = useCallback(() => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return resumeConsultationVideo(id);
  }, [id, isValidId]);

  const end = useCallback(
    (reason?: string) => {
      if (!isValidId)
        return Promise.reject(new Error("Missing consultationId"));
      return endConsultation(id, reason);
    },
    [id, isValidId],
  );

  return {
    state,
    consultationStatus: state?.state ?? null,
    decision,
    voiceToken,
    ended,
    budgetTick,
    budgetWarning,
    budgetHold,
    isBudgetExhausted: budgetHold !== null,
    isWarning: budgetWarning !== null,
    cancel,
    start,
    pause,
    resume,
    resumeChat,
    resumeVoice,
    resumeVideo,
    end,
  };
};

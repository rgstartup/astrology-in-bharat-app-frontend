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
  startConsultation,
} from "@/realtime/topics/consultation";
import type { ConsultationDecisionPayload } from "@/realtime/types/chat";
import type {
  ConsultationBudgetHoldPayload,
  ConsultationBudgetTickPayload,
  ConsultationBudgetWarningPayload,
  ConsultationEndedPayload,
  ConsultationStatePayload,
} from "@/realtime/types/consultation";

/**
 * Decision lifecycle mirrors the backend `ConsultationLifecycleState`
 * decision subset: waiting → accepted/rejected/cancelled.
 */
export type ConsultationDecision = "waiting" | "accepted" | "rejected" | "cancelled";

/**
 * Root consultation orchestrator hook for client app.
 * Manages socket subscriptions, state events, and commands across chat, voice, and video.
 * Re-joins rooms and re-pulls status on every (re)connect — server-side room
 * membership is lost across reconnects, so a mount-only join would leave the
 * room deaf to broadcasts after a backend restart.
 * Terminal latch: ENDED is final at this root level. Late PAUSED / RESUMED /
 * EXHAUSTED / RESTORED arriving after end (in-flight emits racing the end
 * commit) are dropped so shared state can never regress — every mode room
 * (chat, voice, video) consuming this hook inherits the rule.
 */
export const useConsultation = (consultationId?: number | string | null) => {
  const id = Number(consultationId);
  const isValidId = Boolean(id && !isNaN(id));

  const [state, setState] = useState<ConsultationStatePayload | null>(null);
  const [ended, setEnded] = useState<ConsultationEndedPayload | null>(null);
  const [budgetTick, setBudgetTick] = useState<ConsultationBudgetTickPayload | null>(null);
  const [budgetWarning, setBudgetWarning] = useState<ConsultationBudgetWarningPayload | null>(null);
  const [budgetHold, setBudgetHold] = useState<ConsultationBudgetHoldPayload | null>(null);
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
      if (endedRef.current) return;
      if (payload && Number(payload.consultationId) === id) {
        setState(payload);
        if (payload.state === "active") {
          setBudgetHold(null);
        }
        if (payload.state === "budget_hold") {
          setBudgetHold(payload as unknown as ConsultationBudgetHoldPayload);
        }
      }
    };

    const handleEnded = (payload: ConsultationEndedPayload) => {
      if (payload && Number(payload.consultationId) === id) {
        endedRef.current = true;
        setEnded(payload);
        setState((prev) => (prev ? { ...prev, state: "completed" } : null));
        setBudgetHold(null);
      }
    };

    const handleBudgetTick = (payload: ConsultationBudgetTickPayload) => {
      if (endedRef.current) return;
      if (payload && Number(payload.consultationId) === id) {
        setBudgetTick(payload);
      }
    };

    const handleBudgetWarning = (payload: ConsultationBudgetWarningPayload) => {
      if (endedRef.current) return;
      if (payload && Number(payload.consultationId) === id) {
        setBudgetWarning(payload);
      }
    };

    const handleBudgetExhausted = (payload: ConsultationBudgetHoldPayload) => {
      if (endedRef.current) return;
      if (payload && Number(payload.consultationId) === id) {
        setBudgetHold(payload);
      }
    };

    const handleBudgetRestored = (payload: ConsultationStatePayload) => {
      if (endedRef.current) return;
      if (payload && Number(payload.consultationId) === id) {
        setBudgetHold(null);
        setBudgetWarning(null);
        setState(payload);
      }
    };

    const matchDecision = (p: ConsultationDecisionPayload) => Number(p.consultationId) === id;

    const onAccepted = (p: ConsultationDecisionPayload) => {
      if (!matchDecision(p)) return;
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
        mode: p.mode ?? prev?.mode ?? "chat",
        state: "accepted",
        startedAt: p.startedAt ?? null,
        maxMinutes: p.maxMinutes ?? prev?.maxMinutes,
        timestamp: p.timestamp,
      }));
      setBudgetHold(null);
    };

    const onRejected = (p: ConsultationDecisionPayload) => {
      if (!matchDecision(p)) return;
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
    socket.on(CONSULTATION_EVENTS.EVENTS.RESUMED, handleState);
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
      socket.off(CONSULTATION_EVENTS.EVENTS.RESUMED, handleState);
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
  }, [id, isValidId]);

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

  const resume = useCallback(() => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return resumeConsultation(id);
  }, [id, isValidId]);

  const end = useCallback(
    (reason?: string) => {
      if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
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
    end,
  };
};

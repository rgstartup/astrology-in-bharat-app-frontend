"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { realtimeSocket } from "@/realtime/socket";
import {
  CONSULTATION_EVENTS,
  acceptConsultation,
  endConsultation,
  getConsultationStatus,
  joinConsultationRooms,
  leaveConsultationRooms,
  pauseConsultation,
  rejectConsultation,
  resumeConsultation,
  startConsultation,
} from "@/realtime/topics/consultation";
import type {
  ConsultationBudgetHoldPayload,
  ConsultationBudgetTickPayload,
  ConsultationBudgetWarningPayload,
  ConsultationEndedPayload,
  ConsultationStatePayload,
} from "@/realtime/types/consultation";

/**
 * Root consultation orchestrator hook.
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
      socket.off(CONSULTATION_EVENTS.BUDGET.TICK, handleBudgetTick);
      socket.off(CONSULTATION_EVENTS.BUDGET.WARNING, handleBudgetWarning);
      socket.off(CONSULTATION_EVENTS.BUDGET.EXHAUSTED, handleBudgetExhausted);
      socket.off(CONSULTATION_EVENTS.BUDGET.RESTORED, handleBudgetRestored);
      socket.off("connect", handleConnect);
      leaveConsultationRooms(id).catch(() => undefined);
    };
  }, [id, isValidId]);

  const accept = useCallback(() => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return acceptConsultation(id);
  }, [id, isValidId]);

  const reject = useCallback(
    (reason?: string) => {
      if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
      return rejectConsultation(id, reason);
    },
    [id, isValidId],
  );

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
    ended,
    budgetTick,
    budgetWarning,
    budgetHold,
    isBudgetExhausted: budgetHold !== null,
    isWarning: budgetWarning !== null,
    accept,
    reject,
    start,
    pause,
    resume,
    end,
  };
};

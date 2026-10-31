"use client";

import { useEffect, useMemo, useState } from "react";
import { realtimeSocket } from "@/realtime/socket";
import { CONSULTATION_EVENTS } from "@/realtime/topics/consultation";
import type { ConsultationDecision } from "@/realtime/hooks/use-consultation";
import type {
  ConsultationBudgetHoldPayload,
  ConsultationBudgetTickPayload,
  ConsultationBudgetWarningPayload,
  ConsultationStatePayload,
} from "@/realtime/types/consultation";

/** sessionStorage fallback seeded at request time when the socket budget is unavailable. */
const readStoredBudget = (consultationId: number | null): number | null => {
  if (consultationId === null || typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(`chat:budget:${consultationId}`);
  const mins = raw === null ? NaN : Number(raw);
  return Number.isFinite(mins) && mins > 0 ? mins : null;
};

type RoomBudgetParams = {
  consultationId: number | null;
  decision: ConsultationDecision;
  joinStatus: string | null;
  acceptedBudget: { maxMinutes: number | null; startedAt: string | null };
  consultationState: ConsultationStatePayload | null;
};

/**
 * Resolves the room's billing window from every available signal: socket
 * budget (live), accepted state, and sessionStorage seed. Also owns the
 * request-pending expiry banner state and its cleanup once live.
 *
 * Listens to live budget socket events (tick / warning / exhausted / restored)
 * so the room can reflect balance changes without polling.
 */
export function useRoomBudget({
  consultationId,
  decision,
  joinStatus,
  acceptedBudget,
  consultationState,
}: RoomBudgetParams) {
  const storedMinutes = useMemo(
    () => readStoredBudget(consultationId),
    [consultationId],
  );

  const [budgetTick, setBudgetTick] =
    useState<ConsultationBudgetTickPayload | null>(null);
  const [budgetWarning, setBudgetWarning] =
    useState<ConsultationBudgetWarningPayload | null>(null);
  const [budgetHold, setBudgetHold] =
    useState<ConsultationBudgetHoldPayload | null>(null);

  /**
   * True once the consultation is live by any signal (fresh accept verdict,
   * rejoin ack after a refresh, or a resolved billing anchor). While true the
   * request-window expiry is stale by definition and must never drive UI.
   */
  const consultationActive = useMemo(() => {
    if (decision === "accepted") return true;
    if (joinStatus === "accepted" || joinStatus === "active") return true;
    return consultationState?.startedAt !== null;
  }, [decision, joinStatus, consultationState?.startedAt]);

  useEffect(() => {
    if (
      !consultationActive ||
      consultationId === null ||
      typeof window === "undefined"
    )
      return;
    window.sessionStorage.removeItem(`chat:pending:${consultationId}`);
  }, [consultationActive, consultationId]);

  const pendingExpiresAt = useMemo(() => {
    if (consultationId === null || typeof window === "undefined") return null;
    if (consultationActive) return null;
    return window.sessionStorage.getItem(`chat:pending:${consultationId}`);
  }, [consultationId, consultationActive]);

  const maxMinutes = acceptedBudget.maxMinutes ?? storedMinutes;

  const startedAt = consultationState?.startedAt ?? null;
  const baseSeconds = consultationState?.elapsedSeconds ?? 0;

  // Budget warning is driven by live socket budget events; the STATE event's
  // budget_hold payload is still authoritative for the pause UI, but the
  // warning/exhausted signals come from dedicated budget events here.
  const isWarning = budgetWarning !== null;

  // Live budget socket listeners — re-subscribe when consultationId changes.
  useEffect(() => {
    if (!consultationId) return;

    const socket = realtimeSocket();

    const handleBudgetTick = (payload: ConsultationBudgetTickPayload) => {
      if (payload && Number(payload.consultationId) === consultationId) {
        setBudgetTick(payload);
      }
    };

    const handleBudgetWarning = (payload: ConsultationBudgetWarningPayload) => {
      if (payload && Number(payload.consultationId) === consultationId) {
        setBudgetWarning(payload);
      }
    };

    const handleBudgetExhausted = (payload: ConsultationBudgetHoldPayload) => {
      if (payload && Number(payload.consultationId) === consultationId) {
        setBudgetHold(payload);
      }
    };

    const handleBudgetRestored = (payload: ConsultationStatePayload) => {
      if (payload && Number(payload.consultationId) === consultationId) {
        setBudgetHold(null);
        setBudgetWarning(null);
      }
    };

    socket.on(CONSULTATION_EVENTS.BUDGET.TICK, handleBudgetTick);
    socket.on(CONSULTATION_EVENTS.BUDGET.WARNING, handleBudgetWarning);
    socket.on(CONSULTATION_EVENTS.BUDGET.EXHAUSTED, handleBudgetExhausted);
    socket.on(CONSULTATION_EVENTS.BUDGET.RESTORED, handleBudgetRestored);

    return () => {
      socket.off(CONSULTATION_EVENTS.BUDGET.TICK, handleBudgetTick);
      socket.off(CONSULTATION_EVENTS.BUDGET.WARNING, handleBudgetWarning);
      socket.off(CONSULTATION_EVENTS.BUDGET.EXHAUSTED, handleBudgetExhausted);
      socket.off(CONSULTATION_EVENTS.BUDGET.RESTORED, handleBudgetRestored);
    };
  }, [consultationId]);

  const isBudgetExhausted = budgetHold !== null;

  return {
    pendingExpiresAt,
    maxMinutes,
    startedAt,
    baseSeconds,
    isWarning,
    isBudgetExhausted,
    budgetTick,
    budgetWarning,
    budgetHold,
  };
}

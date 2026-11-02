"use client";

import { useEffect, useMemo } from "react";
import { realtimeSocket } from "@/realtime/socket";
import { CONSULTATION_EVENTS } from "@/realtime/topics/consultation";
import type { ConsultationDecision } from "@/realtime/hooks/use-consultation";
import type {
  ConsultationBudgetHoldPayload,
  ConsultationBudgetTickPayload,
  ConsultationBudgetWarningPayload,
  ConsultationStatePayload,
} from "@/realtime/types/consultation";
import { useConsultationRequestStore } from "@/features/consultation-prep/stores/consultation-request-state.store";

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
  const storedRequest = useConsultationRequestStore((state) =>
    consultationId === null
      ? null
      : (state.requestsByConsultationId[consultationId] ?? null),
  );
  const clearPendingExpiry = useConsultationRequestStore(
    (state) => state.clearPendingExpiry,
  );
  const storedMinutes = storedRequest?.maxMinutes ?? null;

  const budgetTick = useConsultationRequestStore((state) =>
    consultationId === null
      ? null
      : (state.budgetEventsByConsultationId[consultationId]?.budgetTick ??
        null),
  );
  const budgetWarning = useConsultationRequestStore((state) =>
    consultationId === null
      ? null
      : (state.budgetEventsByConsultationId[consultationId]?.budgetWarning ??
        null),
  );
  const budgetHold = useConsultationRequestStore((state) =>
    consultationId === null
      ? null
      : (state.budgetEventsByConsultationId[consultationId]?.budgetHold ??
        null),
  );
  const setBudgetTick = useConsultationRequestStore(
    (state) => state.setBudgetTick,
  );
  const setBudgetWarning = useConsultationRequestStore(
    (state) => state.setBudgetWarning,
  );
  const setBudgetHold = useConsultationRequestStore(
    (state) => state.setBudgetHold,
  );
  const clearBudgetEvents = useConsultationRequestStore(
    (state) => state.clearBudgetEvents,
  );
  const clearBudgetWarningAndHold = useConsultationRequestStore(
    (state) => state.clearBudgetWarningAndHold,
  );

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
    if (!consultationActive || consultationId === null) return;
    clearPendingExpiry(consultationId);
  }, [clearPendingExpiry, consultationActive, consultationId]);

  const pendingExpiresAt = useMemo(() => {
    if (consultationActive) return null;
    return storedRequest?.pendingExpiresAt ?? null;
  }, [consultationActive, storedRequest?.pendingExpiresAt]);

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
    clearBudgetEvents(consultationId);

    const handleBudgetTick = (payload: ConsultationBudgetTickPayload) => {
      if (payload && Number(payload.consultationId) === consultationId) {
        setBudgetTick(consultationId, payload);
      }
    };

    const handleBudgetWarning = (payload: ConsultationBudgetWarningPayload) => {
      if (payload && Number(payload.consultationId) === consultationId) {
        setBudgetWarning(consultationId, payload);
      }
    };

    const handleBudgetExhausted = (payload: ConsultationBudgetHoldPayload) => {
      if (payload && Number(payload.consultationId) === consultationId) {
        setBudgetHold(consultationId, payload);
      }
    };

    const handleBudgetRestored = (payload: ConsultationStatePayload) => {
      if (payload && Number(payload.consultationId) === consultationId) {
        clearBudgetWarningAndHold(consultationId);
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
  }, [
    clearBudgetEvents,
    clearBudgetWarningAndHold,
    consultationId,
    setBudgetHold,
    setBudgetTick,
    setBudgetWarning,
  ]);

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

"use client";

import { useEffect, useMemo } from "react";
import type { ChatBudget } from "@/realtime/hooks/use-chat";
import type { ConsultationDecision } from "@/realtime/hooks/use-consultation";
import type { ConsultationStatePayload } from "@/realtime/types/consultation";

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
  liveBudget: ChatBudget;
  acceptedBudget: { maxMinutes: number | null; startedAt: string | null };
  consultationState: ConsultationStatePayload | null;
};

/**
 * Resolves the room's billing window from every available signal: socket
 * budget (live), accepted state, and sessionStorage seed. Also owns the
 * request-pending expiry banner state and its cleanup once live.
 */
export function useRoomBudget({
  consultationId,
  decision,
  joinStatus,
  liveBudget,
  acceptedBudget,
  consultationState,
}: RoomBudgetParams) {
  const storedMinutes = useMemo(
    () => readStoredBudget(consultationId),
    [consultationId],
  );

  /**
   * True once the consultation is live by any signal (fresh accept verdict,
   * rejoin ack after a refresh, or a resolved billing anchor). While true the
   * request-window expiry is stale by definition and must never drive UI.
   */
  const consultationActive = useMemo(() => {
    if (decision === "accepted") return true;
    if (joinStatus === "accepted" || joinStatus === "active") return true;
    return liveBudget.startedAt !== null;
  }, [decision, joinStatus, liveBudget.startedAt]);

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

  const maxMinutes =
    liveBudget.maxMinutes ?? acceptedBudget.maxMinutes ?? storedMinutes;

  // Anchor fallback: a client that joins before the expert gets a join-ack
  // without `startedAt` (the anchor is created on expert join), and no later
  // budget event carries it — but the `consultation:started` broadcast and
  // the `get_status` refresh (both surfaced as `consultationState`) do.
  // Without this the sidebar freezes at 00:00 / 00:00 on a live session.
  const startedAt =
    liveBudget.startedAt ??
    acceptedBudget.startedAt ??
    consultationState?.startedAt ??
    null;
  const baseSeconds =
    liveBudget.baseSeconds ?? consultationState?.elapsedSeconds ?? 0;

  return { pendingExpiresAt, maxMinutes, startedAt, baseSeconds };
}

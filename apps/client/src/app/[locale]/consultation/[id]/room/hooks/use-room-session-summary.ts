"use client";

import { useEffect, useMemo, useState } from "react";
import { type IExpert } from "@repo/lib";
import type { ChatSession } from "@/lib/types";
import type { ChatEndedPayload, ChatPausedPayload } from "@/realtime/types/chat";
import { resolveChatRate } from "@/lib/pricing";

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
const calculateRemainingBalance = (
  currentBalance: number,
  sessionCost: number,
): number => {
  const net = currentBalance - sessionCost;
  if (net < 0) return 0;
  return net;
};

type RoomSessionSummaryParams = {
  expertData: IExpert;
  endedVerdict: ChatEndedPayload | null;
  pausedState: ChatPausedPayload | null;
  elapsedTime: number;
  balance: number;
  isFree: boolean;
  freeMinutes: number;
};

/**
 * End-of-session billing: per-minute chat rate, last server-reported consumed
 * amount (event latch — must persist after `pausedState` clears so the
 * end-summary bills what the server actually charged), and the derived
 * summary handed to SessionSummaryModal.
 */
export function useRoomSessionSummary({
  expertData,
  endedVerdict,
  pausedState,
  elapsedTime,
  balance,
  isFree,
  freeMinutes,
}: RoomSessionSummaryParams) {
  const chatRate = useMemo(() => resolveChatRate(expertData), [expertData]);

  const [consumedAmount, setConsumedAmount] = useState(0);
  useEffect(() => {
    if (pausedState) setConsumedAmount(Number(pausedState.consumedAmount) || 0);
  }, [pausedState]);

  const sessionSummary = useMemo(() => {
    if (!endedVerdict) return null;
    const reason = normalizeEndReason(endedVerdict.reason);
    let finalDuration = elapsedTime;
    if (
      typeof endedVerdict.totalDurationSeconds === "number" &&
      endedVerdict.totalDurationSeconds > 0
    ) {
      finalDuration = endedVerdict.totalDurationSeconds;
    }
    const totalCost = calculateSessionCost(
      consumedAmount,
      finalDuration,
      chatRate,
    );
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
  }, [
    endedVerdict,
    consumedAmount,
    elapsedTime,
    chatRate,
    balance,
    isFree,
    freeMinutes,
  ]);

  return { chatRate, sessionSummary };
}

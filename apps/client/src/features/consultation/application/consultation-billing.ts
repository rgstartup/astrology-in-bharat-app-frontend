import { type IExpert } from "@repo/lib";
import type { ChatSession } from "@/lib/types";
import type { ConsultationEndedPayload } from "@/realtime/types/consultation";
import type { useConsultation } from "@/realtime/hooks/use-consultation";
import { resolveChatRate, resolveModePrice } from "@/lib/pricing";

/**
 * Normalizes backend end reasons into client summary keys.
 *
 * @param reason - Raw reason string from socket or server.
 * @returns Clean reason token.
 */
export function normalizeEndReason(
  reason: string | undefined,
): string | undefined {
  if (!reason) return undefined;
  if (reason === "balance_exhausted") return "insufficient_balance";
  return reason;
}

/**
 * Computes session total cost using consumed amount or elapsed duration.
 *
 * @param consumed - Consumed amount reported by socket pause/verdict.
 * @param elapsedSecs - Total elapsed seconds from timer.
 * @param ratePerMin - Per-minute rate.
 * @returns Total charged amount.
 */
export function calculateSessionCost(
  consumed: number,
  elapsedSecs: number,
  ratePerMin: number,
): number {
  if (consumed > 0) return Math.round(consumed);
  if (elapsedSecs > 0 && ratePerMin > 0) {
    const minutes = Math.ceil(elapsedSecs / 60);
    return Math.round(minutes * ratePerMin);
  }
  return 0;
}

/**
 * Computes remaining wallet balance after deducting session cost.
 *
 * @param currentBalance - Starting wallet balance from authStore.
 * @param sessionCost - Total session cost.
 * @returns Net remaining balance (floored at 0).
 */
export function calculateRemainingBalance(
  currentBalance: number,
  sessionCost: number,
): number {
  const net = currentBalance - sessionCost;
  if (net < 0) return 0;
  return net;
}

type BuildSessionSummaryParams = {
  expertData: IExpert;
  endedVerdict: ConsultationEndedPayload | null;
  pausedState: ReturnType<typeof useConsultation>["paused"];
  elapsedTime: number;
  balance: number;
  isFree: boolean;
  freeMinutes: number;
};

/**
 * Builds the end-of-session billing summary.
 * Bills at the ended mode's rate (voice/video ends → that mode's rate),
 * not chat. Latches the last server-reported consumed amount so the
 * summary bills what the server actually charged even after pausedState clears.
 */
export function buildSessionSummary({
  expertData,
  endedVerdict,
  pausedState,
  elapsedTime,
  balance,
  isFree,
  freeMinutes,
}: BuildSessionSummaryParams): {
  chatRate: number;
  sessionSummary: ChatSession | null;
} {
  const chatRate = resolveChatRate(expertData);

  const endedMode = endedVerdict?.mode;
  const summaryRate =
    endedMode === "voice" || endedMode === "video"
      ? resolveModePrice(expertData, endedMode)
      : chatRate;

  const consumedAmount =
    pausedState !== null ? Number(pausedState.consumedAmount) || 0 : 0;

  if (!endedVerdict) {
    return { chatRate, sessionSummary: null };
  }

  const reason = normalizeEndReason(endedVerdict.reason);
  let finalDuration = elapsedTime;
  if (
    typeof endedVerdict.totalDurationSeconds === "number" &&
    endedVerdict.totalDurationSeconds > 0
  ) {
    finalDuration = endedVerdict.totalDurationSeconds;
  }

  const totalCost = calculateSessionCost(consumedAmount, finalDuration, summaryRate);
  const remainingBalance = calculateRemainingBalance(balance, totalCost);
  const durationMinutes = finalDuration > 0 ? finalDuration / 60 : 0;

  return {
    chatRate,
    sessionSummary: {
      status: "completed",
      reason,
      duration_seconds: finalDuration,
      durationMins: durationMinutes,
      pricePerMinute: summaryRate,
      price_per_minute: summaryRate,
      totalCost,
      total_cost: totalCost,
      remainingBalance,
      isFree,
      is_free: isFree,
      freeMinutes,
    } as unknown as ChatSession,
  };
}

import type { ConsultationBudgetTickPayload } from "@/realtime/types/consultation";

export type CalculateTimerParams = {
  maxMinutes: number | null;
  startedAt: string | null;
  /** Pre-anchor consumed seconds carried forward across resumes; 0 on fresh starts. */
  baseSeconds?: number | null;
  /** Current clock ms (from useState/useEffect tick). */
  now: number;
  sessionStatus: string;
  paused: boolean;
  /** RTC session is live (voice/video). Timer stays paused until true; defaults true for chat. */
  voiceLive?: boolean;
  /** Authoritative 30s budget tick from server for periodic clock reconciliation. */
  budgetTick?: ConsultationBudgetTickPayload | null;
  /** Local timestamp ms when budgetTick was received. */
  tickReceivedAt?: number | null;
};

export type CalculateTimerResult = {
  elapsedTime: number;
  timeLeft: number | null;
  active: boolean;
};

/**
 * Pure timer math. Given the anchor (startedAt), carried base seconds, current `now`,
 * and any authoritative periodic budget tick (`budgetTick`), computes elapsed time
 * and time left. Reconciles clock drift between client and server every 30 seconds.
 *
 * @param params - Configuration parameters for the consultation timer.
 * @returns Reconciled elapsed time, time left, and whether timer is currently active.
 */
export function calculateTimer({
  maxMinutes,
  startedAt,
  baseSeconds,
  now,
  sessionStatus,
  paused,
  voiceLive = true,
  budgetTick,
  tickReceivedAt,
}: CalculateTimerParams): CalculateTimerResult {
  const active = sessionStatus === "active" && !paused && voiceLive;

  // If an authoritative 30s tick from server is present, reconcile against it directly.
  if (budgetTick && typeof budgetTick.elapsedSeconds === "number") {
    const elapsedSinceTick =
      active && typeof tickReceivedAt === "number" && !isNaN(tickReceivedAt)
        ? Math.max(0, Math.floor((now - tickReceivedAt) / 1000))
        : 0;
    const elapsedSeconds = budgetTick.elapsedSeconds + elapsedSinceTick;
    const totalMinutes =
      typeof maxMinutes === "number"
        ? maxMinutes
        : typeof budgetTick.maxMinutes === "number"
          ? budgetTick.maxMinutes
          : null;
    const totalSeconds = totalMinutes !== null ? totalMinutes * 60 : null;
    const timeLeft =
      totalSeconds !== null
        ? Math.max(0, totalSeconds - elapsedSeconds)
        : typeof budgetTick.remainingSeconds === "number"
          ? Math.max(0, budgetTick.remainingSeconds - elapsedSinceTick)
          : null;

    return { elapsedTime: elapsedSeconds, timeLeft, active };
  }

  // Fallback before the first 30s tick arrives: compute from anchor and base seconds.
  const anchorMs = startedAt ? new Date(startedAt).getTime() : NaN;
  const hasAnchor = startedAt !== null && !isNaN(anchorMs);
  const base =
    typeof baseSeconds === "number" && !isNaN(baseSeconds)
      ? Math.max(0, Math.floor(baseSeconds))
      : 0;

  const elapsedSeconds = hasAnchor
    ? base + Math.max(0, Math.floor((now - anchorMs) / 1000))
    : 0;
  const totalSeconds = typeof maxMinutes === "number" ? maxMinutes * 60 : null;
  const timeLeft =
    totalSeconds === null || !hasAnchor
      ? null
      : Math.max(0, totalSeconds - elapsedSeconds);

  return { elapsedTime: elapsedSeconds, timeLeft, active };
}

type CalculateTimerParams = {
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
};

type CalculateTimerResult = {
  elapsedTime: number;
  timeLeft: number | null;
  active: boolean;
};

/**
 * Pure timer math. Given the anchor (startedAt), carried base seconds, and
 * current `now`, computes elapsed time and time left. Callers drive `now`
 * via an interval effect; this function has no React dependencies.
 */
export function calculateTimer({
  maxMinutes,
  startedAt,
  baseSeconds,
  now,
  sessionStatus,
  paused,
  voiceLive = true,
}: CalculateTimerParams): CalculateTimerResult {
  const anchorMs = startedAt ? new Date(startedAt).getTime() : NaN;
  const hasAnchor = startedAt !== null && !isNaN(anchorMs);
  const active = sessionStatus === "active" && !paused && voiceLive;
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

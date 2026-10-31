"use client";

import { useEffect, useState } from "react";

interface UseRoomTimerInput {
  maxMinutes: number | null;
  startedAt: string | null;
  /** Pre-anchor consumed seconds carried forward across resumes; 0 on fresh starts. */
  baseSeconds?: number | null;
  sessionStatus: string;
  paused: boolean;
  /** RTC session is live (voice/video). Timer stays paused until true; defaults true for chat. */
  voiceLive?: boolean;
}

/**
 * Live budget countdown. `startedAt` is the server anchor (start or last
 * resume), `baseSeconds` the pre-anchor consumption, `maxMinutes` the
 * affordable budget. Ticks locally every second for display; the backend is
 * the only authority that pauses a consultation when the budget is exhausted.
 */
export const useRoomTimer = ({
  maxMinutes,
  startedAt,
  baseSeconds,
  sessionStatus,
  paused,
  voiceLive = true,
}: UseRoomTimerInput) => {
  const [now, setNow] = useState(() => Date.now());

  const anchorMs = startedAt ? new Date(startedAt).getTime() : NaN;
  const hasAnchor = startedAt !== null && !isNaN(anchorMs);
  const active = sessionStatus === "active" && !paused && voiceLive;
  const base = typeof baseSeconds === "number" && !isNaN(baseSeconds) ? Math.max(0, Math.floor(baseSeconds)) : 0;

  useEffect(() => {
    // A backend resume provides a new anchor and carried elapsed base. Rebase
    // the display clock immediately instead of waiting for the next interval.
    setNow(Date.now());
  }, [startedAt, base]);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [active]);

  const elapsedSeconds = hasAnchor
    ? base + Math.max(0, Math.floor((now - anchorMs) / 1000))
    : 0;
  const totalSeconds = typeof maxMinutes === "number" ? maxMinutes * 60 : null;
  const timeLeft =
    totalSeconds === null || !hasAnchor ? null : Math.max(0, totalSeconds - elapsedSeconds);

  return { elapsedTime: elapsedSeconds, timeLeft };
};

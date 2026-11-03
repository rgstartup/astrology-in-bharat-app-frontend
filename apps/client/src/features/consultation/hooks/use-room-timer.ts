"use client";

import { useEffect, useState } from "react";
import { calculateTimer } from "../application/consultation-timer";

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

  // Rebase the display clock immediately when the anchor or base changes.
  useEffect(() => {
    setNow(Date.now());
  }, [startedAt, baseSeconds]);

  const { active } = calculateTimer({
    maxMinutes,
    startedAt,
    baseSeconds,
    now,
    sessionStatus,
    paused,
    voiceLive,
  });

  // Tick the clock every second while the timer is active.
  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [active]);

  const { elapsedTime, timeLeft } = calculateTimer({
    maxMinutes,
    startedAt,
    baseSeconds,
    now,
    sessionStatus,
    paused,
    voiceLive,
  });

  return { elapsedTime, timeLeft };
};

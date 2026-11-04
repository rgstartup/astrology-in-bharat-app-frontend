"use client";

import { useEffect, useRef, useState } from "react";
import type { ConsultationBudgetTickPayload } from "@/realtime/types/consultation";
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
  /** Authoritative 30-second budget tick from the server. */
  budgetTick?: ConsultationBudgetTickPayload | null;
}

/**
 * Live budget countdown. `startedAt` is the server anchor (start or last
 * resume), `baseSeconds` the pre-anchor consumption, `maxMinutes` the
 * affordable budget. Reconciles authoritative clock state via periodic 30s
 * `budgetTick` events from the server. Ticks locally every second for display.
 */
export const useRoomTimer = ({
  maxMinutes,
  startedAt,
  baseSeconds,
  sessionStatus,
  paused,
  voiceLive = true,
  budgetTick,
}: UseRoomTimerInput) => {
  const [now, setNow] = useState(() => Date.now());
  const tickReceivedAtRef = useRef<number | null>(null);

  // Update tick received timestamp and rebase display clock whenever a fresh tick arrives.
  useEffect(() => {
    if (budgetTick) {
      tickReceivedAtRef.current = Date.now();
      setNow(Date.now());
    }
  }, [budgetTick]);

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
    budgetTick,
    tickReceivedAt: tickReceivedAtRef.current,
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
    budgetTick,
    tickReceivedAt: tickReceivedAtRef.current,
  });

  return { elapsedTime, timeLeft };
};

"use client";

import { useEffect, useState } from "react";
import { useInterval } from "@/hooks/external-hooks";

/**
 * Formats an elapsed duration as mm:ss (hours fold into minutes).
 *
 * @param totalSeconds - Elapsed seconds, clamped at zero.
 * @returns Clock string in the form `mm:ss`.
 */
export function formatTrackerElapsed(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Ticks once per second from a session start timestamp.
 *
 * @param startedAt - ISO start timestamp; null renders `00:00`.
 * @returns Formatted elapsed string for display.
 */
export function useTrackerElapsed(startedAt: string | null): string {
  const compute = (): number => {
    if (!startedAt) return 0;
    const start = new Date(startedAt).getTime();
    if (Number.isNaN(start)) return 0;
    return Math.max(0, (Date.now() - start) / 1000);
  };

  const [elapsed, setElapsed] = useState<number>(() => compute());

  useEffect(() => {
    setElapsed(compute());
  }, [startedAt]);
  useInterval(() => setElapsed(compute()), startedAt ? 1000 : null);

  return formatTrackerElapsed(elapsed);
}

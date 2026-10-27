"use client";

import { useEffect, useState } from "react";
import { useInterval } from "@/hooks/external-hooks";
import { useConsultationRoomStore } from "@/store/consultationRoomStore";

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
 * Ticks once per second using the global consultation room store
 * (single source of truth written by the room component).
 * 
 * @returns Formatted elapsed string for display.
 */
export function useTrackerElapsed(): string {
  const elapsedSeconds = useConsultationRoomStore((s) => s.elapsedSeconds);
  const paused = useConsultationRoomStore((s) => s.paused);

  const [elapsed, setElapsed] = useState<number>(elapsedSeconds);

  // Sync with global elapsed time when it changes
  useEffect(() => {
    setElapsed(elapsedSeconds);
  }, [elapsedSeconds]);

  // Tick locally only if not paused
  useInterval(() => {
    if (paused) return;
    setElapsed((prev) => prev + 1);
  }, !paused ? 1000 : null);

  return formatTrackerElapsed(elapsed);
}

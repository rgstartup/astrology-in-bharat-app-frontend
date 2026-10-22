"use client";

import { useEffect, useRef, useState } from "react";

interface UseRoomTimerInput {
  maxMinutes: number | null;
  startedAt: string | null;
  /** Pre-anchor consumed seconds carried forward across resumes; 0 on fresh starts. */
  baseSeconds?: number | null;
  sessionStatus: string;
  paused: boolean;
  onExhausted: () => void;
}

/**
 * Live budget countdown. `startedAt` is the server anchor (start or last
 * resume), `baseSeconds` the pre-anchor consumption, `maxMinutes` the
 * affordable budget. Ticks locally every second. Fires `onExhausted` once
 * when the budget hits zero so the room can ask the server to pause.
 */
export const useRoomTimer = ({
  maxMinutes,
  startedAt,
  baseSeconds,
  sessionStatus,
  paused,
  onExhausted,
}: UseRoomTimerInput) => {
  const [now, setNow] = useState(() => Date.now());
  const exhaustedRef = useRef(false);
  const onExhaustedRef = useRef(onExhausted);
  onExhaustedRef.current = onExhausted;

  const anchorMs = startedAt ? new Date(startedAt).getTime() : NaN;
  const hasAnchor = startedAt !== null && !isNaN(anchorMs);
  const active = sessionStatus === "active" && !paused;
  const base = typeof baseSeconds === "number" && !isNaN(baseSeconds) ? Math.max(0, Math.floor(baseSeconds)) : 0;

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [active]);

  useEffect(() => {
    if (hasAnchor) exhaustedRef.current = false;
  }, [startedAt, base]); // eslint-disable-line react-hooks/exhaustive-deps

  const elapsedSeconds = hasAnchor
    ? base + Math.max(0, Math.floor((now - anchorMs) / 1000))
    : 0;
  const totalSeconds = typeof maxMinutes === "number" ? maxMinutes * 60 : null;
  const timeLeft =
    totalSeconds === null || !hasAnchor ? null : Math.max(0, totalSeconds - elapsedSeconds);

  useEffect(() => {
    if (!active || timeLeft !== 0 || totalSeconds === null) return;
    if (exhaustedRef.current) return;
    exhaustedRef.current = true;
    onExhaustedRef.current();
  }, [active, timeLeft, totalSeconds]);

  return { elapsedTime: elapsedSeconds, timeLeft };
};

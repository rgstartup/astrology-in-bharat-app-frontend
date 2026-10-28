"use client";

import { useEffect, useState } from "react";
import { realtimeSocket } from "@/realtime/socket";
import { CONSULTATION_EVENTS } from "@/realtime/topics/consultation";

/** Lifecycle socket events that can change the timers' and dock's identity. */
const REMOUNT_EVENTS = [
  CONSULTATION_EVENTS.EVENTS.ACCEPTED,
  CONSULTATION_EVENTS.EVENTS.STARTED,
  CONSULTATION_EVENTS.EVENTS.RESUMED,
] as const;

/**
 * Bumps a revision counter for every consultation lifecycle socket event so
 * keyed subtrees (session timers, voice dock) remount fresh in realtime.
 *
 * The room's aggregate hooks own the state, but a remount keyed on this
 * counter guarantees the presentation-level timer and dock components
 * re-initialize the moment the verdict/start arrives, even when the payload
 * path (budget/state hooks) is still settling.
 *
 * @returns Monotonic revision number; use as a React `key`.
 */
export function useRoomRevision(): number {
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const socket = realtimeSocket();
    const bump = () => setRevision((r) => r + 1);
    for (const event of REMOUNT_EVENTS) socket.on(event, bump);
    return () => {
      for (const event of REMOUNT_EVENTS) socket.off(event, bump);
    };
  }, []);
  return revision;
}

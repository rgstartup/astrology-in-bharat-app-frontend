"use client";

import { useEffect } from "react";
import { type IExpert } from "@repo/lib";
import { useConsultationTrackerStore } from "@/store/consultationTrackerStore";

type RoomTrackerSyncParams = {
  consultationId: number | null;
  sessionId: string | null;
  expertData: IExpert;
  liveStartedAt: string | null;
  acceptedStartedAt: string | null;
  paused: boolean;
  ended: boolean;
};

/**
 * Keeps the global floating tracker in sync while the room is mounted:
 * authoritative expert identity + billing anchor on entry, paused flag
 * on budget hold, and session cleanup once the consultation ends.
 */
export function useRoomTrackerSync({
  consultationId,
  sessionId,
  expertData,
  liveStartedAt,
  acceptedStartedAt,
  paused,
  ended,
}: RoomTrackerSyncParams) {
  useEffect(() => {
    if (consultationId === null) return;
    const tracker = useConsultationTrackerStore.getState();
    if (ended) {
      tracker.clearSession();
      return;
    }
    const expertName =
      (expertData as { name?: string } | null)?.name ?? "Expert";
    const expertAvatar =
      (expertData as { avatar?: string | null } | null)?.avatar ?? null;
    const expertId = (expertData as { id?: number | string } | null)?.id;
    if (expertId === undefined || expertId === null) return;
    const parsedSessionId = sessionId !== null ? Number(sessionId) : NaN;
    const anchor =
      liveStartedAt ??
      acceptedStartedAt ??
      tracker.session?.startedAt ??
      new Date().toISOString();
    tracker.setSession({
      consultationId,
      sessionId: Number.isNaN(parsedSessionId) ? null : parsedSessionId,
      expertId: String(expertId),
      expertName,
      expertAvatar,
      startedAt: anchor,
      paused,
    });
  }, [
    consultationId,
    sessionId,
    expertData,
    liveStartedAt,
    acceptedStartedAt,
    paused,
    ended,
  ]);
}

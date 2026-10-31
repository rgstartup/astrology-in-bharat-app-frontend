"use client";

import { useEffect } from "react";
import type { IExpert } from "@repo/lib";
import type { ConsultationMode } from "@/realtime/types/consultation";
import type { ConsultationEndedPayload } from "@/realtime/types/consultation";
import type { useConsultation } from "@/realtime/hooks/use-consultation";
import type { RoomSessionStatus } from "../hooks/use-room-verdict";
import { useConsultationRoomStore } from "../stores/consultation-room.store";

interface RoomStoreSyncParams {
  roomConsultationId: number | null;
  sessionId: string | null;
  roomMode: ConsultationMode;
  expertData: IExpert;
  sessionStatus: RoomSessionStatus;
  maxMinutes: number | null;
  pausedState: ReturnType<typeof useConsultation>["paused"];
  endedVerdict: ConsultationEndedPayload | null;
  displayElapsedTime: number;
  displayTimeLeft: number;
}

/**
 * Synchronizes client consultation room state with the global room store
 * (single source of truth for both the active room and floating tracker).
 *
 * @param params - Room identity, timing, pause, and verdict parameters
 */
export function useRoomStoreSync({
  roomConsultationId,
  sessionId,
  roomMode,
  expertData,
  sessionStatus,
  maxMinutes,
  pausedState,
  endedVerdict,
  displayElapsedTime,
  displayTimeLeft,
}: RoomStoreSyncParams): void {
  const setConsultation = useConsultationRoomStore((s) => s.setConsultation);
  const setTimer = useConsultationRoomStore((s) => s.setTimer);
  const setPaused = useConsultationRoomStore((s) => s.setPaused);
  const setEnded = useConsultationRoomStore((s) => s.setEnded);

  const expertId = (expertData as { id?: number | string } | null)?.id;
  const expertName = (expertData as { name?: string } | null)?.name ?? "Expert";
  const expertAvatar =
    (expertData as { avatar?: string | null } | null)?.avatar ?? null;
  const parsedSessionId = sessionId !== null ? Number(sessionId) : NaN;

  // Sync consultation identity + status
  useEffect(() => {
    setConsultation({
      consultationId: roomConsultationId,
      sessionId: Number.isNaN(parsedSessionId) ? null : parsedSessionId,
      mode: roomMode,
      expertId: expertId ? String(expertId) : null,
      expertName,
      expertAvatar,
      sessionStatus,
      maxMinutes,
      paused: pausedState !== null,
      ended: endedVerdict !== null,
      endedVerdict: endedVerdict
        ? {
            totalDurationSeconds: endedVerdict.totalDurationSeconds,
            reason: endedVerdict.reason,
            endedBy: endedVerdict.endedBy,
          }
        : null,
    });
  }, [
    roomConsultationId,
    parsedSessionId,
    roomMode,
    expertId,
    expertName,
    expertAvatar,
    sessionStatus,
    maxMinutes,
    pausedState,
    endedVerdict,
    setConsultation,
  ]);

  // Sync timer
  useEffect(() => {
    setTimer(displayElapsedTime, displayTimeLeft);
  }, [displayElapsedTime, displayTimeLeft, setTimer]);

  // Sync paused
  useEffect(() => {
    setPaused(pausedState !== null);
  }, [pausedState, setPaused]);

  // Sync ended
  useEffect(() => {
    if (endedVerdict) {
      setEnded(true, {
        totalDurationSeconds: endedVerdict.totalDurationSeconds,
        reason: endedVerdict.reason,
        endedBy: endedVerdict.endedBy,
      });
    }
  }, [endedVerdict, setEnded]);
}

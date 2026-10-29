"use client";

import { useCallback, useEffect, useState } from "react";
import { realtimeSocket } from "@/realtime/socket";
import { CONSULTATION_EVENTS } from "@/realtime/topics/consultation";
import type { ConsultationMediaReadyPayload } from "@/realtime/types/consultation";

export type MediaActorType = "client" | "expert";

interface UseConsultationMediaParams {
  consultationId: number;
  actorType: MediaActorType;
}

interface UseConsultationMediaReturn {
  localReady: boolean;
  peerReady: boolean;
  bothReady: boolean;
  peerActorType: MediaActorType | null;
  setLocalReady: () => void;
  reset: () => void;
}

/**
 * Tracks bilateral Agora media readiness for a consultation room.
 *
 * Local readiness is set externally via `setLocalReady()` after the local
 * Agora `session.join()` succeeds and `mediaReady()` is emitted. Peer
 * readiness arrives via the `consultation:media_ready` broadcast from the
 * server. `bothReady` is true only when both sides report ready — this is
 * the signal that billing starts and the waiting lobby can retire.
 *
 * @param params - `consultationId` plus the local `actorType` ("client" or "expert").
 * @returns Readiness state plus a `setLocalReady()` setter and `reset()`.
 */
export const useConsultationMedia = (
  params: UseConsultationMediaParams,
): UseConsultationMediaReturn => {
  const { consultationId, actorType } = params;

  const [localReady, setLocalReadyState] = useState<boolean>(false);
  const [peerReady, setPeerReadyState] = useState<boolean>(false);
  const [peerActorType, setPeerActorType] = useState<MediaActorType | null>(null);

  const bothReady = localReady && peerReady;

  const setLocalReady = useCallback(() => {
    setLocalReadyState(true);
  }, []);

  const reset = useCallback(() => {
    setLocalReadyState(false);
    setPeerReadyState(false);
    setPeerActorType(null);
  }, []);

  useEffect(() => {
    if (!consultationId) return;
    const socket = realtimeSocket();

    const handleMediaReady = (payload: ConsultationMediaReadyPayload): void => {
      if (Number(payload.consultationId) !== consultationId) return;
      // Socket.IO `to(room).emit()` excludes the sender, so an echo of our
      // own readiness should never arrive — but guard defensively anyway.
      if (payload.actorType === actorType) return;
      console.log("[VoiceConsultation] media_ready received (peer)", {
        consultationId,
        peerActorType: payload.actorType,
        bothReady: payload.bothReady,
      });
      setPeerReadyState(true);
      setPeerActorType(payload.actorType);
    };

    const handleStarted = (): void => {
      // `consultation:started` is only broadcast by `orchestrator.start()`,
      // which runs on the second `media_ready` — so receiving it means both
      // sides are media-ready even if the sender never saw the echo.
      console.log("[VoiceConsultation] consultation:started received", {
        consultationId,
      });
      setPeerReadyState(true);
    };

    console.log("[VoiceConsultation] subscribing to media_ready/started", {
      consultationId,
      actorType,
    });
    socket.on(CONSULTATION_EVENTS.EVENTS.MEDIA_READY, handleMediaReady);
    socket.on(CONSULTATION_EVENTS.EVENTS.STARTED, handleStarted);

    return (): void => {
      socket.off(CONSULTATION_EVENTS.EVENTS.MEDIA_READY, handleMediaReady);
      socket.off(CONSULTATION_EVENTS.EVENTS.STARTED, handleStarted);
    };
  }, [consultationId, actorType]);

  return {
    localReady,
    peerReady,
    bothReady,
    peerActorType,
    setLocalReady,
    reset,
  };
};

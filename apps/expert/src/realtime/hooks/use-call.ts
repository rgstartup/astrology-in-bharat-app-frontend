"use client";

import { useCallback, useState } from "react";
import { useSocketEvents } from "@/realtime/hooks/use-socket-event";
import {
  MEDIA_EVENTS,
  endCall,
  joinCall,
  relayCallAnswer,
  relayCallOffer,
  relayIceCandidate,
} from "@/realtime/topics/call";
import { CONSULTATION_EVENTS } from "@/realtime/topics/consultation";
import type { CallEndedPayload, CallSignalPayload } from "@/realtime/types/call";
import type { ConsultationEndedPayload } from "@/realtime/types/consultation";

/**
 * Join a consultation's call room and stream signalling (offer / answer /
 * ICE / end). WebRTC plumbing stays with the caller.
 */
export const useCall = (consultationId?: number | string | null) => {
  const id = Number(consultationId);
  const isValidId = Boolean(id && !isNaN(id));
  const [offer, setOffer] = useState<CallSignalPayload | null>(null);
  const [answer, setAnswer] = useState<CallSignalPayload | null>(null);
  const [iceCandidate, setIceCandidate] = useState<CallSignalPayload | null>(null);
  const [ended, setEnded] = useState<CallEndedPayload | null>(null);

  const matches = useCallback(
    (payload: { consultationId?: number }) =>
      payload && Number(payload.consultationId) === id,
    [id],
  );

  const handleOffer = useCallback(
    (payload: CallSignalPayload) => {
      if (matches(payload)) setOffer(payload);
    },
    [matches],
  );

  const handleAnswer = useCallback(
    (payload: CallSignalPayload) => {
      if (matches(payload)) setAnswer(payload);
    },
    [matches],
  );

  const handleIceCandidate = useCallback(
    (payload: CallSignalPayload) => {
      if (matches(payload)) setIceCandidate(payload);
    },
    [matches],
  );

  const handleEnd = useCallback(
    (payload: ConsultationEndedPayload) => {
      if (matches(payload)) {
        setEnded({
          consultationId: payload.consultationId,
          endedBy: payload.endedBy,
          reason: payload.reason,
        });
      }
    },
    [matches],
  );

  const handleConnect = useCallback(() => {
    if (isValidId) {
      joinCall(id).catch(() => undefined);
    }
  }, [id, isValidId]);

  useSocketEvents(
    {
      [MEDIA_EVENTS.OFFER]: handleOffer,
      [MEDIA_EVENTS.ANSWER]: handleAnswer,
      [MEDIA_EVENTS.ICE_CANDIDATE]: handleIceCandidate,
      [CONSULTATION_EVENTS.EVENTS.ENDED]: handleEnd,
      connect: handleConnect,
    },
    isValidId,
  );

  const sendOffer = useCallback(
    (sdp: Record<string, unknown>) => {
      if (isValidId) relayCallOffer(id, sdp);
    },
    [id, isValidId],
  );

  const sendAnswer = useCallback(
    (sdp: Record<string, unknown>) => {
      if (isValidId) relayCallAnswer(id, sdp);
    },
    [id, isValidId],
  );

  const sendIceCandidate = useCallback(
    (candidate: Record<string, unknown>) => {
      if (isValidId) relayIceCandidate(id, candidate);
    },
    [id, isValidId],
  );

  const end = useCallback(
    (reason?: string) => {
      if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
      return endCall(id, reason);
    },
    [id, isValidId],
  );

  return { offer, answer, iceCandidate, ended, sendOffer, sendAnswer, sendIceCandidate, end };
};

export default useCall;

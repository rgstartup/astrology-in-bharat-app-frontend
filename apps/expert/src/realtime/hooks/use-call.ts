"use client";

import { useCallback, useEffect, useState } from "react";
import { realtimeSocket } from "@/realtime/socket";
import {
  CALL_EVENTS,
  endCall,
  joinCall,
  relayCallAnswer,
  relayCallOffer,
  relayIceCandidate,
} from "@/realtime/topics/call";
import type { CallEndedPayload, CallSignalPayload } from "@/realtime/types/call";

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

  useEffect(() => {
    if (!isValidId) return;
    const socket = realtimeSocket();

    const matches = (payload: { consultationId?: number }) =>
      payload && Number(payload.consultationId) === id;

    const handleOffer = (payload: CallSignalPayload) => {
      if (matches(payload)) setOffer(payload);
    };
    const handleAnswer = (payload: CallSignalPayload) => {
      if (matches(payload)) setAnswer(payload);
    };
    const handleIceCandidate = (payload: CallSignalPayload) => {
      if (matches(payload)) setIceCandidate(payload);
    };
    const handleEnd = (payload: CallEndedPayload) => {
      if (matches(payload)) setEnded(payload);
    };

    const handleConnect = () => {
      joinCall(id).catch(() => undefined);
    };

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    socket.on(CALL_EVENTS.OFFER, handleOffer);
    socket.on(CALL_EVENTS.ANSWER, handleAnswer);
    socket.on(CALL_EVENTS.ICE_CANDIDATE, handleIceCandidate);
    socket.on(CALL_EVENTS.END, handleEnd);
    socket.on("connect", handleConnect);

    return () => {
      socket.off(CALL_EVENTS.OFFER, handleOffer);
      socket.off(CALL_EVENTS.ANSWER, handleAnswer);
      socket.off(CALL_EVENTS.ICE_CANDIDATE, handleIceCandidate);
      socket.off(CALL_EVENTS.END, handleEnd);
      socket.off("connect", handleConnect);
    };
  }, [id, isValidId]);

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

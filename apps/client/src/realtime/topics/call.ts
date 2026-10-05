import { emitWithAck, realtimeSocket } from "@/realtime/socket";
import type { JoinCallAck } from "@/realtime/types/call";

// Canonical backend event names (SOCKET_EVENTS.CALL).
export const CALL_EVENTS = {
  JOIN: "call:join",
  OFFER: "call:offer",
  ANSWER: "call:answer",
  ICE_CANDIDATE: "call:ice_candidate",
  ACCEPT: "call:accept",
  REJECT: "call:reject",
  END: "call:end",
  INCOMING: "call:incoming",
} as const;

export const joinCall = (consultationId: number): Promise<JoinCallAck> =>
  emitWithAck<JoinCallAck>(CALL_EVENTS.JOIN, { consultationId });

export const endCall = (
  consultationId: number,
  reason?: string,
): Promise<JoinCallAck> =>
  emitWithAck<JoinCallAck>(CALL_EVENTS.END, { consultationId, reason });

/** Signalling relays are fire-and-forget (no ack from the backend). */
const relaySignal = (event: string, payload: Record<string, unknown>): void => {
  const active = realtimeSocket();
  if (!active.connected) return;
  active.emit(event, payload);
};

export const relayCallOffer = (
  consultationId: number,
  offer: Record<string, unknown>,
): void => relaySignal(CALL_EVENTS.OFFER, { consultationId, offer });

export const relayCallAnswer = (
  consultationId: number,
  answer: Record<string, unknown>,
): void => relaySignal(CALL_EVENTS.ANSWER, { consultationId, answer });

export const relayIceCandidate = (
  consultationId: number,
  candidate: Record<string, unknown>,
): void =>
  relaySignal(CALL_EVENTS.ICE_CANDIDATE, { consultationId, candidate });

import { emitWithAck, realtimeSocket } from "@/realtime/socket";
import { CONSULTATION_EVENTS } from "@/realtime/topics/consultation";
import type { JoinCallAck } from "@/realtime/types/call";
import type { ConsultationActionAck } from "@/realtime/types/consultation";

// Canonical backend event names: membership rides on consultation:join,
// hangup rides on consultation:end, signalling on consultation:media:*.
export const MEDIA_EVENTS = {
  OFFER: "consultation:media:offer",
  ANSWER: "consultation:media:answer",
  ICE_CANDIDATE: "consultation:media:ice_candidate",
} as const;

export const joinCall = (consultationId: number): Promise<JoinCallAck> =>
  emitWithAck<JoinCallAck>(CONSULTATION_EVENTS.COMMANDS.JOIN, {
    consultationId,
    mode: "voice",
  });

export const endCall = (
  consultationId: number,
  reason?: string,
): Promise<ConsultationActionAck> =>
  emitWithAck<ConsultationActionAck>(CONSULTATION_EVENTS.COMMANDS.END, {
    consultationId,
    reason,
  });

/** Signalling relays are fire-and-forget (no ack from the backend). */
const relaySignal = (event: string, payload: Record<string, unknown>): void => {
  const active = realtimeSocket();
  if (!active.connected) return;
  active.emit(event, payload);
};

export const relayCallOffer = (
  consultationId: number,
  offer: Record<string, unknown>,
): void => relaySignal(MEDIA_EVENTS.OFFER, { consultationId, offer });

export const relayCallAnswer = (
  consultationId: number,
  answer: Record<string, unknown>,
): void => relaySignal(MEDIA_EVENTS.ANSWER, { consultationId, answer });

export const relayIceCandidate = (
  consultationId: number,
  candidate: Record<string, unknown>,
): void =>
  relaySignal(MEDIA_EVENTS.ICE_CANDIDATE, { consultationId, candidate });

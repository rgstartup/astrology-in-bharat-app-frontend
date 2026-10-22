"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { realtimeSocket } from "@/realtime/socket";
import {
  acceptConsultation,
  rejectConsultation,
  CONSULTATION_EVENTS,
} from "@/realtime/topics/consultation";
import type { ChatIncomingPayload } from "@/realtime/types/chat";

export interface ExpertVoiceToken {
  token: string | null;
  tokenExpiresAt: string | null;
  channelName: string | null;
}

/** Listen for incoming consultation requests; accept / reject call orchestrator directly. */
export const useChatIncoming = () => {
  const [pending, setPending] = useState<ChatIncomingPayload[]>([]);
  const [voiceToken, setVoiceToken] = useState<ExpertVoiceToken>({
    token: null,
    tokenExpiresAt: null,
    channelName: null,
  });

  useEffect(() => {
    const socket = realtimeSocket();
    const onIncoming = (p: ChatIncomingPayload) => {
      if (p?.consultationId == null) return;
      // Accept-time voice token arrives on the incoming payload for voice/video.
      if (p.token) {
        setVoiceToken({
          token: p.token,
          tokenExpiresAt: p.tokenExpiresAt ?? null,
          channelName: p.channelName ?? null,
        });
      }
      setPending((prev) =>
        prev.some((q) => q.consultationId === p.consultationId)
          ? prev
          : [...prev, p],
      );
    };
    // Request settled elsewhere (client cancel, timer/cron expiry, another
    // device) — drop the card.
    const onSettled = (p: { consultationId: number | string }) => {
      if (p?.consultationId == null) return;
      setPending((prev) =>
        prev.filter((q) => q.consultationId !== Number(p.consultationId)),
      );
    };

    socket.on(CONSULTATION_EVENTS.EVENTS.INCOMING, onIncoming);
    socket.on(CONSULTATION_EVENTS.EVENTS.ACCEPTED, onSettled);
    socket.on(CONSULTATION_EVENTS.EVENTS.REJECTED, onSettled);
    socket.on(CONSULTATION_EVENTS.EVENTS.CANCELLED, onSettled);

    return () => {
      socket.off(CONSULTATION_EVENTS.EVENTS.INCOMING, onIncoming);
      socket.off(CONSULTATION_EVENTS.EVENTS.ACCEPTED, onSettled);
      socket.off(CONSULTATION_EVENTS.EVENTS.REJECTED, onSettled);
      socket.off(CONSULTATION_EVENTS.EVENTS.CANCELLED, onSettled);
    };
  }, []);

  const router = useRouter();

  const dismiss = useCallback((consultationId: number) => {
    setPending((prev) => prev.filter((p) => p.consultationId !== consultationId));
  }, []);

  const accept = useCallback(
    async (consultationId: number, sessionId: number | null, autoRedirect = true) => {
      const ack = await acceptConsultation(consultationId);
      if (autoRedirect) {
        dismiss(consultationId);
      }
      if (ack.status === "accepted") {
        // Accept-time voice token comes back on the accept ack.
        if (ack.token) {
          setVoiceToken({
            token: ack.token,
            tokenExpiresAt: ack.tokenExpiresAt ?? null,
            channelName: ack.channelName ?? null,
          });
        }
        if (autoRedirect) {
          router.push(`/dashboard/consultations/${consultationId}`);
        }
      }
      return ack;
    },
    [dismiss, router],
  );

  const reject = useCallback(
    async (consultationId: number) => {
      await rejectConsultation(consultationId, "expert_rejected");
      dismiss(consultationId);
    },
    [dismiss],
  );

  return { pending, accept, reject, dismiss, voiceToken };
};

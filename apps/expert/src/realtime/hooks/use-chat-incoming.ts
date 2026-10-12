"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { realtimeSocket } from "@/realtime/socket";
import {
  acceptConsultation,
  rejectConsultation,
  CONSULTATION_EVENTS,
} from "@/realtime/topics/consultation";
import { CHAT_EVENTS } from "@/realtime/topics/chat";
import type { ChatIncomingPayload } from "@/realtime/types/chat";

/** Listen for incoming consultation requests; accept / reject call orchestrator directly. */
export const useChatIncoming = () => {
  const [pending, setPending] = useState<ChatIncomingPayload[]>([]);

  useEffect(() => {
    const socket = realtimeSocket();
    const onIncoming = (p: ChatIncomingPayload) => {
      if (p?.consultationId == null) return;
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

    socket.on(CHAT_EVENTS.INCOMING, onIncoming);
    socket.on(CONSULTATION_EVENTS.EVENTS.INCOMING, onIncoming);
    socket.on(CHAT_EVENTS.ACCEPTED, onSettled);
    socket.on(CONSULTATION_EVENTS.EVENTS.ACCEPTED, onSettled);
    socket.on(CHAT_EVENTS.REJECTED, onSettled);
    socket.on(CONSULTATION_EVENTS.EVENTS.REJECTED, onSettled);
    socket.on(CONSULTATION_EVENTS.EVENTS.CANCELLED, onSettled);

    return () => {
      socket.off(CHAT_EVENTS.INCOMING, onIncoming);
      socket.off(CONSULTATION_EVENTS.EVENTS.INCOMING, onIncoming);
      socket.off(CHAT_EVENTS.ACCEPTED, onSettled);
      socket.off(CONSULTATION_EVENTS.EVENTS.ACCEPTED, onSettled);
      socket.off(CHAT_EVENTS.REJECTED, onSettled);
      socket.off(CONSULTATION_EVENTS.EVENTS.REJECTED, onSettled);
      socket.off(CONSULTATION_EVENTS.EVENTS.CANCELLED, onSettled);
    };
  }, []);

  const router = useRouter();

  const dismiss = useCallback((consultationId: number) => {
    setPending((prev) => prev.filter((p) => p.consultationId !== consultationId));
  }, []);

  const accept = useCallback(
    async (consultationId: number, sessionId: number | null) => {
      const ack = await acceptConsultation(consultationId);
      dismiss(consultationId);
      if (ack.status === "accepted" && sessionId != null) {
        router.push(`/dashboard/chat/${sessionId}?consultationId=${consultationId}`);
      }
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

  return { pending, accept, reject, dismiss };
};

"use client";

import { useCallback, useEffect, useState } from "react";
import { realtimeSocket } from "@/realtime/socket";
import {
  CHAT_EVENTS,
  acceptChat,
  rejectChat,
} from "@/realtime/topics/chat";
import type { ChatIncomingPayload } from "@/realtime/types/chat";

/** Listen for incoming chat requests; accept joins the armed room, reject notifies the client. */
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
    socket.on(CHAT_EVENTS.INCOMING, onIncoming);
    return () => {
      socket.off(CHAT_EVENTS.INCOMING, onIncoming);
    };
  }, []);

  const dismiss = useCallback((consultationId: number) => {
    setPending((prev) => prev.filter((p) => p.consultationId !== consultationId));
  }, []);

  const accept = useCallback(
    async (consultationId: number) => {
      await acceptChat(consultationId);
      dismiss(consultationId);
    },
    [dismiss],
  );

  const reject = useCallback(
    async (consultationId: number) => {
      await rejectChat(consultationId);
      dismiss(consultationId);
    },
    [dismiss],
  );

  return { pending, accept, reject, dismiss };
};

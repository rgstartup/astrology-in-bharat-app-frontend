"use client";

import { useCallback, useEffect, useState } from "react";
import { realtimeSocket } from "@/realtime/socket";
import {
  NOTIFICATION_EVENTS,
  subscribeNotifications,
} from "@/realtime/topics/notifications";
import { useConsultation } from "@/realtime/hooks/use-consultation";
import { useRoomBudget } from "@/realtime/hooks/use-room-budget";
import type { RealtimeNotification } from "@/realtime/types/notifications";

/**
 * Subscribes to the client's personal socket room `client:<clientId>` and
 * streams messages the backend emits there:
 * - consultation lifecycle events → `useConsultation(consultationId)`
 * - budget events → `useRoomBudget({ consultationId, ... })`
 * - `notification:new` — handled directly below
 *
 * The room is joined by the backend on authenticated connect
 * (`ClientRealtimeService.handleClientConnect`); this hook only listens.
 * No clientId argument is required — the authenticated socket already
 * identifies the client to the server.
 */
export const useClientRoom = (
  consultationId?: number | string | null,
) => {
  const id = consultationId != null ? Number(consultationId) : null;

  const consultation = useConsultation(consultationId);

  const budget = useRoomBudget({
    consultationId: id ?? null,
    decision: consultation.decision,
    joinStatus: consultation.consultationStatus,
    acceptedBudget: {
      maxMinutes: consultation.state?.maxMinutes ?? null,
      startedAt: consultation.state?.startedAt ?? null,
    },
    consultationState: consultation.state,
  });

  const [subscribed, setSubscribed] = useState(false);
  const [notification, setNotification] =
    useState<RealtimeNotification | null>(null);

  useEffect(() => {
    const socket = realtimeSocket();

    const handleNotification = (payload: RealtimeNotification) => {
      setNotification(payload);
    };

    const handleConnect = () => {
      subscribeNotifications()
        .then(() => setSubscribed(true))
        .catch(() => setSubscribed(false));
    };

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    socket.on(NOTIFICATION_EVENTS.NEW, handleNotification);
    socket.on("connect", handleConnect);

    return () => {
      socket.off(NOTIFICATION_EVENTS.NEW, handleNotification);
      socket.off("connect", handleConnect);
    };
  }, []);

  const clear = useCallback(() => {
    setNotification(null);
  }, []);

  return {
    ...consultation,
    ...budget,
    subscribed,
    notification,
    clear,
  };
};

"use client";

import { useEffect, useState } from "react";
import { realtimeSocket } from "@/realtime/socket";
import {
  NOTIFICATION_EVENTS,
  subscribeNotifications,
} from "@/realtime/topics/notifications";
import type { RealtimeNotification } from "@/realtime/types/notifications";

/**
 * Join the actor's private notification room and stream `notification:new`.
 * Requires auth; stays disconnected silently when anonymous.
 */
export const useNotifications = (enabled = true) => {
  const [subscribed, setSubscribed] = useState(false);
  const [latest, setLatest] = useState<RealtimeNotification | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const socket = realtimeSocket();

    const handleNew = (payload: RealtimeNotification) => {
      if (payload) setLatest(payload);
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

    socket.on(NOTIFICATION_EVENTS.NEW, handleNew);
    socket.on("connect", handleConnect);

    return () => {
      socket.off(NOTIFICATION_EVENTS.NEW, handleNew);
      socket.off("connect", handleConnect);
    };
  }, [enabled]);

  return { subscribed, latest };
};

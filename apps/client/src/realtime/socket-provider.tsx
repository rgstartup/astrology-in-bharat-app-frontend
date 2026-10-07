"use client";

import { useEffect } from "react";
import { getSocketTokenAction } from "@/actions/auth";
import { connectRealtimeSocket, realtimeSocket } from "@/realtime/socket";
import { PRESENCE_EVENTS } from "@/realtime/topics/presence";
import { ExpertClientStatus, type PresenceChangedEventPayload } from "@/realtime/types/presence";
import { usePresenceStore } from "@/store/presenceStore";
import { useExpertListStore } from "@/store/expertListStore";
import { useAuthStore } from "@/store/authStore";

/**
 * Singleton owner of the `/realtime` connection. Streams `presence:updated`
 * into the presence store and rehydrates room subscriptions on reconnect.
 * Reconnects with the session JWT post-login so authenticated topics
 * (chat/call) handshakes carry auth; guests stay on the anonymous socket.
 */
export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userId = useAuthStore((state) => state.user?.id ?? state.user?.public_id);

  useEffect(() => {
    const socket = realtimeSocket();

    const handlePresenceChanged = (payload: PresenceChangedEventPayload) => {
      usePresenceStore
        .getState()
        .setExpertStatus(payload.expertId, payload.status, payload.timestamp, payload.lastSeenAt);

      useExpertListStore
        .getState()
        .updateExpertAvailability(payload.expertId, payload.status === ExpertClientStatus.ONLINE);
    };

    const handleConnect = () => {
      console.info(`[realtime] connected to /realtime (${socket.id})`);
      usePresenceStore.getState().rehydrateSubscriptions();
    };

    socket.on(PRESENCE_EVENTS.UPDATED, handlePresenceChanged);
    // socket.io re-fires "connect" on every reconnection.
    socket.on("connect", handleConnect);

    let cancelled = false;
    if (isAuthenticated) {
      getSocketTokenAction()
        .then((token) => {
          if (!cancelled) connectRealtimeSocket(token);
        })
        .catch(() => {
          if (!cancelled) connectRealtimeSocket();
        });
    } else {
      connectRealtimeSocket();
    }

    return () => {
      cancelled = true;
      socket.off(PRESENCE_EVENTS.UPDATED, handlePresenceChanged);
      socket.off("connect", handleConnect);
    };
  }, [isAuthenticated, userId]);

  return children;
}

export default RealtimeProvider;

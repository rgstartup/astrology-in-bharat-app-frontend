"use client";

import { useEffect } from "react";
import { connectRealtimeSocket } from "@/realtime/socket";
import { PRESENCE_EVENTS } from "@/realtime/topics/presence";
import { ExpertClientStatus, type PresenceChangedEventPayload } from "@/realtime/types/presence";
import { usePresenceStore } from "@/store/presenceStore";
import { useExpertListStore } from "@/store/expertListStore";

/**
 * Singleton owner of the `/realtime` connection. Streams `presence:updated`
 * into the presence store and rehydrates room subscriptions on reconnect.
 */
export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const socket = connectRealtimeSocket();

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

    return () => {
      socket.off(PRESENCE_EVENTS.UPDATED, handlePresenceChanged);
      socket.off("connect", handleConnect);
    };
  }, []);

  return children;
}

export default RealtimeProvider;

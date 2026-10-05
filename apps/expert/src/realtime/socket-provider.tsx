"use client";

import { useEffect } from "react";
import { getSocketTokenAction } from "@/actions/auth";
import {
  connectRealtimeSocket,
  disconnectRealtimeSocket,
  realtimeSocket,
} from "@/realtime/socket";
import {
  emitPresenceHeartbeat,
  startPresenceHeartbeat,
  stopPresenceHeartbeat,
} from "@/realtime/topics/presence";
import { useAuthStore } from "@/store/auth.store";

/**
 * Singleton owner of the `/realtime` connection (expert app). Authenticates
 * with the expert JWT, drives the 30s presence heartbeat, and re-pulses on
 * tab visibility / window focus. Own presence updates arrive as
 * `presence:updated` on the auto-joined `expert:{id}` room.
 */
export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      stopPresenceHeartbeat();
      disconnectRealtimeSocket();
      return;
    }

    let cancelled = false;
    const socket = realtimeSocket();

    const handleConnect = () => {
      console.info(`[realtime] connected to /realtime (${socket.id})`);
      startPresenceHeartbeat();
    };

    const handleDisconnect = () => {
      stopPresenceHeartbeat();
    };

    const pulse = () => {
      emitPresenceHeartbeat().catch(() => undefined);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") pulse();
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    // Effect re-runs don't refire `connect` on an already-live socket —
    // restart the timer here so cleanup can never wedge it stopped.
    if (socket.connected) {
      startPresenceHeartbeat();
    }
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", pulse);

    getSocketTokenAction()
      .then((token) => {
        if (!cancelled) connectRealtimeSocket(token);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      stopPresenceHeartbeat();
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", pulse);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [isAuthenticated, user?.id]);

  return children;
}

export default RealtimeProvider;

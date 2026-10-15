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
import { ChatIncomingStack } from "@/realtime/components/chat-incoming";

/**
 * Singleton owner of the `/realtime` connection (expert app). Authenticates
 * with the expert JWT, drives the 30s presence heartbeat, and re-pulses on
 * tab visibility / window focus. Own presence updates arrive as
 * `presence:updated` on the auto-joined `expert:{id}` room. A dead-man poll
 * re-drives the connection with a fresh token if the socket is found dead —
 * socket.io retries forever, but a wedged manager or an expired JWT after a
 * long outage never recovers on its own.
 */
const DEAD_MAN_INTERVAL_MS = 30_000;
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

    /** Re-drive a dead socket with a fresh token; otherwise just pulse. */
    const repulse = () => {
      if (!socket.connected) {
        getSocketTokenAction()
          .then((token) => {
            if (!cancelled) connectRealtimeSocket(token);
          })
          .catch(() => undefined);
      } else {
        pulse();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      repulse();
    };

    const handleFocus = () => {
      repulse();
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    // Effect re-runs don't refire `connect` on an already-live socket —
    // restart the timer here so cleanup can never wedge it stopped.
    if (socket.connected) {
      startPresenceHeartbeat();
    }
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    getSocketTokenAction()
      .then((token) => {
        if (!cancelled) connectRealtimeSocket(token);
      })
      .catch(() => undefined);

    const deadManTimer = setInterval(() => {
      if (!cancelled) repulse();
    }, DEAD_MAN_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(deadManTimer);
      stopPresenceHeartbeat();
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [isAuthenticated, user?.id]);

  return (
    <>
      {children}
      <ChatIncomingStack />
    </>
  );
}

export default RealtimeProvider;

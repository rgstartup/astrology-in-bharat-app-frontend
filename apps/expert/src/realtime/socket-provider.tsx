"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Socket } from "socket.io-client";
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

export interface RealtimeContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextValue>({
  socket: null,
  isConnected: false,
});

/** Hook to access the shared realtime socket instance and reactive connection status. */
export const useRealtime = (): RealtimeContextValue => {
  return useContext(RealtimeContext);
};

/** Lightweight hook to query socket connectivity without listening to specific events. */
export const useRealtimeStatus = (): { isConnected: boolean } => {
  const { isConnected } = useRealtime();
  return { isConnected };
};

/**
 * Singleton owner of the `/realtime` connection (expert app). Authenticates
 * with the expert JWT, drives the 30s presence heartbeat, and re-pulses on
 * tab visibility / window focus. Own presence updates arrive as
 * `presence:updated` on the auto-joined `expert:{id}` room. A dead-man poll
 * re-drives the connection with a fresh token if the socket is found dead.
 *
 * Child components and hooks should NEVER invoke connect/disconnect directly;
 * they listen to events via `useSocketEvent` or `useSocketEvents`.
 */
const DEAD_MAN_INTERVAL_MS = 30_000;

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const [activeSocket, setActiveSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const socket = realtimeSocket();
    setActiveSocket(socket);
    setIsConnected(socket.connected);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsConnected(false);
      stopPresenceHeartbeat();
      disconnectRealtimeSocket();
      return;
    }

    let cancelled = false;
    const socket = realtimeSocket();

    const handleConnect = () => {
      console.info(`[realtime] connected to /realtime (${socket.id})`);
      setIsConnected(true);
      startPresenceHeartbeat();
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      stopPresenceHeartbeat();
    };

    const pulse = () => {
      emitPresenceHeartbeat().catch(() => undefined);
    };

    /** Re-drive a dead socket with a fresh token; otherwise just pulse. */
    const repulse = () => {
      if (!socket.connected) {
        setIsConnected(false);
        getSocketTokenAction()
          .then((token) => {
            if (!cancelled) connectRealtimeSocket(token);
          })
          .catch(() => undefined);
      } else {
        setIsConnected(true);
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
      setIsConnected(true);
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

  const contextValue = useMemo<RealtimeContextValue>(
    () => ({
      socket: activeSocket,
      isConnected,
    }),
    [activeSocket, isConnected],
  );

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
      <ChatIncomingStack />
    </RealtimeContext.Provider>
  );
}

export default RealtimeProvider;

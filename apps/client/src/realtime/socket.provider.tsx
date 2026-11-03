"use client";

import { useEffect } from "react";
import { getSocketTokenAction } from "@/actions/auth";
import { connectRealtimeSocket, realtimeSocket } from "@/realtime/socket";
import { usePresenceLifecycle, usePresenceSync } from "@/realtime/hooks/use-presence";
import { useAuthStore } from "@/store/authStore";

/**
 * Singleton owner of the `/realtime` connection. Owns only the connection
 * lifecycle (connect / disconnect / connect_error) and re-driving a dead
 * socket. All presence callbacks (presence:updated, isLive flag,
 * subscription rehydration, stale marking) are delegated to hooks.
 */
const DEAD_MAN_INTERVAL_MS = 30_000;

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Delegate presence callbacks to dedicated hooks so this provider owns
  // only connection events. usePresenceSync streams presence:updated into
  // the stores; usePresenceLifecycle manages isLive + rehydration on
  // connect/disconnect.
  usePresenceSync();
  usePresenceLifecycle();

  useEffect(() => {
    const socket = realtimeSocket();
    let cancelled = false;

    const connectWithAuth = () => {
      if (!isAuthenticated) connectRealtimeSocket();

      getSocketTokenAction()
        .then((token) => {
          if (!cancelled) connectRealtimeSocket(token);
        })
        .catch(() => {
          if (!cancelled) connectRealtimeSocket();
        });
    };

    const handleConnect = () => {
      console.info(`[realtime] connected to /realtime (${socket.id})`);
    };

    const handleDisconnect = () => {
      // Presence lifecycle hook handles stale marking.
    };

    const handleConnectError = (err: Error) => {
      console.error("[realtime] connect_error:", err.message);
    };

    const handleVisible = () => {
      if (document.visibilityState === "visible") connectWithAuth();
    };

    const handleFocus = () => {
      connectWithAuth();
    };

    // socket.io re-fires "connect" on every reconnection.
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    window.addEventListener("visibilitychange", handleVisible);
    window.addEventListener("focus", handleFocus);

    if (!socket.connected) connectWithAuth();

    // Dead-man poll: socket.io retries forever, but a wedged manager or an
    // expired JWT after a long outage never recovers on its own. Re-drive
    // the connection with a fresh token whenever the socket is found dead.
    // Gated on `!connected` so a healthy socket costs nothing.
    const deadManTimer = setInterval(() => {
      if (!cancelled && !socket.connected) {
        connectWithAuth();
      }
    }, DEAD_MAN_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(deadManTimer);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      window.removeEventListener("visibilitychange", handleVisible);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isAuthenticated]);

  return children;
}

export default RealtimeProvider;

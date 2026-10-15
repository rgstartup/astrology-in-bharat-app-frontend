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
/**
 * Grace period before a dead socket marks presence stale. Covers transient
 * blips / fast backend restarts (reconnect clears the timer, no flicker);
 * a genuinely down backend flips every card to Offline after this delay.
 */
const STALE_AFTER_MS = 8000;

/**
 * Dead-man poll: socket.io retries forever, but a wedged manager or an
 * expired JWT after a long outage never recovers on its own. Re-drive the
 * connection with a fresh token whenever the socket is found dead. Gated on
 * `!connected` so a healthy socket costs nothing.
 */
const DEAD_MAN_INTERVAL_MS = 30_000;

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userId = useAuthStore((state) => state.user?.id ?? state.user?.public_id);

  useEffect(() => {
    const socket = realtimeSocket();
    let cancelled = false;
    let staleTimer: ReturnType<typeof setTimeout> | null = null;

    const clearStaleTimer = () => {
      if (staleTimer !== null) {
        clearTimeout(staleTimer);
        staleTimer = null;
      }
    };

    const scheduleStale = () => {
      clearStaleTimer();
      staleTimer = setTimeout(() => {
        staleTimer = null;
        usePresenceStore.getState().setLive(false);
      }, STALE_AFTER_MS);
    };

    const handlePresenceChanged = (payload: PresenceChangedEventPayload) => {
      usePresenceStore
        .getState()
        .setExpertStatus(payload.expertId, payload.status, payload.timestamp, payload.lastSeenAt);

      useExpertListStore
        .getState()
        .updateExpertAvailability(payload.expertId, payload.status !== ExpertClientStatus.OFFLINE);
    };

    const connectWithAuth = () => {
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
    };

    const handleConnect = () => {
      console.info(`[realtime] connected to /realtime (${socket.id})`);
      clearStaleTimer();
      usePresenceStore.getState().setLive(true);
      usePresenceStore.getState().rehydrateSubscriptions();
    };

    // No `connect` also means no `disconnect` will fire (e.g. backend down
    // at page load), so arm the stale timer whenever we aren't connected.
    const handleDisconnect = () => {
      scheduleStale();
    };

    // Foreground recovery: re-arm a dead socket (retry budget exhausted
    // during backend downtime) so subscriptions resume; otherwise just
    // re-pull snapshots for ids whose earlier subscribe ack failed.
    const recover = () => {
      if (!socket.connected) {
        connectWithAuth();
        scheduleStale();
      } else {
        usePresenceStore.getState().rehydrateSubscriptions();
      }
    };

    const handleVisible = () => {
      if (document.visibilityState === "visible") recover();
    };

    const handleFocus = () => {
      recover();
    };

    socket.on(PRESENCE_EVENTS.UPDATED, handlePresenceChanged);
    // socket.io re-fires "connect" on every reconnection.
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    window.addEventListener("visibilitychange", handleVisible);
    window.addEventListener("focus", handleFocus);

    if (!socket.connected) scheduleStale();
    connectWithAuth();

    const deadManTimer = setInterval(() => {
      if (!cancelled && !socket.connected) {
        connectWithAuth();
      }
    }, DEAD_MAN_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearStaleTimer();
      clearInterval(deadManTimer);
      socket.off(PRESENCE_EVENTS.UPDATED, handlePresenceChanged);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      window.removeEventListener("visibilitychange", handleVisible);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isAuthenticated, userId]);

  return children;
}

export default RealtimeProvider;

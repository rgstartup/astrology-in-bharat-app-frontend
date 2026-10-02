"use client";

import React, { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import { getSocketTokenAction } from "@/actions/auth";
import {
  connectExpertPresence,
  disconnectExpertPresence,
  emitPresenceHeartbeat,
  presenceSocket,
} from "@/lib/socket";

const HEARTBEAT_INTERVAL_MS = 10_000; // 10 seconds (backend Redis TTL is 30s)

export interface IExpertPresenceProviderProps {
  children: React.ReactNode;
}

export function ExpertPresenceProvider({
  children,
}: IExpertPresenceProviderProps) {
  const { user, isAuthenticated } = useAuthStore();
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
      disconnectExpertPresence();
      return;
    }

    let isSubscribed = true;

    const setupPresence = async () => {
      try {
        const token = await getSocketTokenAction();
        if (!isSubscribed) return;

        connectExpertPresence(token);

        // Initial heartbeat after connection
        emitPresenceHeartbeat();

        // 10-second heartbeat interval
        if (heartbeatTimerRef.current) {
          clearInterval(heartbeatTimerRef.current);
        }
        heartbeatTimerRef.current = setInterval(() => {
          emitPresenceHeartbeat();
        }, HEARTBEAT_INTERVAL_MS);
      } catch (err) {
        console.error(
          "[ExpertPresenceProvider] Failed to initialize socket auth:",
          err,
        );
      }
    };

    setupPresence();

    // Tab wake-up & focus triggers
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        emitPresenceHeartbeat();
      }
    };

    const handleFocus = () => {
      emitPresenceHeartbeat();
    };

    const handleSocketConnect = () => {
      emitPresenceHeartbeat();
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    presenceSocket.on("connect", handleSocketConnect);

    return () => {
      isSubscribed = false;
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      presenceSocket.off("connect", handleSocketConnect);
    };
  }, [isAuthenticated, user]);

  return <>{children}</>;
}

export default ExpertPresenceProvider;

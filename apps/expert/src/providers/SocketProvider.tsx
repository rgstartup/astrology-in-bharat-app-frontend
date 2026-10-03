"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { useAuthStore } from "@/store/auth.store";
import { getSocketTokenAction } from "@/actions/auth";
import {
  getRootSocket,
  connectRootSocket,
  disconnectRootSocket,
  emitPresenceHeartbeat,
  startPresenceHeartbeat,
  stopPresenceHeartbeat,
  disconnectChatSocket,
  disconnectCallSocket,
  disconnectNotificationSocket,
  SOCKET_LISTEN_EVENTS,
} from "@/lib/socket";

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

export interface ISocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: ISocketProviderProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      stopPresenceHeartbeat();
      disconnectRootSocket();
      disconnectChatSocket();
      disconnectCallSocket();
      disconnectNotificationSocket();
      setIsConnected(false);
      setSocket(null);
      return;
    }

    let isSubscribed = true;
    const rootSocket = getRootSocket();
    setSocket(rootSocket);

    const onConnect = () => {
      if (isSubscribed) {
        setIsConnected(true);
        emitPresenceHeartbeat();
      }
    };

    const onDisconnect = () => {
      if (isSubscribed) {
        setIsConnected(false);
      }
    };

    rootSocket.on(SOCKET_LISTEN_EVENTS.CONNECT, onConnect);
    rootSocket.on(SOCKET_LISTEN_EVENTS.DISCONNECT, onDisconnect);

    const initSocket = async () => {
      try {
        const token = await getSocketTokenAction();
        if (!isSubscribed) return;

        connectRootSocket(token);
        startPresenceHeartbeat();
      } catch (err) {
        console.error("[SocketProvider] Failed to initialize socket auth:", err);
      }
    };

    initSocket();

    // Wake-up on tab visibility and window focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        emitPresenceHeartbeat();
      }
    };

    const handleFocus = () => {
      emitPresenceHeartbeat();
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      isSubscribed = false;
      stopPresenceHeartbeat();
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      rootSocket.off(SOCKET_LISTEN_EVENTS.CONNECT, onConnect);
      rootSocket.off(SOCKET_LISTEN_EVENTS.DISCONNECT, onDisconnect);
    };
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = (): SocketContextValue => {
  return useContext(SocketContext);
};

export default SocketProvider;

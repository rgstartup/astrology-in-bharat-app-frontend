import { io, type Socket } from "socket.io-client";
import { defaultSocketOptions, getBaseSocketUrl } from "./config";
import { SOCKET_LISTEN_EVENTS } from "./events";

let rootSocketInstance: Socket | null = null;

/**
 * Get or create the root Socket.io client instance.
 */
export const getRootSocket = (): Socket => {
  if (!rootSocketInstance) {
    rootSocketInstance = io(getBaseSocketUrl(), {
      ...defaultSocketOptions,
    });

    rootSocketInstance.on(SOCKET_LISTEN_EVENTS.CONNECT, () => {
      console.log(
        "[RootSocket] Authenticated connection established:",
        rootSocketInstance?.id,
      );
    });

    rootSocketInstance.on(SOCKET_LISTEN_EVENTS.CONNECT_ERROR, (error) => {
      console.warn("[RootSocket] Connection error:", error.message);
    });

    rootSocketInstance.on(SOCKET_LISTEN_EVENTS.DISCONNECT, (reason) => {
      console.log("[RootSocket] Disconnected:", reason);
    });
  }

  return rootSocketInstance;
};

/**
 * Check if the root socket is currently connected.
 */
export const isRootSocketConnected = (): boolean => {
  return rootSocketInstance?.connected ?? false;
};

/**
 * Connect the root socket with JWT token authentication.
 */
export const connectRootSocket = (token?: string | null): Socket => {
  const socket = getRootSocket();

  if (token) {
    socket.auth = { token };
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

/**
 * Disconnect the root socket instance.
 */
export const disconnectRootSocket = (): void => {
  if (rootSocketInstance && rootSocketInstance.connected) {
    rootSocketInstance.disconnect();
  }
};

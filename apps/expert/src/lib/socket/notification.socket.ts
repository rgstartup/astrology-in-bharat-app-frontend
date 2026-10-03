import { io, type Socket } from "socket.io-client";
import { defaultSocketOptions, getBaseSocketUrl } from "./config";
import { SOCKET_EMIT_EVENTS, SOCKET_LISTEN_EVENTS } from "./events";

let notificationSocketInstance: Socket | null = null;

/**
 * Get or initialize the notification socket client instance.
 */
export const getNotificationSocket = (): Socket => {
  if (!notificationSocketInstance) {
    notificationSocketInstance = io(`${getBaseSocketUrl()}/notifications`, {
      ...defaultSocketOptions,
    });

    notificationSocketInstance.on(SOCKET_LISTEN_EVENTS.CONNECT, () => {
      console.log(
        "[NotificationSocket] Connected to notifications namespace:",
        notificationSocketInstance?.id,
      );
    });

    notificationSocketInstance.on(SOCKET_LISTEN_EVENTS.CONNECT_ERROR, (error) => {
      console.warn("[NotificationSocket] Connection error:", error.message);
    });

    notificationSocketInstance.on(SOCKET_LISTEN_EVENTS.DISCONNECT, (reason) => {
      console.log("[NotificationSocket] Disconnected:", reason);
    });
  }

  return notificationSocketInstance;
};

/**
 * Connect the notification socket with auth token.
 */
export const connectNotificationSocket = (token?: string | null, id?: string | number): Socket => {
  const socket = getNotificationSocket();

  if (token) {
    socket.auth = { token };
  }

  if (!socket.connected) {
    socket.connect();
  }

  if (id) {
    socket.emit(SOCKET_EMIT_EVENTS.REGISTER_USER, { id });
  }

  return socket;
};

/**
 * Disconnect the notification socket.
 */
export const disconnectNotificationSocket = (): void => {
  if (notificationSocketInstance && notificationSocketInstance.connected) {
    notificationSocketInstance.disconnect();
  }
};

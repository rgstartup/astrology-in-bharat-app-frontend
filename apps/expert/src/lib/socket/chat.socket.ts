import { io, type Socket } from "socket.io-client";
import { defaultSocketOptions, getBaseSocketUrl } from "./config";
import { SOCKET_EMIT_EVENTS, SOCKET_LISTEN_EVENTS } from "./events";

export const chatSocket: Socket = io(`${getBaseSocketUrl()}/chat`, {
  ...defaultSocketOptions,
});

chatSocket.on(SOCKET_LISTEN_EVENTS.CONNECT, () => {
  console.log("[ChatSocket] Connected to /chat namespace:", chatSocket.id);
});

chatSocket.on(SOCKET_LISTEN_EVENTS.DISCONNECT, (reason) => {
  console.log("[ChatSocket] Disconnected:", reason);
});

chatSocket.on(SOCKET_LISTEN_EVENTS.CONNECT_ERROR, (err) => {
  console.error("[ChatSocket] Connection error:", err.message);
});

/**
 * Connect chat socket with auth token and register expert ID.
 */
export const connectChatSocket = (
  token?: string | null,
  expertId?: string | number,
): Socket => {
  if (token) {
    chatSocket.auth = { token };
  }

  if (!chatSocket.connected) {
    chatSocket.connect();
  }

  if (expertId) {
    chatSocket.emit(SOCKET_EMIT_EVENTS.REGISTER_EXPERT, { expert_id: expertId });
  }

  return chatSocket;
};

/**
 * Disconnect chat socket.
 */
export const disconnectChatSocket = (): void => {
  if (chatSocket.connected) {
    chatSocket.disconnect();
  }
};

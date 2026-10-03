import { io, type Socket } from "socket.io-client";
import { defaultSocketOptions, getBaseSocketUrl } from "./config";
import { SOCKET_EMIT_EVENTS, SOCKET_LISTEN_EVENTS } from "./events";

export const callSocket: Socket = io(`${getBaseSocketUrl()}/call`, {
  ...defaultSocketOptions,
});

callSocket.on(SOCKET_LISTEN_EVENTS.CONNECT, () => {
  console.log("[CallSocket] Connected to /call namespace:", callSocket.id);
});

callSocket.on(SOCKET_LISTEN_EVENTS.CONNECT_ERROR, (err) => {
  console.error("[CallSocket] Connection error:", err.message);
});

callSocket.on(SOCKET_LISTEN_EVENTS.DISCONNECT, (reason) => {
  console.warn("[CallSocket] Disconnected:", reason);
});

/**
 * Connect call socket with auth token and register expert ID.
 */
export const connectCallSocket = (
  token?: string | null,
  expertId?: string | number,
): Socket => {
  if (token) {
    callSocket.auth = { token };
  }

  if (!callSocket.connected) {
    callSocket.connect();
  }

  if (expertId) {
    callSocket.emit(SOCKET_EMIT_EVENTS.REGISTER_EXPERT, { expert_id: expertId });
  }

  return callSocket;
};

/**
 * Disconnect call socket.
 */
export const disconnectCallSocket = (): void => {
  if (callSocket.connected) {
    callSocket.disconnect();
  }
};

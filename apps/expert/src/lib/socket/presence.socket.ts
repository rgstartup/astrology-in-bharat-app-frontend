import { io, type Socket } from "socket.io-client";
import { defaultSocketOptions, getBaseSocketUrl } from "./config";
import type { HeartbeatAck } from "./types";

export const presenceSocket: Socket = io(getBaseSocketUrl(), {
  ...defaultSocketOptions,
});

presenceSocket.on("connect", () => {
  console.log(
    "[ExpertPresenceSocket] Connected to root namespace:",
    presenceSocket.id,
  );
});

presenceSocket.on("connect_error", (error) => {
  console.warn("[ExpertPresenceSocket] Connection error:", error.message);
});

presenceSocket.on("disconnect", (reason) => {
  console.log("[ExpertPresenceSocket] Disconnected:", reason);
});

/**
 * Connect the presence socket with JWT token authentication.
 */
export const connectExpertPresence = (token?: string | null): void => {
  if (token) {
    presenceSocket.auth = { token };
  }
  if (!presenceSocket.connected) {
    presenceSocket.connect();
  }
};

/**
 * Disconnect the presence socket.
 */
export const disconnectExpertPresence = (): void => {
  if (presenceSocket.connected) {
    presenceSocket.disconnect();
  }
};

/**
 * Emit a heartbeat for expert presence keeping active session alive in Redis (30s TTL).
 */
export const emitPresenceHeartbeat = (
  onAck?: (ack: HeartbeatAck) => void,
): void => {
  if (!presenceSocket.connected) return;

  presenceSocket.emit("heartbeat", (ack: HeartbeatAck) => {
    if (onAck && ack) {
      onAck(ack);
    }
  });
};

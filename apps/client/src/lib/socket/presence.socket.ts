import { io, type Socket } from "socket.io-client";
import { defaultSocketOptions, getBaseSocketUrl } from "./config";
import type { HeartbeatAck, SubscribeExpertPresenceAck } from "./types";

export const presenceSocket: Socket = io(getBaseSocketUrl(), {
  ...defaultSocketOptions,
});

presenceSocket.on("connect", () => {
  console.log("[PresenceSocket] Connected to root namespace:", presenceSocket.id);
});

presenceSocket.on("connect_error", (error) => {
  console.warn("[PresenceSocket] Connection error:", error.message);
});

/**
 * Join an expert's presence room and fetch their current status atomically.
 */
export const subscribeExpertPresence = (
  expertId: number,
  onAck?: (ack: SubscribeExpertPresenceAck) => void,
): void => {
  if (!expertId) return;
  if (!presenceSocket.connected) {
    presenceSocket.connect();
  }

  presenceSocket.emit(
    "subscribe_expert_presence",
    { expertId: Number(expertId) },
    (ack: SubscribeExpertPresenceAck) => {
      if (onAck && ack) {
        onAck(ack);
      }
    },
  );
};

/**
 * Emit a heartbeat for expert authentication sessions.
 * @access expert
 */
export const emitPresenceHeartbeat = (onAck?: (ack: HeartbeatAck) => void): void => {
  if (!presenceSocket.connected) return;
  presenceSocket.emit("heartbeat", (ack: HeartbeatAck) => {
    if (onAck && ack) {
      onAck(ack);
    }
  });
};

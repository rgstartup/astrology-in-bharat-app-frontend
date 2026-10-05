import { type Socket } from "socket.io-client";
import { getRootSocket } from "./core";
import { SOCKET_EMIT_EVENTS } from "./events";
import type { HeartbeatAck } from "./types";

let heartbeatTimer: NodeJS.Timeout | null = null;
const HEARTBEAT_INTERVAL_MS = 30_000;
// Matches backend PRESENCE_TTL (90s): 30s heartbeat keeps the key alive
// with 3x headroom; only a safety net since disconnect is explicit. // 10 seconds (backend Redis TTL is 30s)

/**
 * Access the presence socket (backed by the root socket instance).
 */
export const getPresenceSocket = (): Socket => getRootSocket();

/**
 * Emit a heartbeat for expert presence keeping active session alive in Redis (30s TTL).
 */
export const emitPresenceHeartbeat = (
  onAck?: (ack: HeartbeatAck) => void,
): void => {
  const socket = getRootSocket();
  if (!socket.connected) return;

  socket.emit(SOCKET_EMIT_EVENTS.HEARTBEAT, (ack: HeartbeatAck) => {
    if (onAck && ack) {
      onAck(ack);
    }
  });
};

/**
 * Start the recurring presence heartbeat.
 */
export const startPresenceHeartbeat = (): void => {
  stopPresenceHeartbeat();

  // Initial immediate pulse
  emitPresenceHeartbeat();

  heartbeatTimer = setInterval(() => {
    emitPresenceHeartbeat();
  }, HEARTBEAT_INTERVAL_MS);
};

/**
 * Stop the recurring presence heartbeat.
 */
export const stopPresenceHeartbeat = (): void => {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
};

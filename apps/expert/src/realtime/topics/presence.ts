import { emitWithAck, realtimeSocket } from "@/realtime/socket";
import type {
  PresenceHeartbeatAck,
  SubscribeExpertPresenceAck,
  SubscribeManyPresenceAck,
} from "@/realtime/types/presence";

// Canonical backend event names (SOCKET_EVENTS.PRESENCE).
export const PRESENCE_EVENTS = {
  HEARTBEAT: "presence:heartbeat",
  SUBSCRIBE: "presence:subscribe",
  UNSUBSCRIBE: "presence:unsubscribe",
  SUBSCRIBE_MANY: "presence:subscribe_many",
  UNSUBSCRIBE_MANY: "presence:unsubscribe_many",
  UPDATED: "presence:updated",
} as const;

export const subscribeExpertPresence = (
  expertId: number,
): Promise<SubscribeExpertPresenceAck> =>
  emitWithAck<SubscribeExpertPresenceAck>(PRESENCE_EVENTS.SUBSCRIBE, {
    expertId,
  });

export const unsubscribeExpertPresence = (
  expertId: number,
): Promise<{ expertId: number; status: string }> =>
  emitWithAck(PRESENCE_EVENTS.UNSUBSCRIBE, { expertId });

/** Bulk-join presence rooms; resolves with a live snapshot per expert. */
export const subscribeManyExpertPresence = (
  expertIds: number[],
): Promise<SubscribeManyPresenceAck> =>
  emitWithAck<SubscribeManyPresenceAck>(PRESENCE_EVENTS.SUBSCRIBE_MANY, {
    expertIds,
  });

export const unsubscribeManyExpertPresence = (
  expertIds: number[],
): Promise<{ unsubscribed: number[] }> =>
  emitWithAck(PRESENCE_EVENTS.UNSUBSCRIBE_MANY, { expertIds });

/**
 * Expert-only heartbeat (payload-less, auth-guarded). Keeps the expert's
 * Redis presence key alive; identity comes from the socket auth, not args.
 */
export const emitPresenceHeartbeat = (): Promise<PresenceHeartbeatAck> =>
  emitWithAck<PresenceHeartbeatAck>(PRESENCE_EVENTS.HEARTBEAT, {});

let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
const HEARTBEAT_INTERVAL_MS = 30_000;

/** Start the recurring heartbeat; silent on failure (next tick retries). */
export const startPresenceHeartbeat = (): void => {
  stopPresenceHeartbeat();
  emitPresenceHeartbeat().catch(() => undefined);
  heartbeatTimer = setInterval(() => {
    const active = realtimeSocket();
    if (active.connected) {
      emitPresenceHeartbeat().catch(() => undefined);
    }
  }, HEARTBEAT_INTERVAL_MS);
};

export const stopPresenceHeartbeat = (): void => {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
};

import { emitWithAck } from "@/realtime/socket";
import type {
  SubscribeExpertPresenceAck,
  SubscribeManyPresenceAck,
  UnsubscribeExpertPresenceAck,
  UnsubscribeManyPresenceAck,
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
): Promise<UnsubscribeExpertPresenceAck> =>
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
): Promise<UnsubscribeManyPresenceAck> =>
  emitWithAck(PRESENCE_EVENTS.UNSUBSCRIBE_MANY, { expertIds });

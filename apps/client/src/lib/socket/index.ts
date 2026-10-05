/** @deprecated Import from `@/realtime/...` instead. Kept for legacy `@/lib/socket` imports. */
export { ExpertClientStatus } from "@/realtime/types/presence";
export type {
  PresenceChangedEventPayload,
  PresenceSubscriptionSnapshot,
  SubscribeExpertPresenceAck,
  SubscribeManyPresenceAck,
  PresenceRecord,
} from "@/realtime/types/presence";
export {
  PRESENCE_EVENTS,
  subscribeExpertPresence,
  unsubscribeExpertPresence,
  subscribeManyExpertPresence,
  unsubscribeManyExpertPresence,
} from "@/realtime/topics/presence";
export {
  getBaseSocketUrl,
  defaultSocketOptions,
  isBrowser,
} from "./config";

export {
  merchantSocket,
} from "./merchant.socket";

export {
  chatSocket,
} from "./chat.socket";

import { emitWithAck } from "@/realtime/socket";
import type {
  AcknowledgeNotificationReadAck,
  SubscribeNotificationsAck,
} from "@/realtime/types/notifications";

// Canonical backend event names (SOCKET_EVENTS.NOTIFICATION).
export const NOTIFICATION_EVENTS = {
  SUBSCRIBE: "notification:subscribe",
  UNSUBSCRIBE: "notification:unsubscribe",
  READ: "notification:read",
  NEW: "notification:new",
} as const;

/** Join the actor's private notification room. Requires auth; rejects anonymously. */
export const subscribeNotifications = (): Promise<SubscribeNotificationsAck> =>
  emitWithAck<SubscribeNotificationsAck>(NOTIFICATION_EVENTS.SUBSCRIBE, {});

export const acknowledgeNotificationRead = (
  notificationId: string,
): Promise<AcknowledgeNotificationReadAck> =>
  emitWithAck<AcknowledgeNotificationReadAck>(NOTIFICATION_EVENTS.READ, {
    notificationId,
  });

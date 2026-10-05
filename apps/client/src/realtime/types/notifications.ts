export interface RealtimeNotification {
  notificationId: string;
  title?: string;
  body?: string;
  type?: string;
  createdAt?: string;
}

export interface SubscribeNotificationsAck {
  status: string;
  room: string;
}

export interface AcknowledgeNotificationReadAck {
  status: string;
  notificationId: string;
}

export interface ExpertNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  [key: string]: unknown;
}

export type NotificationsResponse = ExpertNotification[];

export interface NotificationCount {
  count: number;
}

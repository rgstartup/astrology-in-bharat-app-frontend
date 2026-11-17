export interface ExpertNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  [key: string]: unknown;
}

export interface NotificationsResponse {
  success: boolean;
  data: ExpertNotification[];
  meta: { totalCount: number; limit: number; offset: number };
}

export interface UnreadCountResponse {
  success: boolean;
  count: number;
}

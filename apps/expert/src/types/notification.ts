export interface ApiNotification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  type: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  type?: "info" | "success" | "error" | "warning";
}

export interface NotificationGroup {
  today: AppNotification[];
  earlier: AppNotification[];
}

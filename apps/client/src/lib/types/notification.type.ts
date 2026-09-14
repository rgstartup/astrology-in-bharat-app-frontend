export enum NotificationType {
  ORDER_CREATED = "order_created",
  ORDER_PLACED = "order_placed",
  ORDER_PACKED = "order_packed",
  ORDER_SHIPPED = "order_shipped",
  ORDER_DELIVERED = "order_delivered",
  ORDER_CANCELLED = "order_cancelled",
  WALLET_RECHARGE = "wallet_recharge",
  PUJA_BOOKING = "puja_booking",
  GENERAL = "general",
}

export interface INotification {
  id: string;
  client_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Meta {
  totalCount: number;
  limit: number;
}

export interface IFetchNotificationResponse {
  status: boolean;
  data: INotification[];
  meta: Meta;
}

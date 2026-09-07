import { HeaderTranslations } from "@repo/store";
import api from "../../utils/api";
import { markNotificationAsRead } from "./notification-api";

export interface Notification {
  id: string;
  isRead: boolean;
  title: string;
  message: string;
  created_at: Date;
}

interface NotifcationListProps {
  show: boolean;
  notifications: Notification[];
  t: HeaderTranslations;
}

const markAsRead = async (id: string) => {
  try {
    const [_not, error] = await markNotificationAsRead(id);
    if (error) throw error;
    // fetchUnreadCount();
    // fetchNotifications();
  } catch (err) {
    console.error("Failed to mark as read", err);
  }
};

const NotificationList = (props: NotifcationListProps) => {
  if (!props.show) return null;

  const { notifications, t } = props;

  return notifications.map((notif, idx) => (
    <div
      key={`${notif.id}-${idx}`}
      className={`px-3 py-3 border-b cursor-pointer transition-all ${notif.isRead ? "opacity-75" : "bg-blue-50/30"}`}
      onClick={() => !notif.isRead && markAsRead(notif.id)}
    >
      <div className="flex justify-between items-start mb-1">
        <p className="mb-0 text-gray-900 font-bold text-sm">
          {notif.title || "Notification"}
        </p>
        {!notif.isRead && (
          <span className="w-2 h-2 bg-blue-500 rounded-full inline-block" />
        )}
      </div>
      <p
        className="mb-0 text-gray-500"
        style={{
          fontSize: "13px",
          lineHeight: "1.5",
        }}
      >
        {notif.message}
      </p>
      <p
        className="mb-0 mt-2 text-orange-500 font-medium"
        style={{ fontSize: "11px" }}
      >
        {notif.created_at
          ? new Date(notif.created_at).toLocaleString()
          : t.justNow}
      </p>
    </div>
  ));
};

export default NotificationList;

import { HeaderTranslations } from "@repo/store";
import { INotification } from "@/lib/types/notification.type";

interface NotifcationListProps {
  show: boolean;
  notifications: INotification[];
  t: HeaderTranslations;
  markNotificationAsRead: (notificationId: string) => void;
}

const NotificationList = (props: NotifcationListProps) => {
  if (!props.show) return null;

  const { notifications, t } = props;

  return notifications.map((notif, idx) => (
    <div
      key={`${notif.id}-${idx}`}
      className={`px-3 py-3 border-b cursor-pointer transition-all ${notif.is_read ? "opacity-75" : "bg-blue-50/30"}`}
      onClick={() => !notif.is_read && props.markNotificationAsRead(notif.id)}
    >
      <div className="flex justify-between items-start mb-1">
        <p className="mb-0 text-gray-900 font-bold text-sm">
          {notif.title || "Notification"}
        </p>
        {!notif.is_read && (
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

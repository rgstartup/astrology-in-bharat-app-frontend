"use client";

import { HeaderTranslations } from "@repo/store";
import Link from "next/link";
import NotificationSkeleton from "./skeleton";
import EmptyNotification from "./empty";
import NotificationList, { Notification } from "./list";
import LoadMoreNotification from "./load-more";
import { PATHS } from "@repo/routes";
import NotificationCountIndicator from "./indicator";
import api from "../../utils/api";

interface NotificationComponentProps {}

interface NotificationDropDownProps {
  loadingNotifications: boolean;
  showNotificationDropDown: boolean;
  setShowNotificationDropDown: React.Dispatch<React.SetStateAction<boolean>>;
  notifications: Notification[];
  handleClearAll: () => void;
  t: HeaderTranslations;
}

const markAsRead = async (id: string) => {
  try {
    const [_not, error] = await api.patch(`/notifications/${id}/read`);
    if (error) throw error;
    // fetchUnreadCount();
    // fetchNotifications();
  } catch (err) {
    console.error("Failed to mark as read", err);
  }
};

const NotificationDropDown = (props: NotificationDropDownProps) => {
  if (!props.showNotificationDropDown) return null;

  const { notifications, handleClearAll, t, setShowNotificationDropDown } =
    props;

  return (
    <div className="fixed top-[65px] left-[5vw] w-[90vw] sm:absolute sm:top-[140%] sm:left-auto sm:-right-4 md:right-0 sm:w-[320px] md:w-[380px] bg-white shadow-lg rounded-2xl overflow-hidden z-[1001] border border-[#eee]">
      <div className="px-3 py-3 border-b bg-gray-50 flex justify-between items-center">
        <p className="mb-0 font-bold text-gray-900 text-lg">
          {t.notifications}
        </p>
        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-red-500 text-sm font-bold hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-all flex items-center gap-1.5"
          >
            <i className="fa-solid fa-trash-can text-xs"></i>
            {t.clearAll}
          </button>
        )}
      </div>
      <div
        data-lenis-prevent
        className="overflow-y-auto overscroll-contain"
        style={{ maxHeight: "400px" }}
      >
        <NotificationSkeleton show={props.loadingNotifications} />
        <EmptyNotification show={notifications.length === 0} t={t} />
        <NotificationList show={notifications.length > 0} />
        // notificationsHasMore && // notifications.length greater than 0 && //
        !loadingNotifications &&
        <LoadMoreNotification
          show={
            notificationsHasMore &&
            notifications.length > 0 &&
            !loadingNotifications
          }
        />
      </div>
      <div className="px-3 py-3 border-t text-center bg-gray-50">
        <Link
          href={`${PATHS.PROFILE}?tab=notifications`}
          className="no-underline text-orange-500 font-bold text-sm hover:text-orange-600"
          onClick={() => setShowNotificationDropDown(false)}
        >
          {t.viewAll}
        </Link>
      </div>
    </div>
  );
};

const NotificationComponent = () => {
  return (
    <div className="notification-dropdown-container relative">
      <div
        className="cursor-pointer relative inline-flex"
        onClick={() => setShowNotificationDropDown(!showNotificationDropdown)}
      >
        <i className="fa-solid fa-bell text-white text-xl" />
        <NotificationCountIndicator unreadCount={unreadCount} />
      </div>

      <NotificationDropDown showNotificationDropDown />
    </div>
  );
};

export default NotificationComponent;

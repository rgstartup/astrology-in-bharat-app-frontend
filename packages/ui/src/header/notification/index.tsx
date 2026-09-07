"use client";

import NotificationCountIndicator from "./notification-indicator";
import { useState } from "react";

interface NotificationComponentProps {}

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

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

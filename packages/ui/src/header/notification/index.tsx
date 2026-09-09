"use client";

import React, { useState } from "react";
import NotificationCountIndicator from "./notification-indicator";
import NotificationDropDown from "./notification-dropdown";
import { headerTranslations, useLanguageStore } from "@repo/store";

interface NotificationComponentProps {
  notifications?: any[];
  unreadCount?: number;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({
  notifications = [],
  unreadCount = 0,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { lang } = useLanguageStore();
  const t =
    headerTranslations[lang as keyof typeof headerTranslations] ||
    headerTranslations.en;

  return (
    <div className="notification-dropdown-container relative">
      <div
        className="cursor-pointer relative inline-flex"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <i className="fa-solid fa-bell text-white text-xl" />
        <NotificationCountIndicator unreadCount={unreadCount} />
      </div>

      <NotificationDropDown
        showNotificationDropDown={showDropdown}
        setShowNotificationDropDown={setShowDropdown}
        notifications={notifications as any}
        handleClearAll={() => {}}
        t={t}
      />
    </div>
  );
};

export default NotificationComponent;

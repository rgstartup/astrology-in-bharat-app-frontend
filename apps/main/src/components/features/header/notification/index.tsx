"use client";

import NotificationCountIndicator from "./notification-indicator";
import { useNotification } from "@/store/useNotificationStore";
import { useEffect, useRef, useState } from "react";
import NotificationDropDown from "./notification-dropdown";
import { headerTranslations, useLanguageStore } from "@repo/store";
import {
  clearNotifications,
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead as markNotificationAsReadApi,
} from "./notification-api";
import NotificationSkeleton from "./notification-skeleton";
import EmptyNotification from "./notification-empty";
import NotificationList from "./notification-list";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useScrollClose } from "@/hooks/use-scroll-close";
import { useAuthStore } from "@/store/useAuthStore";

const NotificationComponent = () => {
  const notificationRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated } = useAuthStore();
  const {
    unread_count,
    notifications,
    isLoading,
    reset,
    setNotifications,
    setUnreadCount,
    markNotificationAsRead,
  } = useNotification();
  const { lang } = useLanguageStore();
  const t =
    headerTranslations[lang as keyof typeof headerTranslations] ||
    headerTranslations.en;

  const [showNotificationDropDown, setShowNotificationDropDown] =
    useState(false);

  const fetchNotificationsFn = async () => {
    try {
      const [res, error] = await getNotifications();
      if (error) throw error;
      setNotifications(res?.data ?? []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const handleClearAll = async () => {
    try {
      const [_, error] = await clearNotifications();
      if (error) throw error;
      reset();
    } catch (err) {
      console.error("Failed to clear notifications in header", err);
    }
  };

  const markNotificationReadFn = async (id: string) => {
    try {
      const [_, error] = await markNotificationAsReadApi(id);
      if (error) throw error;

      markNotificationAsRead(id);
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const fetchUnreadCountFn = async () => {
    try {
      const [res, error] = await getUnreadNotificationsCount();
      if (error) throw error;

      setUnreadCount(res?.count ?? 0);
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  useEffect(() => {
    fetchUnreadCountFn();
  }, []);

  useEffect(() => {
    if (showNotificationDropDown) {
      fetchNotificationsFn();
    }
  }, [showNotificationDropDown, fetchNotificationsFn]);

  useClickOutside(
    notificationRef,
    () => setShowNotificationDropDown(false),
    showNotificationDropDown && isAuthenticated,
  );

  useScrollClose(
    () => setShowNotificationDropDown(false),
    showNotificationDropDown && isAuthenticated,
  );

  if (!isAuthenticated) return null;

  return (
    <div
      className="notification-dropdown-container relative"
      ref={notificationRef}
    >
      <div
        className="cursor-pointer relative inline-flex"
        onClick={() => setShowNotificationDropDown(!showNotificationDropDown)}
      >
        <i className="fa-solid fa-bell text-white text-xl" />
        <NotificationCountIndicator unreadCount={unread_count} />
      </div>

      <NotificationDropDown
        showNotificationDropDown={showNotificationDropDown}
        setShowNotificationDropDown={setShowNotificationDropDown}
        handleClearAll={handleClearAll}
        notifications={notifications}
        t={t}
      >
        <NotificationSkeleton show={isLoading} />
        <EmptyNotification show={notifications.length === 0} t={t} />
        {/*     notificationsHasMore && // notifications.length greater than 0 && //
         !loadingNotifications &&
        <LoadMoreNotification
          show={
            notificationsHasMore &&
            notifications.length > 0 &&
            !loadingNotifications
          }
        />  */}
        <NotificationList
          notifications={notifications}
          show={notifications.length > 0}
          t={t}
          markNotificationAsRead={markNotificationReadFn}
        />
      </NotificationDropDown>
    </div>
  );
};

export default NotificationComponent;

"use client";

import NotificationCountIndicator from "./notification-indicator";
import { useNotification } from "@/store/useNotificationStore";
import { useCallback, useEffect, useRef, useState } from "react";
import NotificationDropDown from "./notification-dropdown";
import {
  clearNotifications,
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead as markNotificationAsReadApi,
} from "./api/notification-api";
import NotificationSkeleton from "./notification-skeleton";
import EmptyNotification from "./notification-empty";
import NotificationList from "./notification-list";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useScrollClose } from "@/hooks/use-scroll-close";
import { useAuthStore } from "@/store/useAuthStore";

const NotificationComponent = () => {
  const notificationRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user } = useAuthStore();
  const {
    unread_count,
    notifications,
    isLoading,
    reset,
    setNotifications,
    setUnreadCount,
    markNotificationAsRead,
    setLoading,
  } = useNotification();

  const [showNotificationDropDown, setShowNotificationDropDown] =
    useState(false);

  const fetchNotificationsFn = useCallback(async () => {
    setLoading(true);
    try {
      const [res, error] = await getNotifications();
      if (error) throw error;
      setNotifications(res?.data ?? []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  }, [setNotifications]);

  const handleClearAll = useCallback(async () => {
    setLoading(true);
    try {
      const [_, error] = await clearNotifications();
      if (error) throw error;
      reset();
    } catch (err) {
      console.error("Failed to clear notifications in header", err);
    } finally {
      setLoading(false);
    }
  }, [reset]);

  const markNotificationReadFn = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const [_, error] = await markNotificationAsReadApi(id);
        if (error) throw error;

        markNotificationAsRead(id);
      } catch (err) {
        console.error("Failed to mark as read", err);
      } finally {
        setLoading(false);
      }
    },
    [markNotificationAsRead],
  );

  const fetchUnreadCountFn = useCallback(async () => {
    setLoading(true);
    try {
      const [res, error] = await getUnreadNotificationsCount();
      if (error) throw error;

      setUnreadCount(res?.count ?? 0);
    } catch (error) {
      console.error("Failed to fetch unread notifications count", error);
    } finally {
      setLoading(false);
    }
  }, [setUnreadCount]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCountFn();
    }
  }, [isAuthenticated, fetchUnreadCountFn]);

  useEffect(() => {
    if (showNotificationDropDown && isAuthenticated) {
      fetchNotificationsFn();
    }
  }, [showNotificationDropDown, isAuthenticated, fetchNotificationsFn]);

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
      >
        <NotificationSkeleton show={isLoading} />
        <EmptyNotification show={!isLoading && notifications.length === 0} />
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
          show={!isLoading && notifications.length > 0}
          markNotificationAsRead={markNotificationReadFn}
        />
      </NotificationDropDown>
    </div>
  );
};

export default NotificationComponent;

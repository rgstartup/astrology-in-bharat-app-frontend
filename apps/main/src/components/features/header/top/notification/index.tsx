"use client";

import NotificationCountIndicator from "./notification-indicator";
import { useNotification } from "@/store/useNotificationStore";
import { useCallback, useEffect, useRef, useState } from "react";
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
import {
  connectNotificationSocket,
  getNotificationSocket,
} from "@repo/ui/sockets";

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
    setLoading
  } = useNotification();
  const { lang } = useLanguageStore();
  const t =
    headerTranslations[lang as keyof typeof headerTranslations] ||
    headerTranslations.en;

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
      setLoading(false)
    }
  }, [setNotifications]);

  const handleClearAll = useCallback(async () => {
    setLoading(true)
    try {
      const [_, error] = await clearNotifications();
      if (error) throw error;
      reset();
    } catch (err) {
      console.error("Failed to clear notifications in header", err);
    } finally {
      setLoading(false)
    }
  }, [reset]);

  const markNotificationReadFn = useCallback(
    async (id: string) => {
      setLoading
      try {
        const [_, error] = await markNotificationAsReadApi(id);
        if (error) throw error;

        markNotificationAsRead(id);
      } catch (err) {
        console.error("Failed to mark as read", err);
      } finally {
        setLoading(false)
      }
    },
    [markNotificationAsRead],
  );

  const fetchUnreadCountFn = useCallback(async () => {
    setLoading(true)
    try {
      const [res, error] = await getUnreadNotificationsCount();
      if (error) throw error;

      setUnreadCount(res?.count ?? 0);
    } catch (error) {
      console.error("Failed to fetch unread notifications count", error);
    } finally {
      setLoading(false)
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

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    console.log("🔌 Connecting to notification socket for user:", user.id);
    // Use profile from token as per new architecture
    connectNotificationSocket(user.id);
    const socket = getNotificationSocket();

    const handleUpdate = async (data: any) => {
      console.log("🔔 Real-time Notification received:", data);
      // Show success toast
      const { toast } = await import("react-toastify");
      toast.success(data.message || "Order Status Updated!");

      setUnreadCount(useNotification.getState().unread_count + 1);
      fetchNotificationsFn();
    };

    // Listen for backend events
    socket.on("order_status_updated", handleUpdate);
    socket.on("notification", handleUpdate);
    socket.on("new_notification", handleUpdate);

    return () => {
      socket.off("order_status_updated", handleUpdate);
      socket.off("notification", handleUpdate);
      socket.off("new_notification", handleUpdate);
    };
  }, [isAuthenticated, user?.id, fetchNotificationsFn, setUnreadCount]);

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
        <EmptyNotification show={!isLoading && notifications.length === 0} t={t} />
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
          t={t}
          markNotificationAsRead={markNotificationReadFn}
        />
      </NotificationDropDown>
    </div>
  );
};

export default NotificationComponent;

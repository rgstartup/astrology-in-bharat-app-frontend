"use client";

import { useEffect, useCallback, createContext, useContext, useMemo } from "react";
import { useRealtime } from "@/realtime/socket-provider";
import { useSocketEvent } from "@/realtime/hooks/use-socket-event";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "./store";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  deleteAll,
} from "./api";
import type { ExpertNotification } from "./types";
import { toast } from "react-toastify";

const SUBSCRIBE_EVENT = "notification:subscribe";
const NEW_EVENT = "notification:new";
const READ_EVENT = "notification:read";

interface NotificationActions {
  markAsRead: (id: number) => void;
  deleteNotification: (id: number) => void;
  deleteAllNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationActions | null>(null);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { socket } = useRealtime();
  const { user, isAuthenticated } = useAuthStore();
  const {
    setNotifications,
    prependNotification,
    markRead,
    removeNotification,
    clearAll: storeClearAll,
    setUnreadCount,
    reset,
  } = useNotificationStore();

  const fetchInitial = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    const [listRes, countRes] = await Promise.allSettled([
      getNotifications(),
      getUnreadCount(),
    ]);
    if (listRes.status === "fulfilled") setNotifications(listRes.value);
    if (countRes.status === "fulfilled") setUnreadCount(countRes.value.count);
  }, [isAuthenticated, user, setNotifications, setUnreadCount]);

  useEffect(() => {
    fetchInitial();
  }, [fetchInitial]);

  // Realtime subscription: join expert notification room, listen for new notifications.
  // Connection lifecycle is owned by RealtimeProvider.
  const onConnect = useCallback(() => {
    if (!socket || !isAuthenticated || !user) return;
    socket.emit(SUBSCRIBE_EVENT, {}, (ack: { success?: boolean } | undefined) => {
      if (ack?.success === false) {
        console.warn("[NotificationProvider] subscribe ack not successful");
      }
    });
  }, [socket, isAuthenticated, user]);

  const onNew = useCallback(
    (payload: { notification: ExpertNotification }) => {
      prependNotification(payload.notification);
      toast(payload.notification.message || payload.notification.title);
    },
    [prependNotification],
  );

  const onRead = useCallback(
    (payload: { notificationId: number }) => {
      markRead(payload.notificationId);
    },
    [markRead],
  );

  useSocketEvent("connect", onConnect, isAuthenticated && !!user);
  useSocketEvent(NEW_EVENT, onNew, isAuthenticated && !!user);
  useSocketEvent(READ_EVENT, onRead, isAuthenticated && !!user);

  // Reset store on logout
  useEffect(() => {
    if (!isAuthenticated) reset();
  }, [isAuthenticated, reset]);

  const actions = useMemo<NotificationActions>(
    () => ({
      markAsRead: (id) => {
        markRead(id);
        markAsRead(id).catch(() => undefined);
      },
      deleteNotification: (id) => {
        removeNotification(id);
      },
      deleteAllNotifications: async () => {
        try {
          await deleteAll();
        } catch {
          // ignore; local state already cleared below
        }
        storeClearAll();
      },
    }),
    [markRead, removeNotification, storeClearAll, markAsRead],
  );

  return (
    <NotificationContext.Provider value={actions}>{children}</NotificationContext.Provider>
  );
}

export const useNotificationActions = (): NotificationActions => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotificationActions must be used within NotificationProvider");
  }
  return ctx;
};

export const useNotifications = () =>
  useNotificationStore((s) => s.notifications);

export const useUnreadCount = () =>
  useNotificationStore((s) => s.unreadCount);

"use client";

import { useEffect, useCallback, createContext, useContext, useMemo } from "react";
import { realtimeSocket, connectRealtimeSocket } from "@/realtime/socket";
import { getSocketTokenAction } from "@/actions/auth";
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
  const socket = realtimeSocket();
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
    if (listRes.status === "fulfilled") setNotifications(listRes.value.data);
    if (countRes.status === "fulfilled") setUnreadCount(countRes.value.count);
  }, [isAuthenticated, user, setNotifications, setUnreadCount]);

  useEffect(() => {
    fetchInitial();
  }, [fetchInitial]);

  // Realtime subscription: join expert notification room, listen for new notifications.
  // Socket is connected with the expert JWT (auth token) via connectRealtimeSocket —
  // never left anonymous.
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let cancelled = false;

    // Ensure the socket is connected with the auth token before subscribing.
    (async () => {
      const token = await getSocketTokenAction();
      if (!cancelled) connectRealtimeSocket(token);
    })();

    const onConnect = () => {
      socket.emit(SUBSCRIBE_EVENT, {}, (ack: { success?: boolean } | undefined) => {
        if (!cancelled && ack?.success === false) {
          console.warn("[NotificationProvider] subscribe ack not successful");
        }
      });
    };

    const onNew = (payload: { notification: ExpertNotification }) => {
      prependNotification(payload.notification);
      toast(payload.notification.title, {
        description: payload.notification.message,
      });
    };

    const onRead = (payload: { notificationId: number }) => {
      markRead(payload.notificationId);
    };

    socket.on("connect", onConnect);
    socket.on(NEW_EVENT, onNew);
    socket.on(READ_EVENT, onRead);

    // If already connected, subscribe immediately
    if (socket.connected) {
      onConnect();
    }

    return () => {
      cancelled = true;
      socket.off("connect", onConnect);
      socket.off(NEW_EVENT, onNew);
      socket.off(READ_EVENT, onRead);
    };
  }, [socket, isAuthenticated, user?.id, prependNotification, markRead]);

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

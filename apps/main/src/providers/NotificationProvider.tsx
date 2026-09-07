"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  connectNotificationSocket,
  getNotificationSocket,
} from "@repo/ui/sockets";
import type { INotification } from "@/lib/types/notification.type";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotification } from "@/store/useNotificationStore";

const isNotification = (data: unknown): data is INotification => {
  if (!data || typeof data !== "object") return false;

  const notification = data as Partial<INotification>;
  return (
    typeof notification.id === "string" &&
    typeof notification.title === "string" &&
    typeof notification.message === "string"
  );
};

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      useNotification.getState().reset();
      return;
    }

    connectNotificationSocket(user.profile || user.id);
    const socket = getNotificationSocket();

    const handleNotification = (data: unknown) => {
      const notification = isNotification(data)
        ? data
        : isNotification((data as { notification?: unknown })?.notification)
          ? (data as { notification: INotification }).notification
          : undefined;

      toast.success(
        notification?.message ||
          (data as { message?: string })?.message ||
          "You have a new notification",
      );
      useNotification.getState().receiveNotification(notification);
    };

    socket.on("notification", handleNotification);
    socket.on("new_notification", handleNotification);
    socket.on("order_status_updated", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
      socket.off("new_notification", handleNotification);
      socket.off("order_status_updated", handleNotification);
    };
  }, [isAuthenticated, user?.id, user?.profile]);

  return children;
}

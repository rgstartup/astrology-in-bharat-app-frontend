import type { INotification } from "@/lib/types/notification.type";
import { create } from "zustand";

interface INotificationState {
  notifications: INotification[];
  unread_count: number;
  isLoading: boolean;

  setNotifications: (notifications: INotification[]) => void;
  setUnreadCount: (value: number) => void;
  markNotificationAsRead: (notificationId: string) => void;
  reset: () => void;
  setLoading: (value: boolean) => void;
}

const notificationStore = create<INotificationState>((set) => ({
  notifications: [],
  unread_count: 0,
  isLoading: false,

  setNotifications: (notifications: INotification[]) => {
    set({ notifications });
  },

  setUnreadCount: (count: number) => {
    set({ unread_count: count });
  },

  markNotificationAsRead: (notificationId: string) => {
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n,
      ),
      unread_count: Math.max(0, s.unread_count - 1),
    }));
  },

  setLoading: (value: boolean) => {
    set({ isLoading: value })
  },

  reset: () => {
    set({
      notifications: [],
      unread_count: 0,
    });
  },
}));

export const useNotification = notificationStore;

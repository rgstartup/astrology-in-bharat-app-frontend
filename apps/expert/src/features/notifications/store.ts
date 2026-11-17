import { create } from "zustand";
import type { ExpertNotification } from "./types";

interface NotificationState {
  notifications: ExpertNotification[];
  unreadCount: number;

  setNotifications: (list: ExpertNotification[]) => void;
  prependNotification: (n: ExpertNotification) => void;
  markRead: (id: number) => void;
  removeNotification: (id: number) => void;
  clearAll: () => void;
  setUnreadCount: (count: number) => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (list) =>
    set({
      notifications: list,
      unreadCount: list.filter((n) => !n.isRead).length,
    }),

  prependNotification: (n) =>
    set((s) => ({
      notifications: [n, ...s.notifications],
      unreadCount: s.unreadCount + 1,
    })),

  markRead: (id) =>
    set((s) => {
      const wasUnread = s.notifications.find((n) => n.id === id)?.isRead === false;
      return {
        notifications: s.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n,
        ),
        unreadCount: wasUnread ? Math.max(0, s.unreadCount - 1) : s.unreadCount,
      };
    }),

  removeNotification: (id) =>
    set((s) => {
      const removed = s.notifications.find((n) => n.id === id);
      return {
        notifications: s.notifications.filter((n) => n.id !== id),
        unreadCount: removed && !removed.isRead ? Math.max(0, s.unreadCount - 1) : s.unreadCount,
      };
    }),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),

  setUnreadCount: (count) => set({ unreadCount: count }),

  reset: () => set({ notifications: [], unreadCount: 0 }),
}));

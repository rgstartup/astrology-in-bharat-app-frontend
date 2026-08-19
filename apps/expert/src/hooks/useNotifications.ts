import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markAsRead, deleteNotification, deleteAllNotifications } from "@/lib/notifications";
import { AppNotification, ApiNotification, NotificationGroup } from "@/types/notification";
import { isToday as checkIsToday } from "date-fns";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib";

// Adapter to convert API response to App format
const mapApiToAppNotification = (n: ApiNotification): AppNotification => ({
  id: n.id,
  title: n.title,
  description: n.message,
  createdAt: n.created_at,
  read: n.read,
  type: (n.type as any) || "info"
});

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Notifications Query
  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const [data, error] = await getNotifications();
      if (error) throw new Error("Failed to load notifications");
      return (data || []).map(mapApiToAppNotification);
    },
    staleTime: 60 * 1000, // 1 minute cache
  });

  // 2. Mark as Read Mutation
  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const [_, error] = await markAsRead(id);
      if (error) throw new Error("Failed to mark as read");
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(["notifications"], (old: AppNotification[] | undefined) => 
        old?.map(n => n.id === id ? { ...n, read: true } : n)
      );
    }
  });

  // 3. Delete Notification Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const [_, error] = await deleteNotification(id);
      if (error) throw new Error("Failed to delete notification");
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(["notifications"], (old: AppNotification[] | undefined) => 
        old?.filter(n => n.id !== id)
      );
    }
  });

  // 4. Clear All Mutation
  const clearAllMutation = useMutation({
    mutationFn: async () => {
      const [_, error] = await deleteAllNotifications();
      if (error) throw new Error("Failed to clear notifications");
    },
    onSuccess: () => {
      queryClient.setQueryData(["notifications"], []);
      toast.success("Notifications cleared!");
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    }
  });

  // 5. Group Notifications (Today vs Earlier)
  const groupedNotifications: NotificationGroup = (notificationsQuery.data || [])
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .reduce((acc: NotificationGroup, n: AppNotification) => {
      if (checkIsToday(new Date(n.createdAt))) {
        acc.today.push(n);
      } else {
        acc.earlier.push(n);
      }
      return acc;
    }, { today: [], earlier: [] });

  return {
    notifications: notificationsQuery.data || [],
    groupedNotifications,
    isLoading: notificationsQuery.isLoading,
    isRefetching: notificationsQuery.isRefetching,
    handleMarkRead: markReadMutation.mutate,
    handleDelete: deleteMutation.mutate,
    handleClearAll: clearAllMutation.mutate,
    unreadCount: (notificationsQuery.data || []).filter(n => !n.read).length
  };
};

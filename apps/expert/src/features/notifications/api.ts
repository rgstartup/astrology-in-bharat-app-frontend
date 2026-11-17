import apiV2 from "@/api/apiV2";
import type {
  ExpertNotification,
  NotificationsResponse,
  UnreadCountResponse,
} from "./types";

export async function getNotifications(
  params?: { limit?: number; offset?: number; isRead?: boolean },
): Promise<NotificationsResponse> {
  const result = await apiV2.get<NotificationsResponse>("/notifications", {
    params,
  });
  if (!result.ok) throw new Error(result.error?.message ?? "Failed to fetch notifications");
  return result.data;
}

export async function getUnreadCount(): Promise<UnreadCountResponse> {
  const result = await apiV2.get<UnreadCountResponse>("/notifications/unread-count");
  if (!result.ok) throw new Error(result.error?.message ?? "Failed to fetch unread count");
  return result.data;
}

export async function markAsRead(id: number): Promise<{ success: boolean }> {
  const result = await apiV2.patch<{ success: boolean }>(
    `/notifications/${id}/read`,
  );
  if (!result.ok) throw new Error(result.error?.message ?? "Failed to mark as read");
  return result.data;
}

export async function deleteAll(): Promise<{ success: boolean }> {
  const result = await apiV2.delete<{ success: boolean }>("/notifications");
  if (!result.ok) throw new Error(result.error?.message ?? "Failed to clear notifications");
  return result.data;
}

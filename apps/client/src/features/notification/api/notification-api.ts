// "use server";

import { clientAPI } from "@/actions";
import type { IFetchNotificationResponse } from "@/lib/types/notification.type";

export async function getNotifications(params?: {
  limit: number;
  offset: number;
}) {
  return clientAPI.get<IFetchNotificationResponse>("/client/notifications", {
    params,
  });
}

export async function markNotificationAsRead(id: string) {
  return clientAPI.patch<{ success: boolean; message: string }>(
    `/client/notifications/${id}/read`,
  );
}

export async function clearNotifications() {
  return clientAPI.delete<{ success: boolean; message: string }>(
    "/client/notifications",
  );
}

export async function getUnreadNotificationsCount() {
  return clientAPI.get<{ count: number }>("/client/notifications/unread-count");
}

// "use server";

import { apiV2 } from "@/actions";
import type { IFetchNotificationResponse } from "@/lib/types/notification.type";

export async function getNotifications(params?: {
  limit: number;
  offset: number;
}) {
  return apiV2.get<IFetchNotificationResponse>("/client/notifications", {
    params,
  });
}

export async function markNotificationAsRead(id: string) {
  return apiV2.patch<{ success: boolean; message: string }>(
    `/client/notifications/${id}/read`,
  );
}

export async function clearNotifications() {
  return apiV2.delete<{ success: boolean; message: string }>(
    "/client/notifications",
  );
}

export async function getUnreadNotificationsCount() {
  return apiV2.get<{ count: number }>("/client/notifications/unread-count");
}

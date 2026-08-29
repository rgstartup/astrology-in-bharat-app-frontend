"use server";

import { api } from "@/actions";
import type { IFetchNotificationResponse } from "@/lib/types/notification.type";

export async function getNotifications(params?: {
  limit: number;
  offset: number;
}) {
  return api.get<IFetchNotificationResponse>("/client/notifications", {
    params,
  });
}

export async function markNotificationAsRead(id: string) {
  return api.patch<{ success: boolean; message: string }>(
    `/client/notifications/${id}/read`,
  );
}

export async function clearNotifications() {
  return api.delete<{ success: boolean; message: string }>(
    "/client/notifications",
  );
}

export async function getUnreadNotificationsCount() {
  return api.get<{ count: number }>("/client/notifications/unread-count");
}

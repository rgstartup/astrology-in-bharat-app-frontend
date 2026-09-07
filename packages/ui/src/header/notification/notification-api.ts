import api from "../../utils/api";

export async function getNotifications<T>(params: {
  limit: number;
  offset: number;
}) {
  return api.get<T>("/client/notifications", { params });
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

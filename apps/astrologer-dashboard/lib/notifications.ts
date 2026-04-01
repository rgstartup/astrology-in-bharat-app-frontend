import { api, ApiError } from "./api";


export interface Notification {
    id: string;
    title: string;
    message: string;
    created_at: string;
    read: boolean;
    type: string;
}

export const getNotifications = async (): Promise<[Notification[] | null, ApiError | null]> => {
    const [res, error] = await api.get('/notifications');
    if (error) return [null, error];
    const data = ((res as any)?.data ?? res) as Notification[];
    return [data, null];
};

export const markAsRead = async (id: string): Promise<[any | null, ApiError | null]> => {
    const [res, error] = await api.patch(`/notifications/${id}/read`);
    if (error) return [null, error];
    const data = (res as any)?.data ?? res;
    return [data, null];
};

export const deleteNotification = async (id: string): Promise<[any | null, ApiError | null]> => {
    const [res, error] = await api.delete(`/notifications/${id}`);
    if (error) return [null, error];
    const data = (res as any)?.data ?? res;
    return [data, null];
};

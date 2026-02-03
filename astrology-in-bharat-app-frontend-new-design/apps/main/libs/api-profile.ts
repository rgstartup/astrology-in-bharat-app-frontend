import { apiClient } from "@packages/ui/src/context/ClientAuthContext";

export interface ClientProfileData {
    id?: number;
    userId?: number;
    full_name?: string;
    username?: string;
    date_of_birth?: string;
    time_of_birth?: string;
    place_of_birth?: string;
    gender?: 'male' | 'female' | 'other';
    phone?: string;
    preferences?: string;
    language_preference?: string;
    profile_picture?: string;
    marital_status?: 'single' | 'married' | 'divorced' | 'widowed' | 'other';
    occupation?: string;
    about_me?: string;
    addresses?: AddressDto[];
}

export interface AddressDto {
    id?: number;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    tag?: string;
}

export const getClientProfile = async () => {
    const response = await apiClient.get('/client');
    return response.data;
};

export const updateClientProfile = async (data: Partial<ClientProfileData>) => {
    const response = await apiClient.patch('/client', data);
    return response.data;
};

export const createClientProfile = async (data: Partial<ClientProfileData>) => {
    const response = await apiClient.post('/client', data);
    return response.data;
};

export const uploadClientDocument = async (file: File): Promise<{ url: string; message: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/client/upload-document', formData);
    return response.data;
};

export const getActiveChatSessions = async () => {
    const response = await apiClient.get('/chat/sessions/pending');
    return response.data;
};

export const getPendingChatSessions = async () => {
    const response = await apiClient.get('/chat/sessions/pending');
    return response.data;
};

export const endChatSession = async (sessionId: number) => {
    const response = await apiClient.post(`/chat/end/${sessionId}`);
    return response.data;
};

export const getAllChatSessions = async () => {
    const response = await apiClient.get('/chat/sessions/my-sessions');
    return response.data;
};

export const getChatHistory = async (sessionId: number) => {
    const response = await apiClient.get(`/chat/history/${sessionId}`);
    return response.data;
};


export const getMyOrders = async () => {
    const response = await apiClient.get('/orders/my-orders');
    return response.data;
};

export const getWalletTransactions = async (params?: { purpose?: string, page?: number, limit?: number }) => {
    const response = await apiClient.get('/wallet/transactions', { params });
    return response.data;
};

export const getNotifications = async () => {
    const response = await apiClient.get('/notifications');
    return response.data;
};

export const getUnreadCount = async () => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
};

export const markNotificationAsRead = async (id: number) => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
};

export const deleteNotification = async (id: number) => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
};

export const clearAllNotifications = async () => {
    const response = await apiClient.delete('/notifications/all');
    return response.data;
};

export default apiClient;

import { apiClient } from "../lib/api-client";

const unwrap = <T = any>(response: any): T => (response as any)?.data ?? response;

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
    zipCode?: string;
    zip_code?: string;
    tag?: string;
}

export const getClientProfile = async () => {
    const response = await apiClient.get('/client/profile');
    return (response as any)?.data ?? response;
};

export const updateClientProfile = async (data: Partial<ClientProfileData>) => {
    const response = await apiClient.patch('/client/profile', data);
    return (response as any)?.data ?? response;
};

export const createClientProfile = async (data: Partial<ClientProfileData>) => {
    const response = await apiClient.post('/client/profile', data);
    return (response as any)?.data ?? response;
};

export const uploadClientDocument = async (file: File): Promise<{ url: string; message: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/client/profile/upload-document', formData);
    return ((response as any)?.data ?? response) as { url: string; message: string };
};

export const getActiveChatSessions = async () => {
    const response = await apiClient.get('/chat/sessions/pending');
    return unwrap(response);
};

export const getPendingChatSessions = async () => {
    const response = await apiClient.get('/chat/sessions/pending');
    return unwrap(response);
};

export const endChatSession = async (sessionId: number) => {
    const response = await apiClient.post(`/chat/end/${sessionId}`);
    return unwrap(response);
};

export const getAllChatSessions = async () => {
    const response = await apiClient.get('/chat/sessions/my-sessions');
    return unwrap(response);
};

export const getChatHistory = async (sessionId: number) => {
    const response = await apiClient.get(`/chat/history/${sessionId}`);
    return unwrap(response);
};


export const getMyOrders = async () => {
    const response = await apiClient.get('/orders/my-orders');
    return unwrap(response);
};

export const getWalletTransactions = async (params?: { purpose?: string, page?: number, limit?: number }) => {
    const response = await apiClient.get('/wallet/transactions', { params });
    return (response as any)?.data ?? response;
};

export const getNotifications = async () => {
    const response = await apiClient.get('/notifications');
    return unwrap(response);
};

export const getUnreadCount = async () => {
    const response = await apiClient.get('/notifications/unread-count');
    return unwrap(response);
};

export const markNotificationAsRead = async (id: number) => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return unwrap(response);
};

export const deleteNotification = async (id: number) => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return unwrap(response);
};

export const clearAllNotifications = async () => {
    const response = await apiClient.delete('/notifications/all');
    return unwrap(response);
};

// Rewards & Coupons
export const getMyRewards = async () => {
    const response = await apiClient.get('/coupons/my-rewards');
    return unwrap(response);
};

export const applyCoupon = async (code: string, amount: number, serviceType: string) => {
    const response = await apiClient.post('/coupons/apply', {
        code,
        couponCode: code,
        amount,
        orderValue: amount,
        serviceType
    });
    return unwrap(response);
};

// Support Settings
export interface SupportSettings {
    email?: string;
    phone?: string;
    whatsapp?: string;
}

export const getSupportSettings = async (): Promise<SupportSettings> => {
    const response = await apiClient.get('/settings/support');
    return unwrap(response);
};

// Disputes / Support Tickets
export interface CreateDisputeDto {
    type: 'order' | 'consultation';
    itemId: number;
    orderId?: string | number;
    consultationId?: number;
    category: string;
    description: string;
    itemDetails: any;
}

export const createDispute = async (data: CreateDisputeDto) => {
    const response = await apiClient.post('/support/disputes', data);
    return unwrap(response);
};

export const getMyDisputes = async () => {
    const response = await apiClient.get('/support/disputes');
    return unwrap(response);
};

export const getDisputeById = async (disputeId: number) => {
    const response = await apiClient.get(`/support/disputes/${disputeId}`);
    return unwrap(response);
};

export const getDisputeMessages = async (disputeId: number) => {
    const response = await apiClient.get(`/support/disputes/${disputeId}/messages`);
    return unwrap(response);
};

export const sendDisputeMessage = async (disputeId: number, data: { message?: string, attachmentUrl?: string, attachmentType?: string }) => {
    const response = await apiClient.post(`/support/disputes/${disputeId}/messages`, data);
    return unwrap(response);
};

export const markDisputeMessagesRead = async (disputeId: number) => {
    const response = await apiClient.patch(`/support/disputes/${disputeId}/messages/read`);
    return unwrap(response);
};

export default apiClient;



import { api } from "../lib/api";
import { ApiError } from "@repo/safe-fetch";
import { ClientProfileData, AddressDto, SupportSettings, CreateDisputeDto } from "../lib/types";

export type { SupportSettings, CreateDisputeDto, ClientProfileData, AddressDto };

/**
 * All functions now return [data, error] tuples instead of throwing.
 */

export const getClientProfile = async (): Promise<[any | null, ApiError | null]> => {
    return await api.get('/client/profile');
};

export const updateClientProfile = async (data: Partial<ClientProfileData>): Promise<[any | null, ApiError | null]> => {
    return await api.patch('/client/profile', data);
};

export const createClientProfile = async (data: Partial<ClientProfileData>): Promise<[any | null, ApiError | null]> => {
    return await api.post('/client/profile', data);
};

export const uploadClientDocument = async (file: File): Promise<[{ url: string; message: string } | null, ApiError | null]> => {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post('/client/profile/upload-document', formData);
};

export const getActiveChatSessions = async (): Promise<[any | null, ApiError | null]> => {
    return await api.get('/chat/sessions/pending');
};

export const getPendingChatSessions = async (): Promise<[any | null, ApiError | null]> => {
    return await api.get('/chat/sessions/pending');
};

export const endChatSession = async (sessionId: number): Promise<[any | null, ApiError | null]> => {
    return await api.post(`/chat/end/${sessionId}`);
};

export const getAllChatSessions = async (): Promise<[any | null, ApiError | null]> => {
    return await api.get('/chat/sessions/my-sessions');
};

export const getChatHistory = async (sessionId: number): Promise<[any | null, ApiError | null]> => {
    return await api.get(`/chat/history/${sessionId}`);
};

export const getMyOrders = async (): Promise<[any | null, ApiError | null]> => {
    return await api.get('/orders/my-orders');
};

export const getWalletTransactions = async (params?: { purpose?: string, page?: number, limit?: number }): Promise<[any | null, ApiError | null]> => {
    return await api.get('/wallet/transactions', { params } as any);
};

export const getNotifications = async (): Promise<[any | null, ApiError | null]> => {
    return await api.get('/notifications');
};

export const getUnreadCount = async (): Promise<[any | null, ApiError | null]> => {
    return await api.get('/notifications/unread-count');
};

export const markNotificationAsRead = async (id: number): Promise<[any | null, ApiError | null]> => {
    return await api.patch(`/notifications/${id}/read`);
};

export const deleteNotification = async (id: number): Promise<[any | null, ApiError | null]> => {
    return await api.delete(`/notifications/${id}`);
};

export const clearAllNotifications = async (): Promise<[any | null, ApiError | null]> => {
    return await api.delete('/notifications/all');
};

// Rewards & Coupons
export const getMyRewards = async (): Promise<[any | null, ApiError | null]> => {
    return await api.get('/coupons/my-rewards');
};

export const applyCoupon = async (code: string, amount: number, serviceType: string): Promise<[any | null, ApiError | null]> => {
    return await api.post('/coupons/apply', {
        code,
        couponCode: code,
        amount,
        orderValue: amount,
        serviceType
    });
};

export const getSupportSettings = async (): Promise<[SupportSettings | null, ApiError | null]> => {
    const [data, error] = await api.get('/settings/support');
    
    // Fallback if backend API is not yet available
    if (error || !data) {
        return [{
            email: "support@astrologyinbharat.com",
            phone: "+91-9999999999",
            whatsapp: "+91-9999999999"
        }, null];
    }
    
    return [data, null];
};

// Disputes / Support Tickets
export const createDispute = async (data: CreateDisputeDto): Promise<[any | null, ApiError | null]> => {
    return await api.post('/support/disputes', data);
};

export const getMyDisputes = async (): Promise<[any | null, ApiError | null]> => {
    return await api.get('/support/disputes');
};

export const getDisputeById = async (disputeId: number): Promise<[any | null, ApiError | null]> => {
    return await api.get(`/support/disputes/${disputeId}`);
};

export const getDisputeMessages = async (disputeId: number): Promise<[any | null, ApiError | null]> => {
    return await api.get(`/support/disputes/${disputeId}/messages`);
};

export const sendDisputeMessage = async (disputeId: number, data: { message?: string, attachmentUrl?: string, attachmentType?: string }): Promise<[any | null, ApiError | null]> => {
    return await api.post(`/support/disputes/${disputeId}/messages`, data);
};

export const markDisputeMessagesRead = async (disputeId: number): Promise<[any | null, ApiError | null]> => {
    return await api.patch(`/support/disputes/${disputeId}/messages/read`);
};

// Puja Bookings
export const getMyPujaAppointments = async (): Promise<[any | null, ApiError | null]> => {
    return await api.get('/puja-appointments/user');
};

export const updatePujaAppointmentStatus = async (id: number, data: any): Promise<[any | null, ApiError | null]> => {
    return await api.patch(`/puja-appointments/${id}/status`, data);
};

// For backward compatibility during migration, export http as default
export default api;

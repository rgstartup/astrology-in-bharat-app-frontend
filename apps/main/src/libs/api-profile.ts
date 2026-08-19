import { api } from "../lib/api";
import { ApiError } from "@repo/safe-fetch";
import { ClientProfileData, AddressDto, SupportSettings, CreateDisputeDto } from "../lib/types";

export type { SupportSettings, CreateDisputeDto, ClientProfileData, AddressDto };

/**
 * All functions now return [data, error] tuples instead of throwing.
 */

export const getClientProfile = async (): Promise<[any | null, ApiError | null]> => {
    return await api.get('/client/profile') as any;
};

export const updateClientProfile = async (data: Partial<ClientProfileData>): Promise<[any | null, ApiError | null]> => {
    return await api.patch('/client/profile', data) as any;
};

export const createClientProfile = async (data: Partial<ClientProfileData>): Promise<[any | null, ApiError | null]> => {
    return await api.post('/client/profile', data) as any;
};

export const uploadClientDocument = async (file: File): Promise<[{ url: string; message: string } | null, ApiError | null]> => {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post('/client/profile/upload-document', formData) as any;
};

export const getActiveChatSessions = async (): Promise<[any | null, ApiError | null]> => {
    return await api.get('/chat/sessions/pending') as any;
};

export const getPendingChatSessions = async (): Promise<[any | null, ApiError | null]> => {
    return await api.get('/chat/sessions/pending') as any;
};

export const endChatSession = async (sessionId: string): Promise<[any | null, ApiError | null]> => {
    return await api.post(`/chat/end/${sessionId}`) as any;
};

export const getAllChatSessions = async (): Promise<[any | null, ApiError | null]> => {
    return await api.get('/chat/sessions/my-sessions') as any;
};

export const getConsultationHistory = async (params?: { page?: number, limit?: number, offset?: number }): Promise<[any | null, ApiError | null]> => {
    return await api.get('/consultations/history', { params } as any) as any;
};

export const getChatHistory = async (sessionId: string): Promise<[any | null, ApiError | null]> => {
    return await api.get(`/chat/history/${sessionId}`) as any;
};

export const getMyOrders = async (params?: { limit?: number, offset?: number }): Promise<[any | null, ApiError | null]> => {
    return await api.get('/orders/my-orders', { params } as any) as any;
};

export const cancelMyOrder = async (orderId: string, reason: string): Promise<[any | null, ApiError | null]> => {
    return await api.patch(`/orders/${orderId}/cancel`, { cancellation_reason: reason }) as any;
};

export const getWalletTransactions = async (params?: { purpose?: string, limit?: number, offset?: number }): Promise<[any | null, ApiError | null]> => {
    return await api.get('/wallet/transactions', { params } as any) as any;
};

export const getNotifications = async (params?: { limit?: number, offset?: number }): Promise<[any | null, ApiError | null]> => {
    return await api.get('/notifications', { params } as any) as any;
};

export const getUnreadCount = async (): Promise<[any | null, ApiError | null]> => {
    return await api.get('/notifications/unread-count') as any;
};

export const markNotificationAsRead = async (id: string): Promise<[any | null, ApiError | null]> => {
    return await api.patch(`/notifications/${id}/read`) as any;
};

export const deleteNotification = async (id: string): Promise<[any | null, ApiError | null]> => {
    return await api.delete(`/notifications/${id}`) as any;
};

export const clearAllNotifications = async (): Promise<[any | null, ApiError | null]> => {
    return await api.delete('/notifications/all') as any;
};

// Rewards & Coupons
export const getMyRewards = async (): Promise<[any | null, ApiError | null]> => {
    return await api.get('/coupons/my-rewards') as any;
};

export const applyCoupon = async (code: string, amount: number, serviceType: string): Promise<[any | null, ApiError | null]> => {
    return await api.post('/coupons/apply', {
        code,
        couponCode: code,
        amount,
        orderValue: amount,
        serviceType
    }) as any;
};

export const getSupportSettings = async (): Promise<[SupportSettings | null, ApiError | null]> => {
    const [data, error] = await api.get('/settings/support') as any;
    
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
    return await api.post('/support/disputes', data) as any;
};

export const getMyDisputes = async (): Promise<[any | null, ApiError | null]> => {
    return await api.get('/support/disputes') as any;
};

export const getDisputeById = async (disputeId: string): Promise<[any | null, ApiError | null]> => {
    return await api.get(`/support/disputes/${disputeId}`) as any;
};

export const getDisputeMessages = async (disputeId: string): Promise<[any | null, ApiError | null]> => {
    return await api.get(`/support/disputes/${disputeId}/messages`) as any;
};

export const sendDisputeMessage = async (disputeId: string, data: { message?: string, attachmentUrl?: string, attachmentType?: string }): Promise<[any | null, ApiError | null]> => {
    return await api.post(`/support/disputes/${disputeId}/messages`, data) as any;
};

export const markDisputeMessagesRead = async (disputeId: string): Promise<[any | null, ApiError | null]> => {
    return await api.patch(`/support/disputes/${disputeId}/messages/read`) as any;
};

// Puja Bookings
export const getMyPujaAppointments = async (): Promise<[any | null, ApiError | null]> => {
    return await api.get('/puja-appointments/user') as any;
};

export const updatePujaAppointmentStatus = async (id: string, data: any): Promise<[any | null, ApiError | null]> => {
    return await api.patch(`/puja-appointments/${id}/status`, data) as any;
};

// For backward compatibility during migration, export http as default
export default api;

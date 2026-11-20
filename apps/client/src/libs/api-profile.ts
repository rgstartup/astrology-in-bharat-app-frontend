import { clientAPI } from "@/actions";
import { ApiError } from "@repo/safe-fetch";
import { ClientProfileData, AddressDto, SupportSettings, CreateDisputeDto } from "../lib/types";

export type { SupportSettings, CreateDisputeDto, ClientProfileData, AddressDto };

/**
 * All functions now return envelope results ({ ok, data, error, meta }) instead of tuples.
 */

export const getClientProfile = async () => {
    return await clientAPI.get('/client/profile');
};

export const updateClientProfile = async (data: Partial<ClientProfileData>) => {
    return await clientAPI.patch('/client/profile', data);
};

export const createClientProfile = async (data: Partial<ClientProfileData>) => {
    return await clientAPI.post('/client/profile', data);
};

export const uploadClientDocument = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return await clientAPI.post('/client/profile/upload-document', formData);
};

export const getActiveChatSessions = async () => {
    /** @deprecated Legacy `/chat` REST. No canonical replacement yet; do not add new callers. */
    return await clientAPI.get('/chat/sessions/pending');
};

export const getPendingChatSessions = async () => {
    /** @deprecated Legacy `/chat` REST. No canonical replacement yet; do not add new callers. */
    return await clientAPI.get('/chat/sessions/pending');
};

export const endChatSession = async (sessionId: string) => {
    /** @deprecated Legacy `/chat` REST. End chats via realtime `chat:end` (`endChat()` in `@/realtime/topics/chat`) instead. */
    return await clientAPI.post(`/chat/end/${sessionId}`);
};

export const getAllChatSessions = async () => {
    /** @deprecated Legacy `/chat` REST. No canonical replacement yet; do not add new callers. */
    return await clientAPI.get('/chat/sessions/my-sessions');
};

export const getConsultationHistory = async (params?: { page?: number, limit?: number, offset?: number }) => {
    return await clientAPI.get('/consultations/history', { params } as any);
};

export const getChatHistory = async (sessionId: string) => {
    /** @deprecated Legacy `/chat` REST. Use `getChatHistoryAction(consultationId)` (`GET /client/chat/history/:id`) instead. */
    return await clientAPI.get(`/chat/history/${sessionId}`);
};

export const getMyOrders = async (params?: { limit?: number, offset?: number }) => {
    return await clientAPI.get('/orders/my-orders', { params } as any);
};

export const cancelMyOrder = async (orderId: string, reason: string) => {
    return await clientAPI.patch(`/orders/${orderId}/cancel`, { cancellation_reason: reason });
};

export const getWalletTransactions = async (params?: { purpose?: string, limit?: number, offset?: number }) => {
    return await clientAPI.get('/wallet/transactions', { params } as any);
};

// Rewards & Coupons
export const getMyRewards = async () => {
    return await clientAPI.get('/coupons/my-rewards');
};

export const applyCoupon = async (code: string, amount: number, serviceType: string) => {
    return await clientAPI.post('/coupons/apply', {
        code,
        couponCode: code,
        amount,
        orderValue: amount,
        serviceType
    });
};

export const getSupportSettings = async () => {
    const result = await clientAPI.get('/settings/support');
    
    // Fallback if backend API is not yet available
    if (!result.ok || !result.data) {
        return {
            ok: true,
            data: {
                email: "support@astrologyinbharat.com",
                phone: "+91-9999999999",
                whatsapp: "+91-9999999999"
            }
        };
    }
    
    return result;
};

// Disputes / Support Tickets
export const createDispute = async (data: CreateDisputeDto) => {
    return await clientAPI.post('/support/disputes', data);
};

export const getMyDisputes = async () => {
    return await clientAPI.get('/support/disputes');
};

export const getDisputeById = async (disputeId: string) => {
    return await clientAPI.get(`/support/disputes/${disputeId}`);
};

export const getDisputeMessages = async (disputeId: string) => {
    return await clientAPI.get(`/support/disputes/${disputeId}/messages`);
};

export const sendDisputeMessage = async (disputeId: string, data: { message?: string, attachmentUrl?: string, attachmentType?: string }) => {
    return await clientAPI.post(`/support/disputes/${disputeId}/messages`, data);
};

export const markDisputeMessagesRead = async (disputeId: string) => {
    return await clientAPI.patch(`/support/disputes/${disputeId}/messages/read`);
};

// Puja Bookings
export const getMyPujaAppointments = async () => {
    return await clientAPI.get('/puja-appointments/user');
};

export const updatePujaAppointmentStatus = async (id: string, data: any) => {
    return await clientAPI.patch(`/puja-appointments/${id}/status`, data);
};

// For backward compatibility during migration, export http as default
export default clientAPI;

export interface DisputeMessage {
    id: string;
    disputeId: string;
    senderType: "user" | "admin";
    senderId: string;
    senderName: string;
    message?: string;
    attachmentUrl?: string;
    attachmentType?: "image" | "document" | "pdf" | "video";
    isRead: boolean;
    createdAt: string;
    isSystemNote?: boolean;
    is_system_note?: boolean;
}

export interface Dispute {
    id: string;
    type: "order" | "consultation";
    itemId: string;
    orderId?: string | null;
    consultationId?: string | null;
    category: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt?: string;
}
export interface SupportSettings {
    email?: string;
    phone?: string;
    whatsapp?: string;
}

export interface CreateDisputeDto {
    type: 'order' | 'consultation';
    itemId: string;
    orderId?: string;
    consultationId?: string;
    category: string;
    description: string;
    itemDetails: any;
}

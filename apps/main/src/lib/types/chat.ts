import { Expert } from "./expert";

export type ChatStatus = 'pending' | 'active' | 'completed' | 'terminated' | 'expired';

export interface ChatMessage {
    id: string;
    senderId: string;
    senderType: "user" | "expert" | "admin";
    content: string;
    type?: string;
    attachmentUrl?: string;
    attachmentType?: "image" | "document";
    attachment_url?: string; // snake_case support for backend consistency
    attachment_type?: string;
    imageUrl?: string;
    mediaUrl?: string;
    createdAt?: string;
}

export interface ChatSession {
    id: string;
    expertId: string;
    status: ChatStatus;
    isFree?: boolean;
    freeMinutes?: number;
    maxMinutes?: number;
    remainingSeconds?: number;
    elapsedSeconds?: number;
    expiresAt?: string;
    expert?: Expert;
    totalCost?: number;
    durationMins?: number;
    pricePerMinute?: number;
    remainingBalance?: number;
    reason?: string;
    message?: string;
}

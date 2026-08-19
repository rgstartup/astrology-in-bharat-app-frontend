import { Expert, ExpertProfile } from "./expert";

export type CallStatus = 'ringing' | 'connecting' | 'connected' | 'ended';

export interface CallSession {
    id: string;
    expertId: string;
    type: 'audio' | 'video';
    status: string;
    token?: string;
    roomName?: string;
    expert?: ExpertProfile; // Changed to ExpertProfile to support nested user object
    max_duration_seconds?: number;
    is_free?: boolean;
}

export interface CallReview {
    sessionId: string;
    expertId: string;
    rating: number;
    comment: string;
}

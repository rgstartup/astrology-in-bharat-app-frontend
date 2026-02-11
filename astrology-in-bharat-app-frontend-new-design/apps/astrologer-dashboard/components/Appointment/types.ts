export interface Appointment {
    id: number;
    name: string;
    avatar?: string;
    service: string;
    date: string;
    status: "confirmed" | "pending" | "cancelled" | "active" | "completed" | "expired";
    terminatedBy?: string;
    type: "new" | "follow-up";
    reminder: boolean;
    meetingLink: string;
    sessionId?: number;
    clientId?: number;
    expiresAt?: string;
    isFree?: boolean;
    freeMinutes?: number;
    durationMins?: number;
    review?: {
        rating: number;
        comment: string;
    };
}

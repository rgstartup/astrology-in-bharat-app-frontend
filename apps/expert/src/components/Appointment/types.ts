export interface Appointment {
    id: string;
    name: string;
    avatar?: string;
    service: string;
    date: string;
    status: "confirmed" | "pending" | "cancelled" | "active" | "completed" | "expired" | "on_hold" | "rejected" | "accepted";
    terminatedBy?: string;
    type: "new" | "follow-up";
    reminder: boolean;
    meetingLink: string;
    sessionId?: string;
    clientId?: string;
    expiresAt?: string;
    isFree?: boolean;
    freeMinutes?: number;
    durationMins?: number;
    review?: {
        rating: number;
        comment: string;
    };
    pujaId?: string;
    askExpertForDate?: boolean;
    userMessage?: string;
    expertMessage?: string;
    scheduledTime?: string;
    pujaMode?: "online" | "home_visit_with" | "home_visit_without";
    price?: number;
}



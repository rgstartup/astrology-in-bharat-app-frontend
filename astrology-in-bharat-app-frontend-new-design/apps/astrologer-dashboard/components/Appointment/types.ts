export interface Appointment {
    id: number;
    name: string;
    service: string;
    date: string;
    status: "confirmed" | "pending" | "cancelled" | "active" | "completed" | "expired";
    type: "new" | "follow-up";
    reminder: boolean;
    meetingLink: string;
    sessionId?: number;
    clientId?: number;
}

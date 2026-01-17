export interface Appointment {
    id: number;
    name: string;
    service: string;
    date: string;
    status: "confirmed" | "pending" | "cancelled";
    type: "new" | "follow-up";
    reminder: boolean;
    meetingLink: string;
}

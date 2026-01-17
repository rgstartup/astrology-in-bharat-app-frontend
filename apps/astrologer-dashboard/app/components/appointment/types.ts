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

export interface StatsData {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}
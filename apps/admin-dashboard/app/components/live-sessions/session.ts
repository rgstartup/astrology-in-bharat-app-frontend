// live-sessions/types/session.types.ts
export interface User {
  id: string;
  name: string;
  avatar: string;
  rating: number;
}

export interface Astrologer {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  experience: number;
}

export type SessionType = "video" | "audio" | "chat";
export type SessionStatus = "live" | "pending" | "ended" | "technical-issue" | "expired" | "admin-terminated";

export type ConnectionQuality = "excellent" | "good" | "fair" | "poor";

export interface LiveSession {
  id: string;
  user: User;
  astrologer: Astrologer;
  sessionType: SessionType;
  status: SessionStatus;
  startTime: Date;
  duration: number;
  connectionQuality: ConnectionQuality;
  chatMessages: number;
  recording: boolean;
  lastActive: Date;
  issues?: string[];
}




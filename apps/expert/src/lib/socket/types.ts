export enum ExpertClientStatus {
  ONLINE = "online",
  BUSY = "busy",
  OFFLINE = "offline",
}

export type AvailabilityMode = "available" | "unavailable";

export interface PresenceChangedEventPayload {
  expertId: number;
  status: ExpertClientStatus;
  timestamp: string;
}

export interface LegacyPresenceEventPayload {
  expert_id?: number | string;
  userId?: number | string;
  id?: number | string;
  is_available?: boolean;
  status?: string;
  timestamp?: string | number;
}

export interface HeartbeatAck {
  status: "ok" | "error";
  timestamp?: number;
  message?: string;
}

export interface ExpertFullAvailabilityResponse {
  expertId: number;
  realtimePresence: "connected" | "disconnected";
  availabilityMode: AvailabilityMode;
  consultationState: "idle" | "busy";
  status: ExpertClientStatus;
  isAvailableForConsultation: boolean;
}

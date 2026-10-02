export enum ExpertClientStatus {
  ONLINE = "online",
  BUSY = "busy",
  OFFLINE = "offline",
}

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
  is_busy?: boolean;
  timestamp?: string | number;
}

export interface SubscribeExpertPresenceAck {
  expertId: number;
  status: ExpertClientStatus;
  message?: string;
}

export interface HeartbeatAck {
  status: "ok" | "error";
  timestamp?: number;
  message?: string;
}

export interface PresenceRecord {
  status: ExpertClientStatus;
  isAvailableForConsultation: boolean;
  lastUpdated: number;
}

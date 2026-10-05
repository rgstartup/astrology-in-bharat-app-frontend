export enum ExpertClientStatus {
  ONLINE = "online",
  BUSY = "busy",
  OFFLINE = "offline",
}

export interface PresenceChangedEventPayload {
  expertId: number;
  status: ExpertClientStatus;
  timestamp: string;
  lastSeenAt?: string | null;
}

export interface PresenceSubscriptionSnapshot {
  expertId: number;
  status: ExpertClientStatus;
  lastSeenAt?: string | null;
}

export interface SubscribeExpertPresenceAck {
  expertId: number;
  status: ExpertClientStatus;
  lastSeenAt?: string | null;
  message?: string;
}

export interface SubscribeManyPresenceAck {
  subscribed: PresenceSubscriptionSnapshot[];
}

/** Ack for the expert-only `presence:heartbeat` (payload-less, guarded). */
export interface PresenceHeartbeatAck {
  status: string;
  timestamp: number;
}

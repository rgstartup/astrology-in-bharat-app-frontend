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
  lastSeenAt: string | null;
}

/**
 * REST-seed boundary parser. REST cards carry `boolean | string` seeds
 * (`isAvailableForConsultation ?? status ?? is_available`); the socket
 * layer only speaks `ExpertClientStatus`. Single conversion point so
 * realtime code itself stays strictly typed.
 */
export const toExpertStatus = (
  value: boolean | ExpertClientStatus | string | undefined | null,
): ExpertClientStatus => {
  if (value === true || value === ExpertClientStatus.ONLINE) {
    return ExpertClientStatus.ONLINE;
  }
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    if (lower === "online" || lower === "available") {
      return ExpertClientStatus.ONLINE;
    }
    if (lower === "busy") {
      return ExpertClientStatus.BUSY;
    }
  }
  return ExpertClientStatus.OFFLINE;
};

export interface SubscribeExpertPresenceAck {
  expertId: number;
  status: ExpertClientStatus;
  lastSeenAt: string | null;
}

export interface UnsubscribeExpertPresenceAck {
  expertId: number;
  status: "unsubscribed";
}

export interface UnsubscribeManyPresenceAck {
  unsubscribed: number[];
}

export interface SubscribeManyPresenceAck {
  subscribed: PresenceSubscriptionSnapshot[];
}

export interface PresenceRecord {
  status: ExpertClientStatus;
  isAvailableForConsultation: boolean;
  lastUpdated: number;
  lastSeenAt?: string | null;
}

export interface ConsultationRoomsResult {
  consultationId: number;
  room: unknown;
}

export type ConsultationMode = "chat" | "voice" | "video";
export type ConsultationState = "requested" | "accepted" | "active" | "paused" | "completed" | "rejected" | "cancelled";

export interface ConsultationStatePayload {
  consultationId: number;
  sessionId?: number | null;
  mode: ConsultationMode;
  state: ConsultationState;
  reason?: string;
  startedAt?: string | null;
  elapsedSeconds?: number;
  maxMinutes?: number;
  ratePerMinute?: number;
  timestamp: string;
  token?: string;
  tokenExpiresAt?: string;
  channelName?: string;
}

export interface ConsultationEndedPayload {
  consultationId: number;
  sessionId?: number | null;
  mode: ConsultationMode;
  endedBy: string;
  reason: string;
  totalDurationSeconds?: number;
  timestamp: string;
}

export interface ConsultationActionAck {
  status: string;
  consultationId: number;
  payload?: ConsultationStatePayload | ConsultationEndedPayload;
  message?: string;
  /** Accept-time Agora voice token (voice/video), returned on accept. */
  token?: string;
  tokenExpiresAt?: string;
  channelName?: string;
}

export interface ConsultationBudgetHoldPayload {
  consultationId: number;
  sessionId?: number | null;
  mode: ConsultationMode;
  state: "budget_hold";
  reason: "insufficient_balance";
  graceDeadline: string;
  graceDurationSeconds: number;
  rechargeRequired?: boolean;
  minRechargeAmount?: number;
  waitingForClient?: boolean;
  timestamp: string;
}

export interface ConsultationBudgetTickPayload {
  consultationId: number;
  sessionId?: number | null;
  mode: ConsultationMode;
  remainingSeconds: number;
  elapsedSeconds: number;
  maxMinutes: number;
  ratePerMinute: number;
  timestamp: string;
}

export interface ConsultationBudgetWarningPayload {
  consultationId: number;
  sessionId?: number | null;
  mode: ConsultationMode;
  remainingSeconds: number;
  message?: string;
  timestamp: string;
}

export interface ConsultationMediaReadyPayload {
  consultationId: number;
  actorType: "client" | "expert";
  actorId: number;
  clientReady: boolean;
  expertReady: boolean;
  bothReady: boolean;
  timestamp: string;
}

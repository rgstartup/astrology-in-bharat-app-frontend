export interface CallSignalPayload {
  consultationId: number;
  offer?: Record<string, unknown>;
  answer?: Record<string, unknown>;
  candidate?: Record<string, unknown>;
}

export interface CallEndedPayload {
  consultationId: number;
  reason?: string;
  endedBy?: number | string;
}

export interface JoinCallAck {
  status: string;
  consultationId: number;
}

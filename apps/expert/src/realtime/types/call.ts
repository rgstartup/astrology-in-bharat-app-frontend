import type { ConsultationMode } from "./consultation";

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
  /** Room mode the join was metered under (echoes the requested mode). */
  /** Backend `consultationStatus`; null when the caller is not a participant. */
  consultationStatus?: string | null;
  maxMinutes?: number;
  startedAt?: string | null;
  elapsedSeconds?: number;
  clientName?: string | null;
  /**
   * Voice token minted by the backend voice provider (RTC token scoped to
   * the ack `channelName`). Absent when issuance failed or the join was
   * ignored — the caller must not attempt media join without it.
   */
  token?: string;
  tokenExpiresAt?: string;
  /**
   * Media channel the token is scoped to. Opaque to the app: pass it to the
   * RTC session verbatim, never construct or parse it locally.
   */
  channelName?: string;
}

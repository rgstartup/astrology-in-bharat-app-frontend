"use server";

import {
  apiV2,
  AUTH_COOKIE_NAMES,
  API_ROUTES,
  type ApiErrorBody,
} from "@/actions";
import { getAccessToken } from "@/actions/cookie";
import { ConsultationMode } from "@/store/consultationPrepStore";
import { type IExpert } from "@repo/lib";

export interface SomeoneElseData {
  name: string;
  gender: string;
  dob: string;
  tob: string;
  pob: string;
}

export interface InitiateConsultationData {
  consultationId: number;
  sessionId: number;
  maxMinutes: number;
  requestExpiresInSec: number;
}

/** Extra fields the backend attaches to initiate domain-error bodies. */
export interface InitiateConsultationErrorBody extends ApiErrorBody {
  existingConsultationId?: number;
  existingExpertId?: number;
}

/**
 * Plain (JSON-serializable) result for consultation initiation. The `ApiError`
 * class does not survive the "use server" flight boundary (client receives
 * message + stack only), so the error code is extracted here, server-side,
 * while the full error is still available.
 */
export type InitiateConsultationResult =
  | { ok: true; data: InitiateConsultationData }
  | {
      ok: false;
      code?: string;
      message: string;
      body?: InitiateConsultationErrorBody;
    };

/**
 * Unified initiate action for all consultation modes (chat | voice).
 *
 * Calls the single `POST /v1/client/consultations/initiate` endpoint which
 * replaces the deprecated `POST /client/chat/initiate` and
 * `POST /client/voice/initiate` aliases. Shapes match `InitiateConsultationResult`
 * (consultation/session IDs, budget, request window) and the same domain
 * error codes (`ACTIVE_CONSULTATION_EXISTS`, `EXPERT_BUSY_IN_CONSULTATION`,
 * `INSUFFICIENT_BALANCE`).
 *
 * @param expertId - Expert being consulted.
 * @param mode - `"chat"` or `"voice"` (video has no initiate core yet).
 * @param metadata - Optional someone-else details (chat only; voice ignores).
 * @param consultationId - Optional existing consultation to re-initiate into.
 */
export async function initiateConsultationAction(
  expertId: number | string,
  mode: ConsultationMode,
  metadata: SomeoneElseData | null = null,
  consultationId?: number,
): Promise<InitiateConsultationResult> {
  const accessToken = await getAccessToken();

  const res = await apiV2
    .extend({
      headers: {
        Cookie: `${AUTH_COOKIE_NAMES.ACCESS_TOKEN}=${accessToken}`,
      },
    })
    .post<InitiateConsultationData, InitiateConsultationErrorBody>(
      API_ROUTES.CONSULTATION.INITIATE,
      {
        expert_id: Number(expertId),
        mode,
        ...(consultationId != null ? { consultation_id: consultationId } : {}),
        ...(metadata ? { metadata } : {}),
      },
    );

  if (res.ok) return { ok: true, data: res.data };

  const err = res.error;
  return {
    ok: false,
    code: err.body?.errorCode ?? err.errorCode,
    message: err.message,
    body: err.body,
  };
}
export interface ChatHistoryAttachment {
  url: string;
  mimeType?: string | null;
}

/** Single message inside a history session (mirrors backend `ChatHistoryMessageDto`). */
export interface ChatHistoryMessageDto {
  id: number;
  sessionId?: number | null;
  senderId: number;
  senderType: string;
  content: string;
  timestamp: string;
  attachments: ChatHistoryAttachment[];
}

/** Single session bucket in the nested history contract. */
export interface ChatHistorySessionDto {
  sessionId: number;
  status: string;
  mode?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
  endedReason?: string | null;
  messages: ChatHistoryMessageDto[];
}

/**
 * Nested history contract: consultation → sessions → messages → attachments.
 * Mirrors backend `ChatHistoryResponseDto` (`GET /client/chat/history/:id`).
 */
export interface ChatHistoryResponse {
  consultationId: number;
  expertId: number;
  sessions: ChatHistorySessionDto[];
}

/**
 * Fetch persisted history for a consultation the client participates in.
 */
export async function getChatHistoryAction(consultationId: number) {
  const accessToken = await getAccessToken();

  return apiV2
    .extend({
      headers: {
        Cookie: `${AUTH_COOKIE_NAMES.ACCESS_TOKEN}=${accessToken}`,
      },
    })
    .get<ChatHistoryResponse>(`${API_ROUTES.CHAT.HISTORY}/${consultationId}`);
}

/**
 * Fetch expert for chat prep via canonical /experts/:id.
 */
export async function getChatPrepExpertAction(expertId: string | number) {
  return apiV2.get<IExpert>(
    API_ROUTES.EXPERTS.ACCOUNT.replace(":id", String(expertId)),
  );
}

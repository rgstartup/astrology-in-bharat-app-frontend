"use server";

import { apiV2, AUTH_COOKIE_NAMES, API_ROUTES, type ApiErrorBody } from "@/actions";
import { getAccessToken } from "@/actions/cookie";
import { type IExpert } from "@repo/lib";

export interface SomeoneElseData {
  name: string;
  gender: string;
  dob: string;
  tob: string;
  pob: string;
}

export interface InitiateChatData {
  consultationId: number;
  sessionId: number;
  maxMinutes: number;
  requestExpiresInSec: number;
}

/** Extra fields the backend attaches to chat domain-error bodies. */
export interface InitiateChatErrorBody extends ApiErrorBody {
  existingConsultationId?: number;
  existingExpertId?: number;
}

/**
 * Plain (JSON-serializable) result for chat initiation. The `ApiError`
 * class does not survive the "use server" flight boundary (client receives
 * message + stack only), so the error code is extracted here, server-side,
 * while the full error is still available.
 */
export type InitiateChatResult =
  | { ok: true; data: InitiateChatData }
  | {
      ok: false;
      code?: string;
      message: string;
      body?: InitiateChatErrorBody;
    };

export async function initiateChatAction(
  expertId: string | number,
  metadata: SomeoneElseData | null,
  consultationId?: number,
): Promise<InitiateChatResult> {
  const accessToken = await getAccessToken();

  const res = await apiV2
    .extend({
      headers: {
        Cookie: `${AUTH_COOKIE_NAMES.ACCESS_TOKEN}=${accessToken}`,
      },
    })
    .post<InitiateChatData, InitiateChatErrorBody>(API_ROUTES.CHAT.INITIATE, {
      expert_id: Number(expertId),
      ...(consultationId != null ? { consultation_id: consultationId } : {}),
      ...(metadata ? { metadata } : {}),
    });

  if (res.ok) return { ok: true, data: res.data };

  const err = res.error;
  return {
    ok: false,
    code: err.body?.errorCode ?? err.errorCode,
    message: err.message,
    body: err.body,
  };
}

/** Single file attachment on a history message (mirrors backend `ChatHistoryAttachmentDto`). */
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
  messages: ChatHistoryMessageDto[];
}

/**
 * Nested history contract: consultation → sessions → messages → attachments.
 * Mirrors backend `ChatHistoryResponseDto` (`GET /client/chat/history/:id`).
 */
export interface ChatHistoryResponse {
  consultationId: number;
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
    .get<ChatHistoryResponse>(
      `${API_ROUTES.CHAT.HISTORY}/${consultationId}`,
    );
}

/**
 * Fetch expert for chat prep via canonical /experts/:id.
 */
export async function getChatPrepExpertAction(expertId: string | number) {
  return apiV2.get<IExpert>(API_ROUTES.EXPERTS.ACCOUNT.replace(":id", String(expertId)));
}

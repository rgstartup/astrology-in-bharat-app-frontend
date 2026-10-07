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

export async function initiateChatAction(
  expertId: string | number,
  metadata: SomeoneElseData | null,
  consultationId?: number,
) {
  const accessToken = await getAccessToken();

  return apiV2
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
}

/**
 * Fetch expert for chat prep via canonical /experts/:id.
 */
export async function getChatPrepExpertAction(expertId: string | number) {
  return apiV2.get<IExpert>(API_ROUTES.EXPERTS.ACCOUNT.replace(":id", String(expertId)));
}

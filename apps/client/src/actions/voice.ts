"use server";

import { apiV2, AUTH_COOKIE_NAMES, API_ROUTES, type ApiErrorBody } from "@/actions";
import { getAccessToken } from "@/actions/cookie";

export interface VoiceEligibilityData {
  isEligibleForFree: boolean;
  freeMinutes: number;
  hasBalance: boolean;
  minBalanceRequired: number;
  currentBalance: number;
  voicePrice: number;
  expertIsAvailable: boolean;
}

export interface VoiceTokenData {
  token: string;
  identity: string;
  channelName: string;
  expiresAt: string;
}

export type VoiceActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; code?: string; message: string };

function toErrorResult(err: {
  body?: { errorCode?: string };
  errorCode?: string;
  message: string;
}): { ok: false; code?: string; message: string } {
  return {
    ok: false,
    code: err.body?.errorCode ?? err.errorCode,
    message: err.message,
  };
}

function authHeaders(accessToken: string | undefined) {
  return {
    headers: {
      Cookie: `${AUTH_COOKIE_NAMES.ACCESS_TOKEN}=${accessToken}`,
    },
  };
}

export async function checkVoiceEligibilityAction(
  expertId: number | string,
): Promise<VoiceActionResult<VoiceEligibilityData>> {
  const accessToken = await getAccessToken();
  const res = await apiV2
    .extend(authHeaders(accessToken))
    .get<VoiceEligibilityData>(
      `${API_ROUTES.VOICE.ELIGIBILITY}?expertId=${Number(expertId)}`,
    );
  if (res.ok) return { ok: true, data: res.data };
  return toErrorResult(res.error);
}

/**
 * Fetches a voice media token for a consultation.
 *
 * @deprecated The consultation voice room now joins media through the
 * realtime `joinCall` ack token (`@/realtime/topics/call`). This REST
 * endpoint still mints Twilio Video tokens and will be removed.
 */
export async function getVoiceTokenAction(
  consultationId: number,
): Promise<VoiceActionResult<VoiceTokenData>> {
  const accessToken = await getAccessToken();
  const res = await apiV2
    .extend(authHeaders(accessToken))
    .get<VoiceTokenData>(`${API_ROUTES.VOICE.TOKEN}/${consultationId}`);
  if (res.ok) return { ok: true, data: res.data };
  return toErrorResult(res.error);
}

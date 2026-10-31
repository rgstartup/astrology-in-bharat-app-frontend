"use server";

import { cookies } from "next/headers";
import {
  apiV2,
  API_ROUTES,
  AUTH_COOKIE_NAMES,
  Result,
  ApiError,
} from "@/actions";
import {
  setAccessToken,
  setRefreshToken,
  clearAuthCookies,
  getAccessToken,
} from "./cookie";
import type { IAuthUser } from "@/store/authStore";

import type { AuthResponse, AuthActionResponse } from "@/lib/types";
import { UnauthorizedErrorResult } from "@/shared/error";

// ─────────────────────────────────────────────────────────
// LOGIN — Calls backend via api (Server-Side Only)
// ─────────────────────────────────────────────────────────
// SOCKET TOKEN — Exposes the HttpOnly accessToken to the realtime
// socket handshake (`auth: { token }`). Never called for credentials,
// only to re-authenticate the already-established session on `/realtime`.
// ─────────────────────────────────────────────────────────
export async function getSocketTokenAction(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value ?? null;
}

// ─────────────────────────────────────────────────────────
// COMPLETE REGISTRATION
// ─────────────────────────────────────────────────────────
export async function completeRegistrationAction(
  payload: any,
): Promise<AuthActionResponse> {
  console.log(
    "[DEBUG][ServerAction] completeRegistrationAction called with payload:",
    JSON.stringify(
      {
        email: payload.email,
        token: payload.token
          ? payload.token.substring(0, 30) + "..."
          : "MISSING TOKEN",
        name: payload.name,
        phone: payload.phone,
        gender: payload.gender,
        maritalStatus: payload.maritalStatus,
        occupation: payload.occupation,
        birthDetails: payload.birthDetails,
      },
      null,
      2,
    ),
  );

  const result = await apiV2.post<AuthResponse>(
    "/auth/email/register/complete",
    payload,
  );

  if (!result.ok) {
    return { error: result.error.message };
  }

  const cookieStore = await cookies();

  const accessToken = result.data.accessToken;
  const refreshToken = result.data.refreshToken;

  if (accessToken) {
    setAccessToken(cookieStore, accessToken);
  }

  if (refreshToken) {
    setRefreshToken(cookieStore, refreshToken);
  }

  return { success: true, user: result.data.user };
}

// ─────────────────────────────────────────────────────────
// VERIFY EMAIL — Calls backend email verification endpoint
// ─────────────────────────────────────────────────────────
export async function verifyEmailAction(
  token: string,
): Promise<AuthActionResponse> {
  const result = await apiV2.get<AuthResponse>(
    `/client/auth/email/verify?token=${encodeURIComponent(token)}`,
  );

  if (!result.ok) {
    return result.error;
  }

  const cookieStore = await cookies();
  const { accessToken, refreshToken, user, message } = result.data;

  if (accessToken) {
    setAccessToken(cookieStore, accessToken);
  }

  if (refreshToken) {
    setRefreshToken(cookieStore, refreshToken);
  }

  return { success: true, user, message };
}

// ─────────────────────────────────────────────────────────
// GET CURRENT USER — Server-Side action using HttpOnly accessToken cookie
// ─────────────────────────────────────────────────────────
export async function getMeAction(): Promise<Result<IAuthUser>> {
  const token = await getAccessToken();
  if (!token) return UnauthorizedErrorResult;

  return apiV2
    .extend({
      headers: {
        Cookie: `${AUTH_COOKIE_NAMES.ACCESS_TOKEN}=${token}`,
      },
    })
    .get<IAuthUser>(API_ROUTES.AUTH.ME);
}

// ─────────────────────────────────────────────────────────
// GET WALLET BALANCE — Server-Side action using HttpOnly accessToken cookie
// ─────────────────────────────────────────────────────────
export async function getWalletBalanceAction(): Promise<
  Result<{ balance: number }>
> {
  const token = await getAccessToken();
  if (!token) return UnauthorizedErrorResult;

  return apiV2
    .extend({
      headers: {
        Cookie: `${AUTH_COOKIE_NAMES.ACCESS_TOKEN}=${token}`,
      },
    })
    .get<{ balance: number }>(API_ROUTES.WALLET.ROOT);
}

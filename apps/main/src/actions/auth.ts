"use server";

import { cookies } from "next/headers";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { getErrorMessage } from "@repo/lib";

import {
  LoginFormData,
  RegisterFormData,
  AuthResponse,
  AuthActionResponse
} from "@/lib/types";

// ─────────────────────────────────────────────────────────
// LOGIN — Calls backend via api (Server-Side Only)
// Credentials NEVER appear in the browser Network tab.
// ─────────────────────────────────────────────────────────
export async function loginAction(formData: LoginFormData): Promise<AuthActionResponse> {
  const [data, error] = await api.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, formData) as any;

  if (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  // Set HttpOnly cookies on the server — JS on browser can NEVER read these
  const cookieStore = await cookies();

  if (data?.accessToken) {
    cookieStore.set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  if (data?.refreshToken) {
    cookieStore.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return { success: true, user: data?.user };
}

// ─────────────────────────────────────────────────────────
// LOGOUT — Clears HttpOnly cookies server-side
// ─────────────────────────────────────────────────────────
export async function logoutAction(): Promise<AuthActionResponse> {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  return { success: true };
}

// ─────────────────────────────────────────────────────────
// DEV TESTING: Set Expired Access Token Only
// (Tests standard silent refresh: Access token is expired, 
//  but valid refresh token obtains a new one automatically)
// ─────────────────────────────────────────────────────────
export async function setExpiredAccessTokenAction(): Promise<AuthActionResponse> {
  const cookieStore = await cookies();
  
  // Set access token to an expired value
  cookieStore.set("accessToken", "expired-access-token-placeholder", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: -3600, // already expired!
  });

  return { success: true };
}

// ─────────────────────────────────────────────────────────
// DEV TESTING: Set Expired/Invalid Access & Refresh Tokens
// (Tests logout/redirection flow: Refresh token is expired 
//  and api call fails with 401, triggering redirect to login)
// ─────────────────────────────────────────────────────────
export async function setExpiredRefreshTokenAction(): Promise<AuthActionResponse> {
  const cookieStore = await cookies();
  
  // Set both to already expired / invalid placeholders
  cookieStore.set("accessToken", "expired-access-token-placeholder", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: -3600, // already expired!
  });

  cookieStore.set("refreshToken", "expired-refresh-token-placeholder", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: -3600, // already expired!
  });

  return { success: true };
}

// ─────────────────────────────────────────────────────────
// REGISTER (OLD) — Calls backend via api (Server-Side Only)
// ─────────────────────────────────────────────────────────
export async function registerAction(registerData: RegisterFormData): Promise<AuthActionResponse> {
  const [data, error] = await api.post<AuthResponse>(
    API_ROUTES.AUTH.REGISTER,
    registerData,
  ) as any;

  if (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  return {
    success: true,
    message:
      data?.message || "Registration successful! Please verify your email.",
  };
}

// ─────────────────────────────────────────────────────────
// INITIATE REGISTRATION
// ─────────────────────────────────────────────────────────
export async function initiateRegistrationAction(email: string): Promise<AuthActionResponse> {
  const [data, error] = await api.post<any>(
    '/auth/email/register/initiate',
    { email },
  ) as any;

  if (error) {
    return { error: getErrorMessage(error) };
  }

  return {
    success: true,
    message: data?.message || "Verification email sent.",
  };
}

// ─────────────────────────────────────────────────────────
// COMPLETE REGISTRATION
// ─────────────────────────────────────────────────────────
export async function completeRegistrationAction(payload: any): Promise<AuthActionResponse> {
  console.log('[DEBUG][ServerAction] completeRegistrationAction called with payload:', JSON.stringify({
    email: payload.email,
    token: payload.token ? payload.token.substring(0, 30) + '...' : 'MISSING TOKEN',
    name: payload.name,
    phone: payload.phone,
    gender: payload.gender,
    maritalStatus: payload.maritalStatus,
    occupation: payload.occupation,
    birthDetails: payload.birthDetails,
  }, null, 2));

  const [data, error] = await api.post<AuthResponse>(
    '/auth/email/register/complete',
    payload,
  ) as any;

  console.log('[DEBUG][ServerAction] Response from backend - error:', error ? JSON.stringify(error) : 'none');
  console.log('[DEBUG][ServerAction] Response from backend - data:', data ? JSON.stringify({ hasAccessToken: !!data.accessToken, hasRefreshToken: !!data.refreshToken, user: data.user }) : 'none');

  if (error) {
    console.error('[DEBUG][ServerAction] Returning error:', getErrorMessage(error));
    return { error: getErrorMessage(error) };
  }

  const cookieStore = await cookies();

  if (data?.accessToken) {
    cookieStore.set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  if (data?.refreshToken) {
    cookieStore.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return { success: true, user: data?.user };
}


// ─────────────────────────────────────────────────────────
// VERIFY EMAIL — Calls backend, sets cookies on success
// ─────────────────────────────────────────────────────────
export async function verifyEmailAction(token: string): Promise<AuthActionResponse> {
  const [data, error] = await api.get<AuthResponse>(
    `${API_ROUTES.AUTH.VERIFY_EMAIL}?token=${encodeURIComponent(token)}`,
  ) as any;

  if (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  // Set HttpOnly cookies on the server, but only if they are fully registered
  const cookieStore = await cookies();
  const isFullyRegistered = !!data?.user?.name;

  if (isFullyRegistered) {
    if (data?.accessToken) {
      cookieStore.set("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    if (data?.refreshToken) {
      cookieStore.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }
  }

  return { success: true, user: data?.user, message: data?.message };
}

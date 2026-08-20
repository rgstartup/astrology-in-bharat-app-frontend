"use server";

import { cookies } from "next/headers";
import { api, API_ROUTES } from "@/actions";
import { getErrorMessage } from "@repo/lib";
import { setAccessToken, setRefreshToken } from "./cookie";

import {
  LoginFormData,
  RegisterFormData,
  AuthResponse,
  AuthActionResponse,
} from "@/lib/types";

// ─────────────────────────────────────────────────────────
// LOGIN — Calls backend via api (Server-Side Only)
// Credentials NEVER appear in the browser Network tab.
// ─────────────────────────────────────────────────────────
export async function loginAction(
  formData: LoginFormData,
): Promise<AuthActionResponse> {
  const [data, error] = await api.post<AuthResponse>(
    API_ROUTES.AUTH.LOGIN,
    formData,
  );

  if (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  // Set HttpOnly cookies on the server — JS on browser can NEVER read these
  const cookieStore = await cookies();

  if (data?.accessToken) {
    setAccessToken(cookieStore, data.accessToken);
  }

  if (data?.refreshToken) {
    setRefreshToken(cookieStore, data.refreshToken);
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
// REGISTER (OLD) — Calls backend via api (Server-Side Only)
// ─────────────────────────────────────────────────────────
export async function registerAction(
  registerData: RegisterFormData,
): Promise<AuthActionResponse> {
  const [data, error] = await api.post<AuthResponse>(
    API_ROUTES.AUTH.REGISTER,
    registerData,
  );

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
export async function initiateRegistrationAction(
  email: string,
): Promise<AuthActionResponse> {
  const [data, error] = (await api.post<any>("/auth/email/register/initiate", {
    email,
  })) as any;

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

  const [data, error] = (await api.post<AuthResponse>(
    "/auth/email/register/complete",
    payload,
  )) as any;

  console.log(
    "[DEBUG][ServerAction] Response from backend - error:",
    error ? JSON.stringify(error) : "none",
  );
  console.log(
    "[DEBUG][ServerAction] Response from backend - data:",
    data
      ? JSON.stringify({
          hasAccessToken: !!data.accessToken,
          hasRefreshToken: !!data.refreshToken,
          user: data.user,
        })
      : "none",
  );

  if (error) {
    console.error(
      "[DEBUG][ServerAction] Returning error:",
      getErrorMessage(error),
    );
    return { error: getErrorMessage(error) };
  }

  const cookieStore = await cookies();

  if (data?.accessToken) {
    setAccessToken(cookieStore, data.accessToken);
  }

  if (data?.refreshToken) {
    setRefreshToken(cookieStore, data.refreshToken);
  }

  return { success: true, user: data?.user };
}

// ─────────────────────────────────────────────────────────
// VERIFY EMAIL — Calls backend, sets cookies on success
// ─────────────────────────────────────────────────────────
export async function verifyEmailAction(
  token: string,
): Promise<AuthActionResponse> {
  const [data, error] = (await api.get<AuthResponse>(
    `${API_ROUTES.AUTH.VERIFY_EMAIL}?token=${encodeURIComponent(token)}`,
  )) as any;

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
      setAccessToken(cookieStore, data.accessToken);
    }

    if (data?.refreshToken) {
      setRefreshToken(cookieStore, data.refreshToken);
    }
  }

  return { success: true, user: data?.user, message: data?.message };
}

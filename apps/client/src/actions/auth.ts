"use server";

import { cookies } from "next/headers";
import { apiV2, API_ROUTES } from "@/actions";
import { setAccessToken, setRefreshToken, clearAuthCookies } from "./cookie";

import {
  LoginFormData,
  RegisterFormData,
  VerifyOtpFormData,
  AuthResponse,
  AuthActionResponse,
} from "@/lib/types";

// ─────────────────────────────────────────────────────────
// LOGIN — Calls backend via api (Server-Side Only)
// Credentials NEVER appear in the browser Network tab.
// Supports OTP: when email is unverified, backend sends an OTP
// (409). The same endpoint is then re-called with { email, password, otp }
// to verify and log in.
// ─────────────────────────────────────────────────────────
export async function loginAction(
  formData: LoginFormData,
): Promise<AuthActionResponse> {
  const result = await apiV2.post<AuthResponse>(
    API_ROUTES.AUTH.LOGIN.EMAIL,
    formData,
  );

  if (!result.ok) {
    const errorMsg = result.error.message;
    const status = result.error.status;
    const errorCode = result.error.errorCode;
    const isUnverified =
      status === 409 ||
      errorCode === "EMAIL_NOT_VERIFIED" ||
      errorCode === "UNVERIFIED" ||
      errorCode === "USER_NOT_VERIFIED" ||
      /verify\s*your\s*email|not\s*verified|verify\s*otp|verification\s*required|account\s*not\s*verified|email\s*is\s*not\s*verified/i.test(
        errorMsg || "",
      );

    return {
      error: errorMsg,
      requiresVerification: isUnverified,
      isUnverified,
    };
  }

  // Set HttpOnly cookies on the server — JS on browser can NEVER read these
  const cookieStore = await cookies();

  const { accessToken, refreshToken } = result.data;

  if (accessToken) {
    setAccessToken(cookieStore, accessToken);
  }

  if (refreshToken) {
    setRefreshToken(cookieStore, refreshToken);
  }

  return { success: true };
}

// ─────────────────────────────────────────────────────────
// RESEND OTP — Re-initiates registration/verification for email
// ─────────────────────────────────────────────────────────
export async function resendOtpAction(
  email: string,
  password?: string,
): Promise<AuthActionResponse> {
  const payload: Record<string, any> = { email: email.trim() };
  if (password) {
    payload.password = password;
  }

  const result = await apiV2.post<{ message?: string }>(
    API_ROUTES.AUTH.REGISTER.INITIATE,
    payload,
  );

  if (!result.ok) {
    return {
      error: result.error.message,
    };
  }

  return {
    success: true,
    message:
      result.data.message || "OTP has been sent to your email successfully.",
  };
}

// ─────────────────────────────────────────────────────────
// LOGOUT — Clears HttpOnly cookies server-side
// ─────────────────────────────────────────────────────────
export async function logoutAction(): Promise<AuthActionResponse> {
  const cookieStore = await cookies();
  clearAuthCookies(cookieStore);
  return { success: true };
}

// ─────────────────────────────────────────────────────────
// REGISTER (2-Step Flow: Step 1) — Submits firstname, lastname, email, password
// ─────────────────────────────────────────────────────────
export async function registerAction(
  registerData: RegisterFormData,
): Promise<AuthActionResponse> {
  const firstName = registerData.first_name;
  const lastName = registerData.last_name;

  const payload: Record<string, any> = {
    first_name: firstName,
    email: registerData.email,
    password: registerData.password,
  };

  if (lastName) {
    payload.last_name = lastName;
  }

  const result = await apiV2.post<{ message?: string }>(
    API_ROUTES.AUTH.REGISTER.INITIATE,
    payload,
  );

  if (!result.ok) {
    return {
      error: result.error.message,
    };
  }

  return {
    success: true,
    message:
      result.data.message ||
      "Registration initiated! Please enter the OTP sent to your email.",
  };
}

// ─────────────────────────────────────────────────────────
// VERIFY OTP (Register 2-Step Flow: Step 2) — Submits email and otp only
// Upon verification, tokens are received and set in HttpOnly cookies
// ─────────────────────────────────────────────────────────
export async function verifyOtpAction(
  verifyData: VerifyOtpFormData,
): Promise<AuthActionResponse> {
  const result = await apiV2.post<AuthResponse>(
    API_ROUTES.AUTH.REGISTER.COMPLETE,
    {
      email: verifyData.email,
      otp: verifyData.otp,
    },
  );

  if (!result.ok) {
    return {
      error: result.error.message,
    };
  }

  const { accessToken, refreshToken } = result.data;

  const cookieStore = await cookies();

  if (accessToken) {
    setAccessToken(cookieStore, accessToken);
  }

  if (refreshToken) {
    setRefreshToken(cookieStore, refreshToken);
  }

  return {
    success: true,
    message: result.data.message,
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

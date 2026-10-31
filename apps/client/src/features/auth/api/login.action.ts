"use server";

import { cookies } from "next/headers";
import { apiV2, API_ROUTES } from "@/actions";
import { setAccessToken, setRefreshToken } from "@/actions/cookie";
import type {
  LoginFormData,
  AuthResponse,
  AuthActionResponse,
} from "@/lib/types";

// ─────────────────────────────────────────────────────────
// LOGIN — Calls backend via apiV2 (Server-Side Only)
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

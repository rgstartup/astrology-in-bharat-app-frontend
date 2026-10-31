"use server";

import { cookies } from "next/headers";
import { apiV2, API_ROUTES } from "@/actions";
import { setAccessToken, setRefreshToken } from "@/actions/cookie";
import type {
  VerifyOtpFormData,
  AuthResponse,
  AuthActionResponse,
} from "@/lib/types";

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

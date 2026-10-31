"use server";

import { apiV2, API_ROUTES } from "@/actions";
import type { AuthActionResponse } from "@/lib/types";

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

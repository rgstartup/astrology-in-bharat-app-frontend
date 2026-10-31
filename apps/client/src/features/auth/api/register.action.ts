"use server";

import { apiV2, API_ROUTES } from "@/actions";
import type { RegisterFormData, AuthActionResponse } from "@/lib/types";

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

"use server";

import { cookies } from "next/headers";
import api from "@/api/api";

export async function expertLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  return { success: true };
}

export async function expertForgotPasswordAction(
  email: string,
  origin: string,
) {
  const result = await api.post<any>("/auth/forgot/password", {
    email,
    origin,
  });

  if (!result.ok) {
    return { error: result.error?.message || "Failed to send reset link" };
  }

  return { success: true, message: "Password reset link sent successfully" };
}

export async function expertResetPasswordAction(
  password: string,
  token: string,
) {
  const result = await api.post<any>(`/auth/reset/password?token=${token}`, {
    password,
  });

  if (!result.ok) {
    return { error: result.error?.message || "Failed to reset password" };
  }

  return { success: true, message: "Password reset successful" };
}

export async function getSocketTokenAction(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || null;
}

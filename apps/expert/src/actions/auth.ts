"use server";

import { cookies } from "next/headers";
import api from "@/actions/api";
import { getErrorMessage } from "@repo/lib";

export async function expertLoginAction(formData: any) {
  const result = await api.post<any>("/auth/login", {
    ...formData,
    requiredRole: "expert",
  });

  if (!result.ok) {
    return { error: result.error?.message || "Login failed" };
  }

  const data = result.data;
  if (!data?.accessToken) {
    return { error: "No access token received" };
  }

  const cookieStore = await cookies();

  cookieStore.set("accessToken", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  if (data.refreshToken) {
    cookieStore.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return { success: true, user: data.user };
}

export async function expertInitiateRegistrationAction(email: string) {
  const result = await api.post<any>("/auth/email/register/initiate", {
    email,
    role: "expert",
  });

  if (!result.ok) {
    return { error: result.error?.message || "Registration failed" };
  }

  return { success: true, message: "Verification email sent successfully." };
}

export async function expertCompleteRegistrationAction(formData: any) {
  const result = await api.post<any>("/auth/email/register/complete", formData);

  if (!result.ok) {
    return { error: result.error?.message || "Profile completion failed" };
  }

  const data = result.data;
  const cookieStore = await cookies();

  if (data?.tokens?.accessToken) {
    cookieStore.set("accessToken", data.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  if (data?.tokens?.refreshToken) {
    cookieStore.set("refreshToken", data.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return {
    success: true,
    user: data?.user,
    message: "Profile completed successfully",
  };
}

export async function expertLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  return { success: true };
}

export async function expertVerifyEmailAction(token: string) {
  const result = await api.get<any>(
    `/auth/email/verify?token=${encodeURIComponent(token)}`,
  );

  if (!result.ok) {
    return { error: result.error?.message || "Verification failed" };
  }

  const data = result.data;
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

export async function expertForgotPasswordAction(email: string, origin: string) {
  const result = await api.post<any>("/auth/forgot/password", { email, origin });

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

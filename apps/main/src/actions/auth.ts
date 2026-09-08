"use server";

import { cookies } from "next/headers";
import { api, API_ROUTES } from "@/actions";
import { getErrorMessage } from "@repo/lib";
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
// ─────────────────────────────────────────────────────────
export async function loginAction(
  formData: LoginFormData,
): Promise<AuthActionResponse> {
  const [data, error] = await api.post<AuthResponse>(
    API_ROUTES.AUTH.CLIENT.LOGIN,
    formData,
  );

  if (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  // Set HttpOnly cookies on the server — JS on browser can NEVER read these
  const cookieStore = await cookies();

  const accessToken =
    data?.accessToken || data?.tokens?.accessToken || (data as any)?.token;
  const refreshToken = data?.refreshToken || data?.tokens?.refreshToken;

  if (accessToken) {
    setAccessToken(cookieStore, accessToken);
  }

  if (refreshToken) {
    setRefreshToken(cookieStore, refreshToken);
  }

  return { success: true, user: data?.user };
}

// ─────────────────────────────────────────────────────────
// LOGOUT — Clears HttpOnly cookies server-side
// ─────────────────────────────────────────────────────────
export async function logoutAction(): Promise<AuthActionResponse> {
  const cookieStore = await cookies();
  clearAuthCookies(cookieStore as any);
  return { success: true };
}

// ─────────────────────────────────────────────────────────
// REGISTER (2-Step Flow: Step 1) — Submits firstname, lastname, email, password
// ─────────────────────────────────────────────────────────
export async function registerAction(
  registerData: RegisterFormData,
): Promise<AuthActionResponse> {
  const firstName = registerData.first_name || (registerData as any).firstname;
  const lastName = registerData.last_name || (registerData as any).lastname;

  const payload: Record<string, any> = {
    first_name: firstName,
    email: registerData.email,
    password: registerData.password,
  };

  if (lastName) {
    payload.last_name = lastName;
  }

  const [data, error] = await api.post<{ message?: string }>(
    API_ROUTES.AUTH.CLIENT.REGISTER,
    payload,
  );

  if (error) {
    const errorMsg = getErrorMessage(error);
    console.error("[DEBUG][ServerAction] registerAction error:", errorMsg);
    return {
      error: errorMsg,
    };
  }

  return {
    success: true,
    message:
      data?.message ||
      "Registration initiated! Please enter the OTP sent to your email.",
  };
}

// ─────────────────────────────────────────────────────────
// VERIFY OTP (2-Step Flow: Step 2) — Submits email and otp only
// Upon verification, tokens are received and set in HttpOnly cookies
// ─────────────────────────────────────────────────────────
export async function verifyOtpAction(
  verifyData: VerifyOtpFormData,
): Promise<AuthActionResponse> {
  const [data, error] = await api.post<AuthResponse>(
    API_ROUTES.AUTH.CLIENT.VERIFY_OTP,
    {
      email: verifyData.email,
      otp: verifyData.otp,
    },
  );

  if (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  const accessToken =
    data?.accessToken || data?.tokens?.accessToken || (data as any)?.token;
  const refreshToken = data?.refreshToken || data?.tokens?.refreshToken;

  const cookieStore = await cookies();

  if (accessToken) {
    setAccessToken(cookieStore, accessToken);
  }

  if (refreshToken) {
    setRefreshToken(cookieStore, refreshToken);
  }

  return {
    success: true,
    user: data?.user,
    message: data?.message || "OTP verified successfully!",
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

  const [data, error] = await api.post<AuthResponse>(
    "/auth/email/register/complete",
    payload,
  );

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

  const accessToken =
    data?.accessToken || data?.tokens?.accessToken || (data as any)?.token;
  const refreshToken = data?.refreshToken || data?.tokens?.refreshToken;

  if (accessToken) {
    setAccessToken(cookieStore, accessToken);
  }

  if (refreshToken) {
    setRefreshToken(cookieStore, refreshToken);
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
    const accessToken =
      data?.accessToken || data?.tokens?.accessToken || (data as any)?.token;
    const refreshToken = data?.refreshToken || data?.tokens?.refreshToken;

    if (accessToken) {
      setAccessToken(cookieStore, accessToken);
    }

    if (refreshToken) {
      setRefreshToken(cookieStore, refreshToken);
    }
  }

  return { success: true, user: data?.user, message: data?.message };
}

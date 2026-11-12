"use server";

import { cookies } from "next/headers";
import { ValidationError } from "@repo/lib";
import { setAccessToken, setRefreshToken } from "@/actions/cookie";
import { API_ROUTES } from "@/utils/api.routes";
import { captureSetCookies, mirrorSetCookies } from "@/utils/forwarded-cookies";
import api from "@/api/api";

import { RegisterFormData, RegisterSchema } from "../schemas/register.schema";

export type IRegisterResponse = {
  accessToken?: string;
  refreshToken?: string;
};

export type RegisterActionError = {
  message: string;
  errorCode?: string;
  status?: number;
};

export type RegisterActionResult =
  | {
      ok: true;
      requiresOtp: boolean;
      message?: string;
      data?: IRegisterResponse;
    }
  | {
      ok: false;
      error: RegisterActionError;
      requiresOtp?: boolean;
    };

/**
 * Server action to register an expert.
 * Supports dual-phase registration:
 * 1. When `otp` is omitted: calls initiate endpoint to send verification OTP via email.
 * 2. When `otp` is provided: calls complete endpoint to verify OTP, hash password, create account, and set cookies.
 *
 * @param formData - Form data containing firstName, optional lastName, email, password, and optional otp
 * @returns Serialized result indicating whether OTP is required or registration completed with session tokens
 */
export async function registerAction(
  formData: RegisterFormData,
): Promise<RegisterActionResult> {
  const safeParseResult = RegisterSchema.safeParse(formData);

  if (!safeParseResult.success) {
    const valError = ValidationError.fromZod(safeParseResult.error);
    return {
      ok: false,
      error: {
        message: valError.message,
        errorCode: "VALIDATION_ERROR",
        status: 422,
      },
    };
  }

  const { firstName, lastName, email, password, otp } = safeParseResult.data;

  // Phase 1: No OTP provided -> Initiate registration
  if (!otp) {
    const initiateResult = await api.post<{
      success: boolean;
      message: string;
    }>(API_ROUTES.AUTH.REGISTER_INITIATE, { email });

    if (!initiateResult.ok) {
      return {
        ok: false,
        error: {
          message:
            initiateResult.error.message || "Failed to initiate registration",
          errorCode: initiateResult.error.errorCode,
          status: initiateResult.error.status,
        },
      };
    }

    return {
      ok: true,
      requiresOtp: true,
      message:
        initiateResult.data?.message || "OTP sent successfully to your email.",
    };
  }

  // Phase 2: OTP provided -> Complete registration
  let backendSetCookies: string[] = [];
  const fullName = `${firstName} ${lastName || ""}`.trim();

  const completeResult = await api
    .extend({
      onResponse: (_data, res) => {
        backendSetCookies = captureSetCookies(res.headers);
      },
    })
    .post<IRegisterResponse>(API_ROUTES.AUTH.REGISTER_COMPLETE, {
      email,
      password,
      name: fullName,
      otp,
    });

  if (!completeResult.ok) {
    return {
      ok: false,
      error: {
        message:
          completeResult.error.message || "Failed to complete registration",
        errorCode: completeResult.error.errorCode,
        status: completeResult.error.status,
      },
    };
  }

  const { data } = completeResult;

  if (data?.accessToken && data?.refreshToken) {
    const cookieStore = await cookies();
    const mirrored = mirrorSetCookies(cookieStore, backendSetCookies);
    if (mirrored.length === 0) {
      setAccessToken(cookieStore, data.accessToken);
      setRefreshToken(cookieStore, data.refreshToken);
    }
  }

  return {
    ok: true,
    requiresOtp: false,
    data,
  };
}

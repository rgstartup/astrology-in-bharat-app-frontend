"use server";

import { cookies } from "next/headers";
import { ExpertAuthErrorCode, ValidationError } from "@repo/lib";
import { setAccessToken, setRefreshToken } from "@/actions/cookie";
import { API_ROUTES } from "@/utils/api.routes";
import { captureSetCookies, mirrorSetCookies } from "@/utils/forwarded-cookies";
import api from "@/actions/api";

import { LoginFormData, LoginSchema } from "../schemas/login.schema";

export type ILoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type LoginActionError = {
  message: string;
  errorCode?: string;
  status?: number;
};

export type LoginActionResult =
  | {
      ok: true;
      data: ILoginResponse;
    }
  | {
      ok: false;
      error: LoginActionError;
      isUnverified?: boolean;
    };

/**
 * Server action to authenticate an expert via email and password (and optional OTP).
 * Handles unverified email responses (409 / EMAIL_NOT_VERIFIED) by signalling `isUnverified: true`.
 * Mirrored session cookies are set on successful authentication.
 *
 * @param formData - The submitted login form data (email, password, optional OTP)
 * @returns Serialized result indicating success with session tokens or failure with error details and verification flags
 */
export async function loginAction(formData: LoginFormData): Promise<LoginActionResult> {
  const safeParseResult = LoginSchema.safeParse(formData);

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

  let backendSetCookies: string[] = [];
  const result = await api
    .extend({
      onResponse: (_data, res) => {
        backendSetCookies = captureSetCookies(res.headers);
      },
    })
    .post<ILoginResponse>(API_ROUTES.AUTH.LOGIN.EMAIL, safeParseResult.data);

  if (!result.ok) {
    const status = result.error.status;
    const errorCode =
      result.error.errorCode ?? (result.error as any).body?.errorCode;
    const isUnverified =
      status === 409 ||
      errorCode === ExpertAuthErrorCode.EMAIL_NOT_VERIFIED;

    return {
      ok: false,
      error: {
        message: result.error.message,
        errorCode,
        status,
      },
      isUnverified,
    };
  }

  const { data } = result;

  // Token existence check
  if (!data?.accessToken) {
    return {
      ok: false,
      error: {
        message: "Something went wrong, contact support",
        status: 500,
      },
    };
  }

  const cookieStore = await cookies();

  const mirrored = mirrorSetCookies(cookieStore, backendSetCookies);
  if (mirrored.length === 0) {
    setAccessToken(cookieStore, data.accessToken);
    setRefreshToken(cookieStore, data.refreshToken);
  }

  return {
    ok: true,
    data,
  };
}


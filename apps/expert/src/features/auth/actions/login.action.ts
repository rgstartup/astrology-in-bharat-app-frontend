"use server";

import { cookies } from "next/headers";
import { ApiError, type Result } from "@repo/safe-fetch";

import { ValidationError } from "@repo/lib";
import { setAccessToken, setRefreshToken } from "@/actions/cookie";
import { API_ROUTES } from "@/utils/api.routes";
import api from "@/actions/api";

import { LoginFormData, LoginSchema } from "../schemas/login.schema";

export type ILoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function loginAction(formData: LoginFormData): Promise<Result<ILoginResponse>> {
  const safeParseResult = LoginSchema.safeParse(formData);

  if (!safeParseResult.success) {
    return { ok: false, error: ValidationError.fromZod(safeParseResult.error) };
  }

  const result = await api.post<ILoginResponse>(API_ROUTES.AUTH.LOGIN.EMAIL, safeParseResult.data);

  if (!result.ok) {
    return result;
  }

  const { data } = result;

  // Token existence check
  if (!data?.accessToken) {
    return {
      ok: false,
      error: new ApiError({ status: 500, message: "Something went wrong, contact support" }),
    };
  }

  const cookieStore = await cookies();

  setAccessToken(cookieStore, data.accessToken);
  setRefreshToken(cookieStore, data.refreshToken);

  return result;
}

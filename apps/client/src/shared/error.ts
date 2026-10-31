import { ApiError, type Result } from "@/actions/index";

const UnauthorizedError = new ApiError({
  status: 401,
  message: "unauthorized",
  errorCode: "UNAUTHORIZED",
});

export const UnauthorizedErrorResult: Result<never> = {
  ok: false,
  error: UnauthorizedError,
};

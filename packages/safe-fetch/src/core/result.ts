import { ApiErrorBody, ApiError } from "./error";

export type Result<T, TErrorBody extends ApiErrorBody = ApiErrorBody> =
  | { ok: true; data: T; error?: never }
  | { ok: false; error: ApiError<TErrorBody>; data?: never };

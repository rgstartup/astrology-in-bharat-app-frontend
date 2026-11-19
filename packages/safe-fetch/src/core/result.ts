import { ApiErrorBody, ApiError } from "./error";

export type Result<T, TErrorBody extends ApiErrorBody = ApiErrorBody> =
  | { ok: true; data: T; error?: never; meta?: unknown }
  | { ok: false; error: ApiError<TErrorBody>; data?: T | null; meta?: unknown };

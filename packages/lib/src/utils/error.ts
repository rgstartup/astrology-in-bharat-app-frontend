import { ApiError } from "@repo/safe-fetch";

export const getErrorMessage = (error: unknown): string => {
  if (!error) return "";
  if (typeof error === "string") return error;

  if (error instanceof ApiError) {
    if (Array.isArray(error.body?.message)) {
      return error.body.message.join(", ");
    }
    if (typeof error.body?.message === "string" && error.body.message.trim()) {
      return error.body.message;
    }
    if (error.message && typeof error.message === "string") {
      return error.message;
    }
  }

  if (typeof error === "object") {
    const err = error as Record<string, any>;
    if (Array.isArray(err.body?.message)) {
      return err.body.message.join(", ");
    }
    if (typeof err.body?.message === "string" && err.body.message.trim()) {
      return err.body.message;
    }
    if (Array.isArray(err.message)) {
      return err.message.join(", ");
    }
    if (typeof err.message === "string" && err.message.trim()) {
      return err.message;
    }
    if (typeof err.error === "string" && err.error.trim()) {
      return err.error;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  const str = String(error);
  return str === "[object Object]" ? "" : str;
};

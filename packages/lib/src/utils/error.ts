import { ApiError } from "@repo/safe-fetch";

export const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.body?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

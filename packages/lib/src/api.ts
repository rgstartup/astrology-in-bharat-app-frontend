import { createSafeFetchInstance } from "@repo/safe-fetch";

export const api = createSafeFetchInstance({
  baseUrl: "http://localhost:6543/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
});

import { createSafeFetchResultInstance } from "@repo/safe-fetch";

const api = createSafeFetchResultInstance({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  credentials: "include",
  timeoutMs: 100 * 1000,
});

export default api;

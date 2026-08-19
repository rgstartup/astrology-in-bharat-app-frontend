import { createSafeFetchInstance } from "@repo/safe-fetch";

const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6543/api/v1';
  }
  return '/api/v1';
};

export const api = createSafeFetchInstance({
  baseUrl: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
});

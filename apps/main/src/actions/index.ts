import { createSafeFetchInstance } from "@repo/safe-fetch";
export { API_ROUTES } from "@/lib/api-routes";

export const api = createSafeFetchInstance({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  headers: {
    "Content-Type": "application/json",
  },
});

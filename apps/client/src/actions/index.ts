import { createSafeFetchInstance, createSafeFetchResultInstance } from "@repo/safe-fetch";
export { API_ROUTES } from "@/lib/api-routes";
export * from "./expert-products";
export * from "./favorites";
export * from "./consultation";
export * from "./specialization";
export * from "./onboard";

// Server actions run INSIDE the container: localhost = this container.
// API_URL (e.g. http://aib-backend-dev:6543/api/v1) is the container-network
// address; NEXT_PUBLIC_API_URL is the browser-facing fallback.
const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL!;

export const api = createSafeFetchInstance({
  baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
});

export const apiV2 = createSafeFetchResultInstance({
  baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
});

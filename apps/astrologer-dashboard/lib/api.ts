import { createSafeFetchInstance, ApiError } from '@repo/safe-fetch';

export { ApiError };

/**
 * 🚀 Standardized API Client (Astrologer Dashboard)
 * - Base URL: http://localhost:6543/api/v1 (Hardcoded for simplicity)
 * - Headers: JSON by default
 * - Credentials: included by default in safeFetch
 */
export const api = createSafeFetchInstance({
  baseUrl: 'http://localhost:6543/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeoutMs: 10_000,
});

export default api;

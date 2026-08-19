import { createSafeFetchInstance } from '@repo/safe-fetch';

const getBaseUrl = () => {
  // Server-side: must use absolute URL
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6543/api/v1';
  }
  // Client-side: use relative path to utilize Next.js rewrites/proxy
  return '/api/v1';
};

const baseApi = createSafeFetchInstance({
  baseUrl: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeoutMs: 10_000,
});

export const api = {
  ...baseApi,
  get: async <T>(url: string, init?: any) => baseApi.get<T>(url, init),
  post: async <T>(url: string, body?: any, init?: any) => baseApi.post<T>(url, body, init),
  patch: async <T>(url: string, body?: any, init?: any) => baseApi.patch<T>(url, body, init),
  put: async <T>(url: string, body?: any, init?: any) => baseApi.put<T>(url, body, init),
  delete: async <T>(url: string, init?: any) => baseApi.delete<T>(url, init),
};

export default api;

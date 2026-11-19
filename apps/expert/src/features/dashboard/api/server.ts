import { headers } from "next/headers";
import { createSafeFetchEnvelopeInstance } from "@repo/safe-fetch";
import type { EnvelopeResult } from "@repo/safe-fetch";
import type { DashboardStats, ExpertReviewsStats, ExpertReview } from "@repo/lib";

async function getServerApi() {
  const headerStore = await headers();
  const cookieHeader = headerStore.get("cookie");

  return createSafeFetchEnvelopeInstance({
    baseUrl: process.env.NEXT_PUBLIC_API_URL!,
    credentials: "include",
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
  });
}

/**
 * Server-side fetch of dashboard stats.
 * Uses headers() to forward the incoming request's Cookie header so auth
 * tokens reach the backend without client-side re-auth.
 */
export async function getDashboardStats(
  period = "monthly",
): Promise<EnvelopeResult<DashboardStats>> {
  const api = await getServerApi();
  return api.get<DashboardStats>(
    `/expert/me/dashboard/stats?period=${period}`,
  );
}

/**
 * Server-side fetch of recent appointments across chat, call, and puja sessions.
 */
export async function getRecentAppointments(): Promise<EnvelopeResult<any[]>> {
  const api = await getServerApi();
  const [
    pendingChatRes,
    completedChatRes,
    pendingCallRes,
    completedCallRes,
    pujaRes,
  ] = await Promise.all([
    api.get<any>("/chat/sessions/appointments/pending"),
    api.get<any>("/chat/sessions/appointments/completed"),
    api.get<any>("/call/sessions/appointments/pending"),
    api.get<any>("/call/sessions/appointments/completed"),
    api.get<any>("/puja-appointments/expert"),
  ]);

  const extractData = (result: EnvelopeResult<any>) => {
    if (!result.ok) return [];
    const data = result.data?.data?.data || result.data?.data || result.data;
    return Array.isArray(data) ? data : [];
  };

  const allSessions = [
    ...extractData(pendingChatRes),
    ...extractData(completedChatRes),
    ...extractData(pendingCallRes),
    ...extractData(completedCallRes),
    ...extractData(pujaRes),
  ];

  const uniqueSessions = Array.from(
    new Map(
      allSessions.map((item) => {
        const typePrefix = (item as any).type ? "call" : "chat";
        return [`${typePrefix}_${item.id}`, item];
      }),
    ).values(),
  );

  const sortedSessions = uniqueSessions.sort((a: any, b: any) => {
    const dateA = new Date(
      a.created_at || a.createdAt || a.start_time || 0,
    ).getTime();
    const dateB = new Date(
      b.created_at || b.createdAt || a.start_time || 0,
    ).getTime();
    return dateB - dateA;
  });

  return {
    ok: true,
    data: sortedSessions.slice(0, 5),
    meta: { timestamp: new Date().toISOString() },
  };
}

/**
 * Server-side fetch of paginated reviews for the current expert.
 */
export async function getReviews(
  page: number = 1,
  limit: number = 10,
  startDate?: string,
  endDate?: string,
): Promise<EnvelopeResult<ExpertReview[]>> {
  const api = await getServerApi();
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  return api.get<ExpertReview[]>(
    `/expert/me/reviews?${params.toString()}`,
  );
}

/**
 * Server-side fetch of review statistics (rating distribution).
 */
export async function getReviewStats(): Promise<
  EnvelopeResult<ExpertReviewsStats>
> {
  const api = await getServerApi();
  return api.get<ExpertReviewsStats>("/expert/me/reviews/stats");
}

/**
 * Server-side fetch of expert profile.
 */
export async function getExpertProfile(): Promise<EnvelopeResult<any>> {
  const api = await getServerApi();
  return api.get<any>("/expert");
}

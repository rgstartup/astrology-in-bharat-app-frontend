"use client";

import api from "@/actions/api";
import type { Result } from "@repo/safe-fetch";
import type {
  DashboardStats,
  DashboardStatsResponse,
  GetDashboardStatsParams,
} from "@repo/lib";

/**
 * Fetch expert dashboard stats for a given period / date range.
 *
 * Uses the actions api instance (@/actions/api) and response contracts from @repo/lib.
 * Returns {@link Result} discriminated union ({ ok: true, data } | { ok: false, error }).
 * @deprecated Import from {@link features/dashboard/api} instead of {@link @/lib/dashboard}.
 */
export async function getDashboardStats(
  params: GetDashboardStatsParams | string = {}
): Promise<Result<DashboardStats>> {
  // Backward-compat: accept a period string (e.g. "monthly" | "total")
  const periodStr = typeof params === "string" ? params : undefined;
  const { period = periodStr || "monthly", startDate, endDate } =
    typeof params === "string" ? {} : params;
  const query = new URLSearchParams();
  if (period) query.set("period", period);
  if (startDate) query.set("startDate", startDate);
  if (endDate) query.set("endDate", endDate);

  const result = await api.get<DashboardStatsResponse>(
    `expert-dashboard/stats?${query.toString()}`
  );
  if (!result.ok) return result;

  const data = result.data?.data || result.data;
  return {
    ok: true,
    data: {
      ...data,
      totalChatSessions: data.total_chat_sessions || 0,
      totalEarnings: data.total_earnings || data.today_earnings || 0,
      walletBalance: data.wallet_balance || 0,
      averageRating: data.average_rating || 0,
      totalReviews: data.total_reviews || 0,
      trends: {
        sessions: data.trends?.sessions || "+0%",
        earnings: data.trends?.earnings || "+0%",
      },
    },
  };
}

/**
 * Fetch recent appointments across chat, call, and puja sessions.
 * @deprecated Import from {@link features/dashboard/api} instead of {@link @/lib/dashboard}.
 */
export async function getRecentAppointments(): Promise<Result<any[]>> {
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

  const extractData = (result: Result<any>) => {
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
      })
    ).values()
  );

  const sortedSessions = uniqueSessions.sort((a: any, b: any) => {
    const dateA = new Date(a.created_at || a.createdAt || a.start_time || 0).getTime();
    const dateB = new Date(b.created_at || b.createdAt || b.start_time || 0).getTime();
    return dateB - dateA;
  });

  return { ok: true, data: sortedSessions.slice(0, 5) };
}

/**
 * Compatibility wrapper for getRecentAppointments used by components
 * that expect data directly instead of a tuple.
 * @deprecated Import from {@link features/dashboard/api} instead of {@link @/lib/dashboard}.
 */
export async function getRecentSessions(): Promise<any[]> {
  const result = await getRecentAppointments();
  if (!result.ok) {
    console.error("Error fetching recent sessions:", result.error);
    return [];
  }
  return result.data || [];
}

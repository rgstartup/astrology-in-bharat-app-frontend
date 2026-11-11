"use client";

import api from "@/actions/api";
import type {
  DashboardStats,
  DashboardStatsResponse,
  GetDashboardStatsParams,
} from "@repo/lib";

/**
 * Fetch expert dashboard stats for a given period / date range.
 *
 * Uses the actions api instance (@/actions/api) and response contracts from @repo/lib.
 * @deprecated Import from {@link features/dashboard/api} instead of {@link @/lib/dashboard}.
 */
export async function getDashboardStats(
  params: GetDashboardStatsParams | string = {}
): Promise<[DashboardStats | null, any | null]> {
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
  if (!result.ok) return [null, result.error];

  const data = result.data?.data || result.data;
  return [
    {
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
    null,
  ];
}

/**
 * Fetch recent appointments across chat, call, and puja sessions.
 * @deprecated Import from {@link features/dashboard/api} instead of {@link @/lib/dashboard}.
 */
export async function getRecentAppointments(): Promise<[any[] | null, any | null]> {
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

  const extractData = (result: [any | null, any | null]) => {
    const [res, error] = result;
    if (error || !res) return [];
    const data = res?.data?.data || res?.data || res;
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

  return [sortedSessions.slice(0, 5), null];
}

/**
 * Compatibility wrapper for getRecentAppointments used by components
 * that expect data directly instead of a tuple.
 * @deprecated Import from {@link features/dashboard/api} instead of {@link @/lib/dashboard}.
 */
export async function getRecentSessions(): Promise<any[]> {
  const [sessions, error] = await getRecentAppointments();
  if (error) {
    console.error("Error fetching recent sessions:", error);
    return [];
  }
  return sessions || [];
}

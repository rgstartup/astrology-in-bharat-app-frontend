import { api, ApiError } from "./api";

export interface DashboardStats {
    totalChatSessions: number;
    totalEarnings: number;
    averageRating: number;
    totalReviews: number;
    trends: {
        sessions: string;
        earnings: string;
    };
}

export const getDashboardStats = async (type: string = 'monthly'): Promise<[DashboardStats | null, ApiError | null]> => {
    const [res, error] = await api.get(`expert-dashboard/stats?type=${type}`);
    if (error) return [null, error];

    // api client result returns the data directly
    const data = (res as any)?.data?.data || (res as any)?.data || res;

    return [{
        totalChatSessions: data.total_chat_sessions || data.totalSessions || 0,
        totalEarnings: data.total_earnings || data.totalEarnings || 0,
        averageRating: data.average_rating || data.averageRating || 0,
        totalReviews: data.total_reviews || data.totalReviews || 0,
        trends: {
            sessions: data.trends?.sessions || "+0%",
            earnings: data.trends?.earnings || "+0%"
        }
    }, null];
};

export const getRecentAppointments = async (): Promise<[any[] | null, ApiError | null]> => {
    const [pendingRes, completedRes] = await Promise.all([
        api.get<any>("/chat/sessions/appointments/pending"),
        api.get<any>("/chat/sessions/appointments/completed")
    ]);

    const extractData = (result: [any | null, ApiError | null]) => {
        const [res, error] = result;
        if (error || !res) return [];
        const data = res?.data?.data || res?.data || res;
        return Array.isArray(data) ? data : [];
    };

    const allSessions = [...extractData(pendingRes), ...extractData(completedRes)];

    // Deduplicate sessions by ID
    const uniqueSessions = Array.from(new Map(allSessions.map(item => [item.id, item])).values());

    // Sort by date (newest first)
    const sortedSessions = uniqueSessions.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
        const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
        return dateB - dateA;
    });

    return [sortedSessions.slice(0, 5), null];
};

/**
 * Compatibility wrapper for getRecentAppointments used by some components
 * that expect data directly instead of a tuple.
 */
export const getRecentSessions = async () => {
    const [sessions, error] = await getRecentAppointments();
    if (error) {
        console.error("Error fetching recent sessions:", error);
        return [];
    }
    return sessions || [];
};

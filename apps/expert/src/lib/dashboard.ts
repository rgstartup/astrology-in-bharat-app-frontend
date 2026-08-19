import { api, ApiError } from "./api";

export interface DashboardStats {
    totalChatSessions: number;
    totalEarnings: number;
    averageRating: number;
    totalReviews: number;
    walletBalance: number;
    // New fields for Appointments page compatibility
    today_appointments?: number;
    completed_today?: number;
    expired_today?: number;
    today_earnings?: number;
    total_appointments?: number;
    total_completed?: number;
    total_expired?: number;
    total_earnings?: number;
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
        ...data, // Spread all raw data first (today_appointments, etc.)
        totalChatSessions: data.total_chat_sessions || 0,
        totalEarnings: data.total_earnings || data.today_earnings || 0,
        walletBalance: data.wallet_balance || 0,
        averageRating: data.average_rating || 0,
        totalReviews: data.total_reviews || 0,
        trends: {
            sessions: data.trends?.sessions || "+0%",
            earnings: data.trends?.earnings || "+0%"
        }
    }, null];
};

export const getRecentAppointments = async (): Promise<[any[] | null, ApiError | null]> => {
    const [pendingChatRes, completedChatRes, pendingCallRes, completedCallRes, pujaRes] = await Promise.all([
        api.get<any>("/chat/sessions/appointments/pending"),
        api.get<any>("/chat/sessions/appointments/completed"),
        api.get<any>("/call/sessions/appointments/pending"),
        api.get<any>("/call/sessions/appointments/completed"),
        api.get<any>("/puja-appointments/expert")
    ]);

    const extractData = (result: [any | null, ApiError | null]) => {
        const [res, error] = result;
        if (error || !res) return [];
        // Handle both possible response structures ({data: [...]} or [...])
        const data = res?.data?.data || res?.data || res;
        return Array.isArray(data) ? data : [];
    };

    const allSessions = [
        ...extractData(pendingChatRes), 
        ...extractData(completedChatRes),
        ...extractData(pendingCallRes),
        ...extractData(completedCallRes),
        ...extractData(pujaRes)
    ];

    // Deduplicate sessions by ID (Note: IDs might collide if chat and call use different sequences, 
    // but usually they are unique across the system or we should prefix them)
    // To be safe, we can use a composite key or just rely on the fact that they are likely different.
    // If they are from different tables, IDs might collide. Let's use a unique identifier.
    const uniqueSessions = Array.from(new Map(allSessions.map(item => {
        const typePrefix = (item as any).type ? 'call' : 'chat'; // Call sessions have a type (AUDIO/VIDEO)
        return [`${typePrefix}_${item.id}`, item];
    })).values());

    // Sort by date (newest first)
    const sortedSessions = uniqueSessions.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at || a.createdAt || a.start_time || 0).getTime();
        const dateB = new Date(b.created_at || b.createdAt || b.start_time || 0).getTime();
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

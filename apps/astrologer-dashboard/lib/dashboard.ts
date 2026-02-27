import apiClient from "./apiClient";

export interface DashboardStats {
    today_appointments: number;
    completed_today: number;
    expired_today: number;
    today_earnings: number;
    total_appointments?: number;
    total_completed?: number;
    total_expired?: number;
    total_earnings: number;
}

export const getDashboardStats = async (type: 'today' | 'total' = 'today'): Promise<DashboardStats> => {
    try {
        const response: any = await apiClient.get(`expert-dashboard/stats?type=${type}`);
        console.log('[Dashboard] Raw API response:', response);
        // apiClient returns the parsed JSON body directly — try all common backend shapes
        const stats = response?.data?.data ?? response?.data ?? response;
        console.log('[Dashboard] Parsed stats:', stats);
        return stats;
    } catch (error) {
        console.error(`[Dashboard] Stats API call failed for type ${type}:`, error);
        throw error;
    }
};

export const getRecentSessions = async (): Promise<any[]> => {
    try {
        const [pendingRes, completedRes] = await Promise.all([
            apiClient.get("/chat/sessions/appointments/pending"),
            apiClient.get("/chat/sessions/appointments/completed")
        ]);

        let allSessions: any[] = [];

        const extractData = (res: any) => {
            if (Array.isArray(res.data)) return res.data;
            if (res.data?.data && Array.isArray(res.data.data)) return res.data.data;
            if (res.data?.items && Array.isArray(res.data.items)) return res.data.items;
            return [];
        };

        allSessions = [...extractData(pendingRes), ...extractData(completedRes)];

        // Deduplicate sessions by ID
        const uniqueSessions = Array.from(new Map(allSessions.map(item => [item.id, item])).values());

        // Sort by date (newest first)
        return uniqueSessions.sort((a: any, b: any) => {
            const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
            const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
            return dateB - dateA;
        });
    } catch (error) {
        console.error("[Dashboard] Failed to fetch recent sessions:", error);
        return [];
    }
}




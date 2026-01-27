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
        const response = await apiClient.get(`expert-dashboard/stats?type=${type}`);
        return response.data?.data;
    } catch (error) {
        console.error(`[Dashboard] Stats API call failed for type ${type}:`, error);
        throw error;
    }
};

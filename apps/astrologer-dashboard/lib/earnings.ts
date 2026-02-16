import apiClient from "./apiClient";
import { EarningsDashboardData } from "../components/Earnings/types";

export const getEarningsStats = async (range: string = 'last_6_months'): Promise<EarningsDashboardData> => {
    try {
        const response = await apiClient.get(`/expert/earnings/stats?range=${range}`);
        const result = response.data?.data || response.data;
        return result;
    } catch (error) {
        console.error("[Earnings] Failed to fetch stats:", error);
        throw error;
    }
};



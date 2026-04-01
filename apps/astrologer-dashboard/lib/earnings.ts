import { api, ApiError } from "./api";

export const getEarningsStats = async (period: string = 'monthly'): Promise<[any | null, ApiError | null]> => {
    const [res, error] = await api.get(`/expert/earnings/stats?period=${period}`);
    if (error) return [null, error];
    const data = (res as any)?.data ?? res;
    return [data, null];
};

export const getEarningsHistory = async (page: number = 1, limit: number = 10): Promise<[any | null, ApiError | null]> => {
    const [res, error] = await api.get(`/expert/earnings?page=${page}&limit=${limit}`);
    if (error) return [null, error];
    const data = (res as any)?.data ?? res;
    return [data, null];
};

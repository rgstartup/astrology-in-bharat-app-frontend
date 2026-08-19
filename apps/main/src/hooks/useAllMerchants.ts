import { useQuery } from "@tanstack/react-query";
import { merchantService } from "@/services/merchant.service";
import { Store } from "@/lib/types/shop";

/**
 * Hook to fetch a list of all active merchants with optional filters
 * @param params Search and city filters
 */
export const useAllMerchants = (params: { search?: string, city?: string, page?: number, limit?: number } = {}) => {
    return useQuery<Store[], Error>({
        queryKey: ['merchants', params.search, params.city, params.page, params.limit],
        queryFn: async () => {
            const [data, error] = await merchantService.getAllMerchants(params);
            if (error) {
                const message = (error as any).message || "Failed to fetch merchants";
                throw new Error(message);
            }
            return data as Store[];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

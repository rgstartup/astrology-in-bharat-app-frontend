import { useQuery } from "@tanstack/react-query";
import { merchantService } from "@/services/merchant.service";
import { Store } from "@/lib/types/shop";

/**
 * Hook to fetch detailed information for a single merchant
 * @param id Merchant ID
 */
export const useMerchant = (id: string | undefined) => {
    return useQuery<Store | null, Error>({
        queryKey: ['merchant', id],
        queryFn: async () => {
            if (!id) return null;
            const [data, error] = await merchantService.getMerchantById(id);
            if (error) {
                const message = (error as any).message || "Failed to fetch merchant";
                throw new Error(message);
            }
            return data as Store;
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

import { useQuery } from "@tanstack/react-query";
import { merchantService } from "@/services/merchant.service";
import { Product } from "@/lib/types";
import { getErrorMessage } from "@repo/lib";

/**
 * Hook to fetch products for a specific merchant
 * @param id Merchant ID
 */
export const useMerchantProducts = (id: string | undefined, page = 1, limit = 20) => {
    return useQuery<Product[]>({
        queryKey: ['merchant-products', id, page, limit],
        queryFn: async () => {
            if (!id) return [];
            const [data, error] = await merchantService.getMerchantProducts(id, page, limit);
            if (error) throw new Error(getErrorMessage(error) || "Failed to fetch products");
            return (data as Product[]) || [];
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

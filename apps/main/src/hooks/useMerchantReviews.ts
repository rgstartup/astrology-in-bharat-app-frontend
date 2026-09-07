import { useQuery } from "@tanstack/react-query";
import { merchantService } from "@/services/merchant.service";
import { Review } from "@/lib/types/shop";
import { getErrorMessage } from "@repo/lib";

/**
 * Hook to fetch reviews for a specific merchant
 * @param id Merchant ID
 */
export const useMerchantReviews = (id: string | undefined) => {
    return useQuery<Review[], Error>({
        queryKey: ['merchant-reviews', id],
        queryFn: async () => {
            if (!id) return [];
            const [data, error] = await merchantService.getMerchantReviews(id);
            if (error) {
                throw new Error(getErrorMessage(error) || "Failed to fetch reviews");
            }
            return (Array.isArray(data) ? data : []) as Review[];
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

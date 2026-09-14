import { useQuery } from "@tanstack/react-query";
import { merchantService } from "@/services/merchant.service";
import { getErrorMessage } from "@repo/lib";

/**
 * Hook to fetch the list of unique cities for active merchants
 */
export const useMerchantCities = () => {
    return useQuery<string[], Error>({
        queryKey: ['merchant-cities'],
        queryFn: async () => {
            const [data, error] = await merchantService.getMerchantCities();
            if (error) {
                throw new Error(getErrorMessage(error) || "Failed to fetch cities");
            }
            return data as string[];
        },
        staleTime: 1000 * 60 * 30, // 30 minutes (cities don't change often)
    });
};

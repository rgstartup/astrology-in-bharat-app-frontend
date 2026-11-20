import { clientAPI } from "@/actions";
import { Store } from "@/lib/types/shop";
import { Product } from "@/lib/types";




export const merchantService = {
    /**
     * Fetch all merchants with optional pagination, search and city filters
     */
    getAllMerchants: async (params: { search?: string, city?: string, page?: number, limit?: number } = {}) => {
        const { search = '', city = '', page = 1, limit = 10 } = params;
        
        let url = `/merchants?page=${page}&limit=${limit}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (city && city !== "All Cities") url += `&city=${encodeURIComponent(city)}`;
        
        const result = await clientAPI.get<any>(url);
        // Backend should return { merchants: [...] }
        const merchants = result.data?.data?.merchants || result.data?.merchants || result.data?.data || result.data;
        return Array.isArray(merchants) ? merchants : [];
    },

    /**
     * Fetch list of unique cities where merchants are active
     */
    getMerchantCities: async () => {
        const result = await clientAPI.get<any>('/merchants/cities');
        // console.log('Main App Cities API Response:', data);
        // Backend might return { cities: [] } or { data: [] }
        const cities = result.data?.data?.cities || result.data?.cities || result.data?.data || result.data;
        return Array.isArray(cities) ? cities : [];
    },

    /**
     * Fetch a single merchant by ID
     */
    getMerchantById: async (id: string) => {
        const result = await clientAPI.get<any>(`/merchants/${id}`);
        // If the backend wraps the response in a 'data' field, use it. Otherwise use the object itself.
        const merchantData = result.data?.data || result.data;
        return merchantData as Store;
    },

    /**
     * Fetch products for a specific merchant
     */
    getMerchantProducts: async (id: string, page = 1, limit = 20) => {
        const result = await clientAPI.get<any>(`/products?merchantId=${id}&page=${page}&limit=${limit}`);
        // Handle all possible backend response formats:
        // { success: true, data: [...] } OR { data: [...] } OR { products: [...] } OR [...]
        let products: any[] = [];
        const raw = result.data as any;
        if (Array.isArray(raw)) {
            products = raw;
        } else if (raw?.data && Array.isArray(raw.data)) {
            products = raw.data;
        } else if (raw?.data?.products && Array.isArray(raw.data.products)) {
            products = raw.data.products;
        } else if (raw?.products && Array.isArray(raw.products)) {
            products = raw.products;
        }
        return products;
    },

    /**
     * Fetch reviews for a specific merchant
     */
    getMerchantReviews: async (id: string) => {
        const result = await clientAPI.get<any>(`/reviews/merchant/${id}`);
        return result.data?.data || result.data || [];
    },

    /**
     * Submit a review for a merchant
     */
    submitMerchantReview: async (payload: { merchantId: string | string, orderId: string | string, rating: number, comment: string }) => {
        // Based on backend plan: POST /api/v1/reviews
        const body = {
            merchantId: String(payload.merchantId),
            orderId: String(payload.orderId),
            rating: Number(payload.rating),
            comment: payload.comment
        };
        
        const result = await clientAPI.post<any>('/reviews', body);
        return result.data;
    }
};
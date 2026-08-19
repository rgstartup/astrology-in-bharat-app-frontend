import { api } from "@/lib/api";
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
        
        const [data, error] = await api.get<any>(url) as any;
        // Backend should return { merchants: [...] }
        const merchants = data?.data?.merchants || data?.merchants || data?.data || data;
        return [Array.isArray(merchants) ? merchants : [], error];
    },

    /**
     * Fetch list of unique cities where merchants are active
     */
    getMerchantCities: async () => {
        const [data, error] = await api.get<any>('/merchants/cities') as any;
        // console.log('Main App Cities API Response:', data);
        // Backend might return { cities: [] } or { data: [] }
        const cities = data?.data?.cities || data?.cities || data?.data || data;
        return [Array.isArray(cities) ? cities : [], error];
    },

    /**
     * Fetch a single merchant by ID
     */
    getMerchantById: async (id: string) => {
        const [data, error] = await api.get<any>(`/merchants/${id}`) as any;
        // If the backend wraps the response in a 'data' field, use it. Otherwise use the object itself.
        const merchantData = data?.data || data;
        return [merchantData as Store, error];
    },

    /**
     * Fetch products for a specific merchant
     */
    getMerchantProducts: async (id: string, page = 1, limit = 20) => {
        const [data, error] = await api.get<any>(`/products?merchantId=${id}&page=${page}&limit=${limit}`) as any;
        // Handle all possible backend response formats:
        // { success: true, data: [...] } OR { data: [...] } OR { products: [...] } OR [...]
        let products: any[] = [];
        const raw = data as any;
        if (Array.isArray(raw)) {
            products = raw;
        } else if (raw?.data && Array.isArray(raw.data)) {
            products = raw.data;
        } else if (raw?.data?.products && Array.isArray(raw.data.products)) {
            products = raw.data.products;
        } else if (raw?.products && Array.isArray(raw.products)) {
            products = raw.products;
        }
        return [products, error];
    },

    /**
     * Fetch reviews for a specific merchant
     */
    getMerchantReviews: async (id: string) => {
        const [data, error] = await api.get<any>(`/reviews/merchant/${id}`) as any;
        return [data?.data || data || [], error];
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
        
        const [data, error] = await api.post<any>('/reviews', body) as any;
        return [data, error];
    }
};

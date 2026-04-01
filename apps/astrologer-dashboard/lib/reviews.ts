import { api, ApiError } from "./api";

export interface Review {
    id: string;
    rating: number;
    comment: string;
    user: {
        name: string;
        avatar?: string;
    };
    created_at: string;
    reply?: string;
}

export const getReviews = async (expertId: string | number, page: number = 1, limit: number = 10): Promise<[{ reviews: Review[], total: number } | null, ApiError | null]> => {
    const [res, error] = await api.get(`/reviews/expert/${expertId}?page=${page}&limit=${limit}`);
    if (error) return [null, error];
    const data = (res as any)?.data?.data || (res as any)?.data || res;

    return [{
        reviews: data.items || data.reviews || [],
        total: data.total || (data.items || data.reviews || []).length || 0
    }, null];
};

/**
 * Compatibility wrapper for getReviews used by some components
 * that expect data directly instead of a tuple.
 */
export const getExpertReviews = async (expertId: string | number, page: number = 1, limit: number = 10) => {
    const [res, error] = await getReviews(expertId, page, limit);
    if (error) {
        console.error("Error fetching reviews:", error);
        return { data: [], total: 0 };
    }
    return {
        data: res?.reviews || [],
        total: res?.total || 0
    };
};

export const getReviewStats = async (expertId: string | number): Promise<[any | null, ApiError | null]> => {

    const [res, error] = await api.get(`/reviews/expert/${expertId}/stats`);
    if (error) return [null, error];
    const data = (res as any)?.data?.data || (res as any)?.data || res;
    return [data, null];
};

export const replyToReview = async (id: string, reply: string): Promise<[any | null, ApiError | null]> => {
    return api.post(`/expert/reviews/${id}/reply`, { reply });
};

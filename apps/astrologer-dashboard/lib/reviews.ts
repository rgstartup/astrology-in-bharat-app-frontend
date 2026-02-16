import apiClient from "./apiClient";

export interface Review {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        id: number;
        name: string;
        avatar?: string;
    };
}

export interface ReviewStats {
    rating: number;
    totalReviews: number;
}

export const getExpertReviewStats = async (expertId: number): Promise<ReviewStats> => {
    const response = await apiClient.get(`/reviews/expert/${expertId}/stats`);
    return response.data;
};

export const getExpertReviews = async (expertId: number, page: number = 1, limit: number = 10) => {
    const response = await apiClient.get(`/reviews/expert/${expertId}`, {
        params: { page, limit }
    });
    return response.data;
};



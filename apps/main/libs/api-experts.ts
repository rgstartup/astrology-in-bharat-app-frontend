// Native fetch is used instead of axios for Next.js caching support

const apiEnvVar = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "");
const API_BASE_URL = apiEnvVar ? `${apiEnvVar}/api/v1` : "http://localhost:6543/api/v1";

export interface ExpertProfile {
  id: number;
  user: {
    id: number;
    name: string;
    avatar?: string;
    language?: string;
  };
  specialization: string;
  experience_in_years: number;
  languages: string[];
  price: number;
  rating: number;
  is_available: boolean;
  video?: string;
  chat_price?: number;
  call_price?: number;
  video_call_price?: number;
  report_price?: number;
  horoscope_price?: number;
  custom_services?: { id: string; name: string; price: number; unit: string }[];
  [key: string]: unknown;
}

export interface FetchExpertsParams {
  limit?: number;
  offset?: number;
  q?: string;
  specializations?: string;
  sort?: string;
  languages?: string;
  minPrice?: number;
  maxPrice?: number;
  state?: string;
  service?: string;
  online?: boolean;  // Changed to boolean as it's cleaner, but string is also fine if query param needs it. Stick to what backend expects (often string in query params). Kept generic.
  rating?: number;
}

export interface FetchExpertsResponse {
  data: ExpertProfile[];
  pagination: {
    total: number;
    hasMore: boolean;
  };
}

export const getExperts = async (
  params: FetchExpertsParams
): Promise<{
  success: boolean;
  data: ExpertProfile[];
  pagination?: {
    total: number;
    hasMore: boolean;
  };
  error?: string;
}> => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        console.log(`[API Debug] Setting param: ${key}=${value} (${typeof value})`);
        queryParams.set(key, String(value));
      }
    });

    const url = `${API_BASE_URL}/expert/list?${queryParams.toString()}`;
    console.log(`[API Debug] Fetching experts from: ${url}`);

    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API Debug] Fetch failed with status: ${response.status}. Body: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log(`[API Debug] Successfully fetched ${result.data?.length} experts`);

    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
    };
  } catch (error: any) {
    console.error("[API Debug] getExperts Error:", error.message);
    const isNetworkError =
      error.message.includes("fetch failed") ||
      error.message.includes("Network Error");
    return {
      success: false,
      data: [],
      error: isNetworkError ? "server_unreachable" : "unknown_error",
    };
  }
};

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

export interface FetchReviewsResponse {
  data: Review[];
  total: number;
  page: number;
  limit: number;
}

export const getExpertReviews = async (
  expertId: string | number,
  page: number = 1,
  limit: number = 10
): Promise<FetchReviewsResponse> => {
  try {
    const url = `${API_BASE_URL}/reviews/expert/${expertId}?page=${page}&limit=${limit}`;
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) throw new Error("Failed to fetch reviews");

    return await response.json();
  } catch (error) {
    console.error("Error fetching expert reviews:", error);
    return { data: [], total: 0, page, limit };
  }
};



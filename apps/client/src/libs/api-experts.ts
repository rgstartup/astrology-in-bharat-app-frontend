import { clientAPI, API_ROUTES } from "@/actions";
import { getErrorMessage } from "@repo/lib";

export interface ExpertProfile {
  id: string;
  user: {
    id: string;
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
  online?: boolean; // Changed to boolean as it's cleaner, but string is also fine if query param needs it. Stick to what backend expects (often string in query params). Kept generic.
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
  params: FetchExpertsParams,
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
        queryParams.set(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_ROUTES.EXPERTS.LIST}?${queryString}`
      : API_ROUTES.EXPERTS.LIST;

    const result = await clientAPI.get<any>(url, {
      cache: "no-store",
    } as any);

    if (!result.ok) {
      throw new Error(`API Error: ${getErrorMessage(result.error)}`);
    }

    const finalData = Array.isArray(result.data)
      ? result.data
      : result.data?.data || result.data?.experts || [];
    if (finalData.length > 0) {
    }
    const finalPagination = {
      total: result.data?.meta?.total,
      hasMore: Boolean(result.data?.meta?.hasNextPage),
    };

    return {
      success: true,
      data: finalData,
      pagination: finalPagination,
    };
  } catch (error: any) {
    const errMsg = getErrorMessage(error);
    const isNetworkError =
      errMsg.includes("fetch failed") ||
      errMsg.includes("Network Error") ||
      errMsg.includes("ECONNREFUSED");

    if (!isNetworkError) {
      console.error(`❌ [API Experts] Fetch error:`, errMsg);
    } else {
      console.warn(
        `⚠️ [API Experts] Backend unreachable, falling back to empty state.`,
      );
    }

    return {
      success: false,
      data: [],
      error: isNetworkError ? "server_unreachable" : "unknown_error",
    };
  }
};

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
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
  expertId: string,
  page: number = 1,
  limit: number = 10,
): Promise<FetchReviewsResponse> => {
  try {
    const url = `/reviews/expert/${expertId}?page=${page}&limit=${limit}`;
    const result = await clientAPI.get<any>(url, { cache: "no-store" } as any);

    if (!result.ok) throw new Error("Failed to fetch reviews");

    return result.data;
  } catch {
    return { data: [], total: 0, page, limit };
  }
};

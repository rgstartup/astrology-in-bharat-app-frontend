import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";

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
  [key: string]: any;
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
  pagination?: any;
  error?: string;
}> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/expert/profile/list`, {
      params,
      timeout: 5000,
    });
    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error: any) {
    console.error("API Fetch Error:", error.message);
    const isConnectionError =
      error.code === "ECONNREFUSED" || error.message.includes("Network Error");
    return {
      success: false,
      data: [],
      error: isConnectionError ? "server_unreachable" : "unknown_error",
    };
  }
};

"use server";

import { api, API_ROUTES } from "@/actions";
import {
  getErrorMessage,
  type IConsultationTopic,
  type IConsultationTopicResponse,
  type PaginationMeta,
} from "@repo/lib";

export interface ConsultationTopicsResponse {
  success?: boolean;
  error?: string;
  data?: IConsultationTopic[];
  meta?: PaginationMeta;
}

/**
 * Server action to fetch consultation topics from API (/consultations/topics) with safeFetch
 */
export async function getConsultationTopicsAction(params?: {
  search?: string;
  limit?: number;
  page?: number;
}): Promise<ConsultationTopicsResponse> {
  try {
    let url = API_ROUTES.CONSULTATION.TOPICS;
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.limit) searchParams.append("limit", String(params.limit));
    if (params?.page) searchParams.append("page", String(params.page));

    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;

    const [res, error] = await api.get<IConsultationTopicResponse>(url);

    if (error) {
      return {
        error: getErrorMessage(error) || "Failed to fetch consultation topics",
        data: [],
      };
    }

    return {
      success: true,
      data: res?.data,
      meta: res?.meta,
    };
  } catch (err) {
    return {
      error: (err as Error)?.message || "Failed to fetch consultation topics",
      data: [],
    };
  }
}

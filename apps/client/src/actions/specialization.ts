"use server";

import { api, API_ROUTES } from "@/actions";
import {
  getErrorMessage,
  type Specialization,
  type IPaginatedSpecializationResponse,
  type PaginationMeta,
} from "@repo/lib";

export interface SpecializationsResponse {
  success?: boolean;
  error?: string;
  data?: Specialization[];
  meta?: PaginationMeta;
}

/**
 * Server action to fetch specializations from API (/specializations) with safeFetch
 */
export async function getSpecializationsAction(params?: {
  search?: string;
  limit?: number;
  page?: number;
}): Promise<SpecializationsResponse> {
  try {
    let url = API_ROUTES.SPECIALIZATIONS;
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.limit) searchParams.append("limit", String(params.limit));
    if (params?.page) searchParams.append("page", String(params.page));

    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;

    const [res, error] = await api.get<IPaginatedSpecializationResponse>(url);

    if (error) {
      return {
        error: getErrorMessage(error) || "Failed to fetch specializations",
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
      error: (err as Error)?.message || "Failed to fetch specializations",
      data: [],
    };
  }
}

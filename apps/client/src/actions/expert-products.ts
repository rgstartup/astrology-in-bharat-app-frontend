"use server";

import { api, API_ROUTES } from "@/actions";
import {
  ProductGroup,
  ProductType,
  ExpertProductRelationType,
  PaginatedExpertProductResponse,
} from "@repo/lib";

export interface GetExpertProductsDto {
  page?: number;
  limit?: number;
  search?: string;
  type?: ProductType;
  product_group?: ProductGroup;
  relation_type?: ExpertProductRelationType;
  category?: string;
  is_active?: boolean;
  sort_by?: "created_at" | "price" | "name";
  order?: "ASC" | "DESC" | "asc" | "desc";
  expert_id?: string | number;
}

export async function fetchExpertProducts(params: GetExpertProductsDto = {}) {
  try {
    const searchParams = new URLSearchParams();

    if (params.page !== undefined)
      searchParams.set("page", String(params.page));
    if (params.limit !== undefined)
      searchParams.set("limit", String(params.limit));
    if (params.search) searchParams.set("search", params.search);
    if (params.type) searchParams.set("type", params.type);
    if (params.product_group)
      searchParams.set("product_group", params.product_group);
    if (params.relation_type)
      searchParams.set("relation_type", params.relation_type);
    if (params.category) searchParams.set("category", params.category);
    if (params.is_active !== undefined)
      searchParams.set("is_active", String(params.is_active));
    if (params.sort_by) searchParams.set("sort_by", params.sort_by);
    if (params.order) searchParams.set("order", params.order);
    if (params.expert_id)
      searchParams.set("expert_id", String(params.expert_id));

    const queryString = searchParams.toString();
    const endpoint = `${API_ROUTES.EXPERT.PRODUCTS.ROOT}${queryString ? `?${queryString}` : ""}`;

    const [res, error] =
      await api.get<PaginatedExpertProductResponse>(endpoint);
    if (error || !res) {
      console.warn("fetchExpertProducts error:", error);
      return [];
    }
    return res.data;
  } catch (err) {
    console.error("fetchExpertProducts exception:", err);
    return [];
  }
}

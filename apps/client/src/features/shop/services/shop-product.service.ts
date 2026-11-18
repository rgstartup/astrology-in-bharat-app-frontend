import { apiV2, api } from "@/actions";
import type { Product, ProductCategory, PaginationMeta } from "@repo/lib";

/** Envelope instance paginated response format: { data: T[], meta: PaginationMeta } */
export interface PaginatedEnvelopeResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ShopProductQueryParams {
  search?: string;
  limit?: number | string;
  page?: number | string;
  // shortcut: backend /products rejects category & sort params (400) — filter/sort locally in ProductGrid
  category?: string;
  sort?: string;
}

export const ShopProductService = {
  getProducts: async (params?: ShopProductQueryParams): Promise<PaginatedEnvelopeResponse<Product>> => {
    const searchParams = new URLSearchParams();
    if (params) {
      const { category: _category, sort: _sort, ...apiParams } = params;
      Object.entries(apiParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryStr = searchParams.toString();
    const endpoint = queryStr ? `/products?${queryStr}` : "/products";
    const res = await apiV2.get<PaginatedEnvelopeResponse<Product>>(endpoint);

    if (!res.ok) {
      return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 1, hasNextPage: false, hasPrevPage: false } };
    }

    return res.data;
  },

  getProductById: async (id: string | number): Promise<Product | null> => {
    const res = await apiV2.get<Product>(`/products/${id}`);

    if (!res.ok) return null;

    return res.data;
  },

  getPlatformFee: async (): Promise<number> => {
    try {
      const [res, err] = await api.get<any>("/settings/platform-fee");
      if (!err && res) {
        return Number(res.platform_fee) || 0;
      }
      return 0;
    } catch {
      return 0;
    }
  },

  getProductCategories: async (): Promise<ProductCategory[]> => {
    const res = await apiV2.get<PaginatedEnvelopeResponse<ProductCategory>>(
      "/product-categories",
    );

    if (!res.ok) return [];

    return res.data.data;
  },
};

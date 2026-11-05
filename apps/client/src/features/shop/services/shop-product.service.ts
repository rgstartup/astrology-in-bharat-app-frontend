import { api } from "@/actions";
import type { ShopProduct } from "../types/shop.types";

export interface ShopProductQueryParams {
  search?: string;
  category?: string;
  limit?: number | string;
  page?: number | string;
  sort_by?: "price" | "name" | "created_at";
  order?: "asc" | "desc" | "ASC" | "DESC";
}

export const ShopProductService = {
  getProducts: async (
    params?: ShopProductQueryParams,
  ): Promise<ShopProduct[]> => {
    try {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
          }
        });
      }

      const queryStr = searchParams.toString();
      const endpoint = queryStr ? `/products?${queryStr}` : "/products";
      const [data, error] = await api.get<any>(endpoint);

      if (error || !data) {
        console.warn("Failed to fetch shop products:", error);
        return [];
      }

      return Array.isArray(data) ? data : data.data || [];
    } catch (err) {
      console.error("ShopProductService.getProducts exception:", err);
      return [];
    }
  },

  getProductById: async (id: string | number): Promise<ShopProduct | null> => {
    try {
      const [data, error] = await api.get<any>(`/products/${id}`);
      if (error || !data) return null;
      return data.data || data;
    } catch {
      return null;
    }
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
};

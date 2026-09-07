import { api } from "@/actions";
import { PaginatedProductsResponse, ProductWithLikes } from "@repo/lib";

export interface ProductQueryParams {
  q?: string;
  search?: string;
  limit?: number | string;
  page?: number | string;
  category?: string;
  [key: string]: any;
}

export const getProducts = async (
  params?: ProductQueryParams,
): Promise<ProductWithLikes[]> => {
  try {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
      if (params.q && !params.search) {
        searchParams.set("search", String(params.q));
      } else if (params.search && !params.q) {
        searchParams.set("q", String(params.search));
      }
    }

    const queryStr = searchParams.toString();
    const endpoint = queryStr ? `/products?${queryStr}` : "/products";
    const [data, error] = await api.get<any>(endpoint);

    if (error || !data) {
      console.warn("⚠️ Failed to fetch products:", error);
      return [];
    }

    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error("Backend not reachable:", error);
    return [];
  }
};

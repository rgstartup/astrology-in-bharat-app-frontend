import { api } from "../lib/api";

export interface Product {
    id?: string;
    _id?: string;
    name: string;
    shortDescription?: string;
    description: string;
    price: number;
    originalPrice: number;
    stock?: number;
    imageUrl: string;
    isActive?: boolean;
}

const fromApiProduct = (raw: any): Product => ({
    id: String(raw?.id ?? raw?._id ?? ""),
    name: raw?.name || "",
    shortDescription: raw?.short_description || raw?.shortDescription || "",
    description: raw?.description || "",
    price: Number(raw?.price ?? 0),
    originalPrice: Number(raw?.original_price ?? raw?.originalPrice ?? 0),
    stock: Number(raw?.stock ?? 0),
    imageUrl: raw?.image_url || raw?.imageUrl || raw?.image || "",
    isActive: raw?.is_active ?? raw?.isActive ?? true,
});

const normalizeFormData = (input: FormData) => {
    const out = new FormData();
    for (const [key, value] of input.entries()) {
        if (key === "originalPrice") { out.append("original_price", value); continue; }
        if (key === "shortDescription") { out.append("short_description", value); continue; }
        if (key === "imageUrl") { out.append("image_url", value); continue; }
        if (key === "isActive") { out.append("is_active", value); continue; }
        out.append(key, value);
    }
    return out;
};

// baseURL already contains /api/v1
const BASE = "/expert/products";

export const ProductService = {
    /** Fetch only this expert's own products */
    getProducts: async (): Promise<Product[]> => {
        const [data, error] = await api.get<any>(BASE);
        if (error) throw new Error("Failed to fetch products");
        if (Array.isArray(data)) return data.map(fromApiProduct);
        if (Array.isArray(data?.data)) return (data.data as any[]).map(fromApiProduct);
        return [];
    },

    /** Create a new product under this expert */
    createProduct: async (fd: FormData): Promise<any> => {
        const [data, error] = await api.post<any>(BASE, normalizeFormData(fd));
        if (error) {
            throw new Error((error as any)?.message || "Failed to create product");
        }
        return data;
    },

    /** Update an existing product */
    updateProduct: async (id: string, fd: FormData): Promise<any> => {
        const [data, error] = await api.patch<any>(`${BASE}/${id}`, normalizeFormData(fd));
        if (error) {
            throw new Error((error as any)?.message || "Failed to update product");
        }
        return data;
    },

    /** Delete a product */
    deleteProduct: async (id: string): Promise<any> => {
        const [data, error] = await api.delete<any>(`${BASE}/${id}`);
        if (error) {
            throw new Error((error as any)?.message || "Failed to delete product");
        }
        return data;
    },
};

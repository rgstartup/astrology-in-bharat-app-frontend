export interface Product {
    id?: string;
    _id?: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    imageUrl: string;
    isActive?: boolean;
    expert_id?: string;
    merchant_id?: string;
    category?: string;
}

const fromApiProduct = (raw: any): Product => ({
    id: raw?.id ? String(raw.id) : "",
    _id: raw?._id,
    name: raw?.name || "",
    description: raw?.description || "",
    price: Number(raw?.price ?? 0),
    originalPrice: Number(raw?.original_price ?? 0),
    imageUrl: raw?.image_url || raw?.image || "",
    isActive: raw?.is_active ?? true,
    expert_id: raw?.expert_id,
    merchant_id: raw?.merchant_id,
    category: raw?.category,
});

const toApiPayload = (product: Partial<Product>) => {
    const payload: Record<string, unknown> = {};

    if (product.name !== undefined) payload.name = product.name;
    if (product.description !== undefined) payload.description = product.description;
    if (product.price !== undefined) payload.price = product.price;
    if (product.originalPrice !== undefined) payload.original_price = product.originalPrice;
    if (product.imageUrl !== undefined) payload.image_url = product.imageUrl;
    if (product.isActive !== undefined) payload.is_active = product.isActive;

    return payload;
};

const normalizeProductFormData = (input: FormData) => {
    const output = new FormData();

    for (const [key, value] of input.entries()) {
        if (key === "originalPrice") {
            output.append("original_price", value);
            continue;
        }
        if (key === "imageUrl") {
            output.append("image_url", value);
            continue;
        }
        if (key === "isActive") {
            output.append("is_active", value);
            continue;
        }
        output.append(key, value);
    }

    return output;
};

import { api } from "@/lib/api";

export const ProductService = {
    getProducts: async (): Promise<[any | null, any | null]> => {
        const [data, error] = await api.get("/products");
        if (error) return [null, error];

        if (Array.isArray(data)) return [data.map(fromApiProduct), null];
        if (Array.isArray((data as any)?.data)) {
            return [{ ...(data as any), data: (data as any).data.map(fromApiProduct) }, null];
        }

        return [data, null];
    },

    createProduct: async (product: Product | FormData): Promise<[any | null, any | null]> => {
        const isFormData = product instanceof FormData;
        const payload = isFormData
            ? normalizeProductFormData(product as FormData)
            : toApiPayload(product as Product);

        return await api.post("/products", payload as any);
    },

    updateProduct: async (id: string, product: Partial<Product> | FormData): Promise<[any | null, any | null]> => {
        const isFormData = product instanceof FormData;
        const payload = isFormData
            ? normalizeProductFormData(product as FormData)
            : toApiPayload(product as Partial<Product>);

        return await api.patch(`/products/${id}`, payload as any);
    },

    deleteProduct: async (id: string): Promise<[any | null, any | null]> => {
        return await api.delete(`/products/${id}`);
    },

    uploadFile: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        const [data, error] = await api.upload("/api/upload", formData);

        if (error) {
            throw new Error("Upload failed");
        }
        return (data as any).url;
    }
};





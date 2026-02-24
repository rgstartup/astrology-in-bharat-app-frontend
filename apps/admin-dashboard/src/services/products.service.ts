export interface Product {
    id?: string;
    _id?: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    imageUrl: string;
    isActive?: boolean;
}

const fromApiProduct = (raw: any): Product => ({
    id: raw?.id ?? raw?._id,
    _id: raw?._id,
    name: raw?.name || "",
    description: raw?.description || "",
    price: Number(raw?.price ?? 0),
    originalPrice: Number(raw?.originalPrice ?? raw?.original_price ?? 0),
    imageUrl: raw?.imageUrl || raw?.image_url || raw?.image || "",
    isActive: raw?.isActive ?? raw?.is_active ?? true,
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

const getCookie = (name: string) => {
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
};

const getAuthHeaders = (): Record<string, string> => {
    const token = getCookie("accessToken");
    return token ? { "Authorization": `Bearer ${token}` } : {};
};

const API_BASE = ""; // Relative Base URL for Proxy

export const ProductService = {
    getProducts: async () => {
        const res = await fetch(`${API_BASE}/api/v1/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        if (Array.isArray(data)) return data.map(fromApiProduct);
        if (Array.isArray(data?.data)) return { ...data, data: data.data.map(fromApiProduct) };

        return data;
    },

    createProduct: async (product: Product | FormData) => {
        const isFormData = product instanceof FormData;
        const headers: Record<string, string> = { ...getAuthHeaders() };
        const payload = isFormData
            ? normalizeProductFormData(product as FormData)
            : toApiPayload(product as Product);

        if (!isFormData) {
            headers["Content-Type"] = "application/json";
        }

        const res = await fetch(`${API_BASE}/api/v1/products`, {
            method: "POST",
            headers,
            body: isFormData ? payload : JSON.stringify(payload),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to create product");
        }
        return res.json();
    },

    updateProduct: async (id: string, product: Partial<Product>) => {
        const payload = toApiPayload(product);

        const res = await fetch(`${API_BASE}/api/v1/products/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to update product");
        }
        return res.json();
    },

    deleteProduct: async (id: string) => {
        const res = await fetch(`${API_BASE}/api/v1/products/${id}`, {
            method: "DELETE",
            headers: {
                ...getAuthHeaders(),
            },
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to delete product");
        }
        return res.json();
    },

    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`/api/upload`, {
            method: "POST",
            body: formData,
            // No Content-Type header needed for FormData
            // headers: { ...getAuthHeaders() } // Add if local upload needs auth
        });

        if (!res.ok) {
            throw new Error("Upload failed");
        }
        const data = await res.json();
        return data.url;
    }
};




export interface Product {
    id?: string;
    _id?: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    imageUrl: string;
}

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
        return res.json();
    },

    createProduct: async (product: Product) => {
        const res = await fetch(`${API_BASE}/api/v1/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            },
            body: JSON.stringify(product),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to create product");
        }
        return res.json();
    },

    updateProduct: async (id: string, product: Partial<Product>) => {
        const res = await fetch(`${API_BASE}/api/v1/products/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            },
            body: JSON.stringify(product),
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

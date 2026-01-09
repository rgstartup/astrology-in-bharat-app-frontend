export interface Product {
    id?: string;
    _id?: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    imageUrl: string;
    percentageOff?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export const getProducts = async (): Promise<Product[]> => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/v1/products`, {
            cache: "no-store" // ❌ NO CACHE AT ALL
        });

        if (!res.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await res.json();

        if (Array.isArray(data)) {
            return data;
        } else if (data.data && Array.isArray(data.data)) {
            return data.data;
        }

        return [];
    } catch (error) {
        console.error("Backend not reachable:", error);
        return []; // backend band → kuch bhi show nahi
    }
};

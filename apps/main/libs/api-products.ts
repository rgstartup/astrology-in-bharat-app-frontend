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

import { API_BASE_URL } from '../utils/api-config';

export const getProducts = async (): Promise<Product[]> => {
    try {
        const res = await fetch(`${API_BASE_URL}/products`, {
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



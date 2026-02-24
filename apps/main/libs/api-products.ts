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

const normalizeProduct = (raw: any): Product => {
    const images = Array.isArray(raw?.images) ? raw.images : [];
    const firstImage = images[0];
    const firstImageUrl =
        typeof firstImage === "string"
            ? firstImage
            : firstImage?.url || firstImage?.image || firstImage?.image_url;

    return {
        id: raw?.id ?? raw?._id,
        _id: raw?._id,
        name: raw?.name || "",
        description: raw?.description || "",
        price: Number(raw?.price ?? raw?.sale_price ?? 0),
        originalPrice: Number(raw?.originalPrice ?? raw?.original_price ?? raw?.price ?? 0),
        imageUrl: raw?.imageUrl || raw?.image_url || raw?.image || firstImageUrl || "",
        percentageOff: Number(raw?.percentageOff ?? raw?.percentage_off ?? 0),
    };
};

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
            return data.map(normalizeProduct);
        } else if (data.data && Array.isArray(data.data)) {
            return data.data.map(normalizeProduct);
        }

        return [];
    } catch (error) {
        console.error("Backend not reachable:", error);
        return []; // backend band → kuch bhi show nahi
    }
};



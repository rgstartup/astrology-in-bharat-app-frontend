import { Product } from "@/lib/types";
import { api } from "@/lib/api";


const normalizeProduct = (raw: any): Product => {
    const images = Array.isArray(raw?.images) ? raw.images : [];
    const firstImage = images[0];
    const firstImageUrl =
        typeof firstImage === "string"
            ? firstImage
            : firstImage?.secure_url || firstImage?.url || firstImage?.image || firstImage?.image_url || firstImage?.path;

    return {
        id: raw?.id ?? raw?._id,
        _id: raw?._id,
        name: raw?.name || "",
        description: raw?.description || "",
        price: Number(raw?.price ?? raw?.sale_price ?? 0),
        originalPrice: Number(raw?.originalPrice ?? raw?.original_price ?? raw?.price ?? 0),
        imageUrl: raw?.secure_url || raw?.imageUrl || raw?.image_url || raw?.image || raw?.image_path || firstImageUrl || "",
        percentageOff: Number(raw?.percentageOff ?? raw?.percentage_off ?? 0),
    };
};

export const getProducts = async (): Promise<Product[]> => {
    try {
        const [data, error] = await api.get("/products", {} as any);

        if (error) {
            console.error("Failed to fetch products:", error);
            return [];
        }

        const raw: any = data;
        if (Array.isArray(raw)) {
            return raw.map(normalizeProduct);
        } else if (raw?.data && Array.isArray(raw.data)) {
            return raw.data.map(normalizeProduct);
        }

        return [];
    } catch (error) {
        console.error("Backend not reachable:", error);
        return [];
    }
};



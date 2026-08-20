import { Product } from "@/lib/types";
import { api } from "@/actions";


const normalizeProduct = (raw: any): Product => {
    return {
        id: raw?.id || raw?._id,
        _id: raw?._id,
        name: raw?.product_name || raw?.name || "",
        description: raw?.short_description || raw?.description || "",
        price: Number(raw?.price || 0),
        originalPrice: Number(raw?.original_price || raw?.originalPrice || 0),
        imageUrl: raw?.product_image || raw?.image_url || raw?.imageUrl || "",
        percentageOff: Number(raw?.percentage_off || raw?.percentageOff || 0),
    };
};

export const getProducts = async (): Promise<Product[]> => {
    try {
        const [data, error] = await api.get("/products", {} as any);

        if (error) {
            console.warn("⚠️ Failed to fetch products:", error);
            return [];
        }

        const raw: any = data;

        // Handle all possible backend response formats:
        // 1. { success: true, data: [...] }      <- find-all-products use case
        // 2. { data: [...] }                     <- generic
        // 3. [...]                               <- plain array
        let productArray: any[] = [];

        if (Array.isArray(raw)) {
            productArray = raw;
        } else if (raw?.data && Array.isArray(raw.data)) {
            productArray = raw.data;
        } else if (raw?.products && Array.isArray(raw.products)) {
            productArray = raw.products;
        } else if (raw?.data?.data && Array.isArray(raw.data.data)) {
            productArray = raw.data.data;
        }

        return productArray.map(normalizeProduct);
    } catch (error) {
        console.error("Backend not reachable:", error);
        return [];
    }
};



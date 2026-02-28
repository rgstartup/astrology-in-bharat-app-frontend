/**
 * Utility to normalize image paths and extract product image URLs.
 */

const legacyUploadsOrigin = process.env.NEXT_PUBLIC_ADMIN_UPLOADS_ORIGIN || "http://localhost:3001";

/**
 * Normalizes an image path to include the correct origin if necessary.
 */
export const normalizeImagePath = (value: string): string => {
    if (!value) return value;

    if (value.startsWith("/uploads/")) return value;

    if (value.startsWith("http://") || value.startsWith("https://")) {
        try {
            const parsed = new URL(value);
            if (parsed.pathname.startsWith("/uploads/")) {
                // Legacy uploads are stored in admin-dashboard /public/uploads
                return `${legacyUploadsOrigin}${parsed.pathname}`;
            }
            return value;
        } catch {
            return value;
        }
    }

    if (value.startsWith("/")) return value;
    return `${legacyUploadsOrigin}/uploads/${value}`;
};

/**
 * Extracts and normalizes the image URL from a product object.
 */
export const getProductImageUrl = (product: any): string => {
    if (!product) return "/images/image-not-found.png";

    const rawImage = product.imageUrl || product.image || product.secure_url || product.url || product.image_url || product.path;

    const normalizedValue = typeof rawImage === "string" ? rawImage : "";

    return normalizedValue
        ? normalizeImagePath(normalizedValue)
        : "/images/image-not-found.png";
};

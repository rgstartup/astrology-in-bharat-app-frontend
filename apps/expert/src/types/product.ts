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

export type ProductFormMode = "create" | "edit";

export interface ProductManagerStats {
    totalProducts: number;
    activeProducts: number;
    lowStockItems: number;
}

export interface Product {
    id?: string;
    _id?: string;
    imageUrl?: string;
    image?: string;
    productImage?: string; // Added to match e-commerce app
    name: string;
    productName?: string; // Added to match e-commerce app
    description: string;
    originalPrice?: number | string;
    price: number | string;
    sale_price?: number | string;
    percentageOff?: any;
    gallery?: string[];
}

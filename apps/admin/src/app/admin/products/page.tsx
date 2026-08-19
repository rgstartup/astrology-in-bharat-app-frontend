"use client";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import { Button, SearchInput } from "@repo/ui";
import { Product, ProductService } from "@/services/products.service";

// Helper to safely parse numbers
const parsePrice = (value: any) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState("");

    const fetchProducts = async () => {
        setLoading(true);
        const [data, error] = await ProductService.getProducts();

        if (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to fetch products");
            setProducts([]);
            setLoading(false);
            return;
        }

        if (Array.isArray(data)) {
            setProducts(data);
        } else if (data && data.data && Array.isArray(data.data)) {
            setProducts(data.data);
        } else {
            setProducts([]);
        }
        setLoading(false);
    };


    useEffect(() => {
        fetchProducts();
    }, []);

    // Filtered Products
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());

        // Always exclude "Admin" products (those without merchant_id or expert_id)
        const isMerchantOrExpertProduct = !!p.expert_id || !!p.merchant_id || p.category === "astrologer";

        return matchesSearch && isMerchantOrExpertProduct;
    });



    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-full md:w-64">
                        <SearchInput
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search products..."
                        />
                    </div>
                </div>
            </div>





            {/* Product List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <p className="text-gray-500 col-span-full text-center py-8">Loading products...</p>
                ) : filteredProducts.length === 0 ? (
                    <p className="text-gray-500 col-span-full text-center py-8">No products found.</p>
                ) : (
                    filteredProducts.map((product) => (
                        <div key={product.id || product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
                            <div className="h-48 overflow-hidden bg-gray-100 relative">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300?text=No+Image')}
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-800 mb-1">{product.name}</h3>
                                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-lg font-bold text-yellow-600">₹{product.price}</span>
                                        {product.originalPrice > product.price && (
                                            <span className="text-sm text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}





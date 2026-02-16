"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { ProductCard } from "./ProductCard";

const SearchIcon = Search as any;
const XIcon = X as any;

interface Product {
    id?: string;
    _id?: string;
    imageUrl?: string;
    name: string;
    description: string;
    originalPrice?: number | string;
    price: number | string;
    percentageOff?: number | string;
}

interface ProductGridProps {
    products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter products based on search query
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleClear = () => {
        setSearchQuery("");
    };

    return (
        <section className="store-products py-5 ">
            <div className="container">
                <div className="row mb-5 align-items-end">
                    <div className="col-md-8">
                        <h2 className="section-heading text-left mb-2 display-6 fw-semibold text-[#301118]">
                            Our products
                        </h2>
                    </div>
                    <div className="col-md-4 mt-3 mt-md-0 d-flex justify-content-md-end">
                        <div className="w-100" style={{ maxWidth: '300px' }}>
                            {/* 🔹 Local Search Input Implementation */}
                            <div className="relative w-full">
                                <SearchIcon className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-10 text-base outline-none transition-all 
                                    hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-400 text-gray-700 bg-white"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={handleClear}
                                        className="absolute top-1/2 -translate-y-1/2 right-3 p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="product-slider-container">
                    <div className="row g-4">
                        {products.length === 0 ? (
                            <p className="text-center text-gray-500 col-12">No products available at the moment.</p>
                        ) : filteredProducts.length === 0 ? (
                            <div className="col-12 text-center py-10 bg-gray-50 rounded-xl">
                                <p className="text-gray-500 font-medium">
                                    No products found for "{searchQuery}"
                                </p>
                            </div>
                        ) : (
                            filteredProducts.map((product) => (
                                <div key={product.id || product._id} className="col-lg-3 col-md-4 col-sm-6">
                                    <ProductCard product={product} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductGrid;

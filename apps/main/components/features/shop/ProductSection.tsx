"use client";

import React, { useState } from "react";
import ProductCarousel from "./ProductCarousel";
import NextImage from "next/image";
import { Search, X } from "lucide-react";

const Image = NextImage as any;
const SearchIcon = Search as any;
const XIcon = X as any;

interface Product {
    id?: string;
    _id?: string;
    imageUrl?: string;
    name: string;
    description: string;
    originalPrice: number | string;
    price: number | string;
    percentageOff?: number | string;
}

interface ProductSectionProps {
    products: Product[];
}

/* 🔹 Skeleton Card */
const ProductSkeleton = () => {
    return (
        <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
            <div className="bg-white rounded-2xl p-3 shadow-[0_10px_25px_rgba(0,0,0,0.08)] h-full animate-pulse flex flex-col">
                <div className="mb-[15px] h-[200px] w-full bg-gray-200 rounded-xl"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="mt-auto">
                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded-full w-full"></div>
                </div>
            </div>
        </div>
    );
};

const ProductSection: React.FC<ProductSectionProps> = ({ products }) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter products based on search query
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleClear = () => {
        setSearchQuery("");
    };

    return (
        <>
            <div className="row mb-4 align-items-end">
                <div className="col-md-8">
                    <h2 className="title-line mb-2 c-1e0b0f">
                        <span>Astrology Products</span>
                    </h2>
                    <p className="aib-products-subtitle c-1e0b0f m-0">
                        Energized & Expert-Recommended Astrology Products for Positive
                        Life Changes
                    </p>
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

            <div className="row">
                {products.length === 0 ? (
                    /* 🔥 4 Skeleton Cards for empty initial state */
                    Array.from({ length: 4 }).map((_, index) => (
                        <ProductSkeleton key={index} />
                    ))
                ) : filteredProducts.length === 0 ? (
                    <div className="col-12 text-center py-10 bg-gray-50 rounded-xl">
                        <p className="text-gray-500 font-medium">
                            No products found for "{searchQuery}"
                        </p>
                    </div>
                ) : (
                    <div className="col-12">
                        <ProductCarousel products={filteredProducts} />
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductSection;



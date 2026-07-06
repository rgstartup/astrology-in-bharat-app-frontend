"use client";

import React, { useState } from "react";
import ProductCarousel from "./ProductCarousel";
import { Search, X } from "lucide-react";

import { Product } from "@/lib/types";
import { useLanguageStore } from "@repo/store";
import { homeTranslations } from "../../../lib/translations/home";

interface ProductSectionProps {
    products: Product[];
    isLoading?: boolean;
}

/* 🔹 Premium Skeleton Card */
const ProductSkeleton = () => {
    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-premium h-full animate-pulse border border-gray-50 flex flex-col">
            <div className="mb-6 h-[220px] w-full bg-slate-100 rounded-[1.5rem]"></div>
            <div className="h-6 bg-slate-100 rounded-full w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-100 rounded-full w-full mb-2"></div>
            <div className="h-4 bg-slate-100 rounded-full w-5/6 mb-6"></div>
            <div className="mt-auto space-y-4">
                <div className="h-6 bg-slate-100 rounded-full w-1/2"></div>
                <div className="h-14 bg-slate-100 rounded-2xl w-full"></div>
            </div>
        </div>
    );
};

const ProductSection: React.FC<ProductSectionProps> = ({ products, isLoading = false }) => {
    const { lang } = useLanguageStore();
    const t = homeTranslations[lang as keyof typeof homeTranslations] || homeTranslations.en;
    const [searchQuery, setSearchQuery] = useState("");

    // Filter products based on search query
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleClear = () => {
        setSearchQuery("");
    };

    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-8 px-4 md:px-0">
                <div className="w-full md:w-auto">
                    <div className="w-full">
                        <h2 className="section-heading-premium uppercase mb-0">
                            <span>{t.products.title}</span>
                        </h2>
                    </div>
                    <p className="text-slate-500 font-medium text-sm mt-4 md:mt-2 max-w-xl">
                        {t.products.subtitle}
                    </p>
                </div>
                
                <div className="w-full lg:w-auto shrink-0">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange/80 to-orange rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
                        <div className="relative flex items-center bg-white rounded-2xl border border-[#d95a00] overflow-hidden shadow-sm hover:border-[#ff6b00] focus-within:shadow-xl focus-within:border-[#ff6b00] focus-within:ring-2 focus-within:ring-[#d95a00]/30 transition-all duration-500 w-full sm:min-w-[320px]">
                            <Search className="ml-5 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t.products.searchPlaceholder}
                                className="w-full py-5 px-4 text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                            />
                            {searchQuery && (
                                <button
                                    onClick={handleClear}
                                    className="mr-3 p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-950 transition-all active:scale-90"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div>
                {isLoading ? (
                    /* 🔥 4 Skeleton Cards for loading state */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <ProductSkeleton key={index} />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="w-full text-center py-20 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200 space-y-4">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-slate-300 shadow-sm">
                           <Search className="w-10 h-10" />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">No products found</h4>
                        <p className="text-slate-400 font-medium">
                            Check back later for new inventory.
                        </p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="w-full text-center py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200 space-y-6">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-slate-300 shadow-sm">
                           <Search className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">No items found</h4>
                           <p className="text-slate-400 font-bold italic">
                               {t.products.noResults.replace("{query}", searchQuery)}
                           </p>
                        </div>
                        <button 
                            onClick={handleClear}
                            className="px-8 py-3 bg-slate-950 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-orange transition-all"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="w-full">
                        <ProductCarousel products={filteredProducts} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductSection;

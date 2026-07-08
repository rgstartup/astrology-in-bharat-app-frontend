"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useLanguageStore } from "@repo/store";
import { homeTranslations } from "../../../lib/translations/home";

const SearchIcon = Search as any;
const XIcon = X as any;

import { Product } from "@/lib/types";

interface ProductGridProps {
    products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const { lang } = useLanguageStore();
    const t = homeTranslations[lang as keyof typeof homeTranslations] || homeTranslations.en;

    // Filter products based on search query
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleClear = () => {
        setSearchQuery("");
    };

    return (
    <section className="pt-8 md:pt-12 pb-12 md:pb-24 bg-white relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8 md:mb-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 inline-block relative">
              {t.products.pageTitle}
              <div className="absolute -bottom-2 left-0 w-24 h-1.5 bg-orange rounded-full"></div>
            </h2>
            <p className="text-gray-500 font-bold mt-4 leading-relaxed">
              {t.products.pageDescription}
            </p>
          </div>
          
          <div className="w-full md:w-auto min-w-[320px]">
            {/* 🔹 Local Search Input Implementation */}
            <div className="relative group">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.products.searchPlaceholder}
                className="w-full pl-12 pr-12 py-4 bg-white border-2 border-orange rounded-2xl focus:ring-4 focus:ring-orange/10 transition-all outline-none font-bold text-sm shadow-[0_4px_15px_rgba(242,101,0,0.1)]"
              />
              {searchQuery && (
                <button
                  onClick={handleClear}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-orange/10 rounded-xl text-gray-400 hover:text-orange transition-all"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="relative">
          {products.length === 0 ? (
            <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
               <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                <i className="fa-solid fa-box-open text-3xl"></i>
              </div>
              <p className="text-gray-500 font-black uppercase tracking-widest text-sm">{t.products.noProductsAvailable}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-orange/5 rounded-[3rem] border-2 border-dashed border-orange/20 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-orange/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-orange">
                <i className="fa-solid fa-magnifying-glass text-3xl"></i>
              </div>
              <p className="text-gray-900 font-black text-xl mb-2">
                {t.products.noResultsFound}
              </p>
              <p className="text-gray-500 font-bold">
                {t.products.noResultsDesc.replace('"{query}"', `"${searchQuery}"`)}
              </p>
              <button 
                onClick={handleClear}
                className="mt-8 px-8 py-3 bg-white border-2 border-orange/20 text-orange rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange hover:text-white transition-all shadow-sm"
              >
                {t.products.clearSearch}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
    );
};

export default ProductGrid;

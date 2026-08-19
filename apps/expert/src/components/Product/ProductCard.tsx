"use client";

import React, { FC } from "react";
import { Heart, Pencil, Trash2 } from "lucide-react";
import { Product } from "@/types/product";

interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

export const ProductCard: FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
    const discount =
        product.originalPrice > product.price
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

    const productId = (product.id || product._id) as string;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm hover:shadow-xl transition-all group flex flex-col">
            <div className="aspect-square bg-orange-50/30 rounded-xl relative overflow-hidden p-4 flex items-center justify-center mb-3">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/400x400?text=No+Image";
                    }}
                />
                {discount > 0 && (
                    <div className="absolute top-2.5 left-2.5 bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow">
                        {discount}% OFF
                    </div>
                )}
                {!product.isActive && (
                    <div className="absolute top-2.5 left-2.5 bg-gray-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow">
                        Inactive
                    </div>
                )}
                <div className="absolute top-2.5 right-2.5 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow">
                    <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                </div>
            </div>

            <div className="px-1 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 text-[15px] leading-tight line-clamp-2 mb-1">
                    {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2 line-clamp-1 font-medium">
                    {product.shortDescription || "Astrology Product"}
                </p>
                <p className="text-xs text-gray-400 mb-3 line-clamp-2 flex-1">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-end gap-2">
                        <span className="text-xl font-black text-[#F25E0A]">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-400 line-through mb-0.5">
                                ₹{product.originalPrice}
                            </span>
                        )}
                    </div>
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${(product.stock || 0) > 5
                        ? "bg-green-50 text-green-600 border border-green-100"
                        : (product.stock || 0) > 0
                            ? "bg-orange-50 text-orange-600 border border-orange-100"
                            : "bg-red-50 text-red-600 border border-red-100"
                        }`}>
                        {(product.stock || 0) > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                    <button
                        onClick={() => onEdit(product)}
                        className="flex items-center justify-center py-2 text-xs font-semibold text-[#F25E0A] border-2 border-[#F25E0A] hover:bg-orange-50 rounded-full transition-colors"
                    >
                        <Pencil className="w-3 h-3 mr-1" /> Edit
                    </button>
                    <button
                        onClick={() => onDelete(productId)}
                        className="flex items-center justify-center py-2 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                    >
                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

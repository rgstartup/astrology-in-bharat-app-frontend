"use client";

import React from "react";
import NextImage from "next/image";
import { useClientAuth } from "@packages/ui/src/context/ClientAuthContext";
import { useCart } from "@packages/ui/src/context/CartContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Image = NextImage as any;

export interface Product {
    id?: string;
    _id?: string;
    imageUrl?: string;
    name: string;
    description: string;
    originalPrice?: number | string;
    price: number | string;
    percentageOff?: number | string;
}

interface ProductCardProps {
    product: Product;
    className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
    const imageUrl = product.imageUrl
        ? product.imageUrl.startsWith("http")
            ? product.imageUrl
            : product.imageUrl.startsWith("/")
                ? product.imageUrl
                : `/uploads/${product.imageUrl}`
        : "";

    const originalPrice = Number(product.originalPrice) || 0;
    const price = Number(product.price) || 0;
    const percentageOff = Number(product.percentageOff) || 0;

    const { isClientAuthenticated } = useClientAuth();
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = React.useState(false);
    const router = useRouter();

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isClientAuthenticated) {
            toast.error("Please login first to add to wishlist", {
                onClick: () => router.push("/sign-in"),
                autoClose: 3000,
                style: { cursor: 'pointer' }
            });
            return;
        }

        // TODO: Implement actual wishlist API call here
        toast.success("Added to wishlist!");
    };

    const handleBuy = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isClientAuthenticated) {
            toast.error("Please login first to buy products", {
                onClick: () => router.push("/sign-in"),
                autoClose: 3000,
                style: { cursor: 'pointer' }
            });
            return;
        }

        try {
            setIsAdding(true);
            await addToCart(Number(product.id || product._id), 1);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className={`group relative bg-white rounded-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100 ${className || ""}`}>
            {/* 🔥 Top Header: Offer Tag (Left) & Heart Icon (Right) */}
            {percentageOff > 0 && (
                <div className="absolute top-3 left-3 z-10">
                    <div className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 animate-pulse">
                        <i className="fa-solid fa-tag text-[10px]"></i>
                        {percentageOff}% OFF
                    </div>
                </div>
            )}

            {/* ❤️ Wishlist Icon */}
            <button
                onClick={handleLike}
                className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm w-9 h-9 flex items-center justify-center"
            >
                <i className="fa-regular fa-heart text-lg"></i>
            </button>

            {/* 🖼️ Image Area with Glow */}
            <div className="relative w-full aspect-square bg-[#f9f9f9] flex items-center justify-center overflow-hidden shrink-0">
                <div className="absolute w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-60"></div>
                <div className="relative w-full h-full">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-500 mix-blend-normal"
                    />
                </div>
            </div>

            {/* 📄 Content Area */}
            <div className="p-3 flex flex-col gap-2 flex-grow">
                <div>
                    <div className="flex justify-between items-start mb-0.5">
                        <h3 className="text-lg font-bold text-[#111827] line-clamp-1" title={product.name}>
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-1 text-yellow-400 text-xs font-medium bg-yellow-50 px-1.5 py-0.5 rounded">
                            <i className="fa-solid fa-star text-[10px]"></i>
                            <span className="text-gray-600">4.8</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>
                </div>

                {/* 💰 Price Section */}
                <div className="flex items-end gap-2 mt-auto pt-2">
                    <span className="text-2xl font-bold text-[#F95E09]">
                        ₹{price}
                    </span>
                    {originalPrice > price && (
                        <span className="text-base text-gray-400 line-through mb-1 ml-3">
                            ₹{originalPrice}
                        </span>
                    )}
                </div>

                {/* 🔘 Action Buttons */}
                <div className="grid grid-cols-5 gap-3 mt-1">
                    <button
                        onClick={handleBuy}
                        className="col-span-1 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors h-10"
                    >
                        <i className="fa-solid fa-bag-shopping"></i>
                    </button>
                    <button
                        onClick={handleBuy}
                        disabled={isAdding}
                        className="col-span-4 bg-[#F95E09] hover:bg-[#D84E06] text-white font-semibold rounded-full shadow-[0_4px_20px_-2px_rgba(249,94,9,0.3)] hover:shadow-orange-500/40 transform active:scale-95 transition-all duration-200 h-10 flex items-center justify-center gap-2 text-sm disabled:opacity-70"
                    >
                        <span>{isAdding ? "Adding..." : "Add to Cart"}</span>
                        {!isAdding && <i className="fa-solid fa-cart-plus"></i>}
                    </button>
                </div>
            </div>
        </div>
    );
};

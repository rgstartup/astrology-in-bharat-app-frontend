"use client";

import React from "react";
import { Button } from "@repo/ui";
import NextImage from "next/image";
import { useClientAuth } from "@repo/ui";
import { useCart } from "@repo/ui";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";

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
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543";
    const cleanApiUrl = API_URL.replace(/\/api\/v1\/?$/, "");

    const imageUrl = product.imageUrl
        ? product.imageUrl.startsWith("http")
            ? product.imageUrl
            : product.imageUrl.startsWith("/uploads/")
                ? `${cleanApiUrl}${product.imageUrl}`
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

    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const isLiked = product.id ? isInWishlist(Number(product.id || product._id)) : false;

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isClientAuthenticated) {
            toast.error("Please login first to use wishlist", {
                onClick: () => router.push("/sign-in"),
                autoClose: 3000,
                style: { cursor: 'pointer' }
            });
            return;
        }

        if (isLiked) {
            await removeFromWishlist(Number(product.id || product._id));
        } else {
            await addToWishlist(Number(product.id || product._id));
        }
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

            <button
                onClick={handleLike}
                className={`absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full transition-colors shadow-sm w-9 h-9 flex items-center justify-center ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
            >
                <i className={`${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart text-lg`}></i>
            </button>

            {/* 🖼️ Image Area with Glow */}
            <div className="relative w-full aspect-square bg-[#f9f9f9] flex items-center justify-center overflow-hidden shrink-0">
                <div className="absolute w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-60"></div>
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
                    <span className="text-2xl font-bold text-primary">
                        ₹{price}
                    </span>
                    {originalPrice > price && (
                        <span className="text-base text-gray-400 line-through mb-1 ml-3">
                            ₹{originalPrice}
                        </span>
                    )}
                </div>

                {/* 🔘 Action Buttons */}
                <div className="flex gap-2 mt-2">
                    <Button
                        variant="outline"
                        size="md"
                        onClick={handleBuy}
                        loading={isAdding}
                        className="flex-1 !rounded-full border-primary text-primary hover:bg-primary/5 h-10 text-[10px] p-6"
                    >
                        Add to Cart
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const id = product.id || product._id;
                            // Store in sessionStorage for a clean URL
                            sessionStorage.setItem('buyNowItem', JSON.stringify({ productId: id, quantity: 1 }));
                            router.push(`/checkout?type=order`);
                        }}
                        loading={isAdding}
                        className="flex-1 rounded-full h-10 text-[10px] p-6"
                    >
                        Buy Now
                    </Button>
                </div>
            </div>
        </div>
    );
};



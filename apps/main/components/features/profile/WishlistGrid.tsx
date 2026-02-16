"use client";

import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/features/shop/ProductCard";
import AstrologerCard from "@/components/features/astrologers/AstrologerCard";

const WishlistGrid: React.FC = () => {
    const { wishlistItems, expertWishlistItems, isLoading } = useWishlist();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543";
    const cleanApiUrl = API_URL.replace(/\/api\/v1\/?$/, "");

    const getImageUrl = (path?: string) => {
        if (!path) return "/images/dummy-astrologer.jpg";
        if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("/")) return path;
        return `${cleanApiUrl}/uploads/${path}`;
    };

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading your favorites...</p>
            </div>
        );
    }

    if (wishlistItems.length === 0 && expertWishlistItems.length === 0) {
        return (
            <div className="text-center py-10 bg-orange-50 rounded-2xl border border-dashed border-primary/20 mx-4">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <i className="fa-regular fa-heart fa-2x text-primary/30"></i>
                </div>
                <h5 className="text-[#13070b] font-bold">Your wishlist is empty</h5>
                <p className="small text-gray-500 mb-0">Start exploring and save your favorite items here!</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {wishlistItems.length > 0 && (
                <section>
                    <h5 className="flex items-center gap-2 mb-4 font-bold text-[#13070b]">
                        <i className="fa-solid fa-gift text-primary"></i> Liked Products
                    </h5>
                    <div className="row g-4">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="col-md-6 col-lg-4">
                                <ProductCard
                                    product={{
                                        id: String(item.product?.id || item.productId),
                                        imageUrl: item.product?.imageUrl || item.product?.image || "",
                                        name: item.product?.name || "Product",
                                        description: item.product?.description || "",
                                        price: item.product?.price || 0,
                                        originalPrice: item.product?.sale_price,
                                    } as any}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {expertWishlistItems.length > 0 && (
                <section>
                    <h5 className="flex items-center gap-2 mb-4 font-bold text-[#13070b]">
                        <i className="fa-solid fa-user-astronaut text-primary"></i> Liked Astrologers
                    </h5>
                    <div className="row g-4">
                        {expertWishlistItems.map((item) => {
                            const expert = item.expert;

                            // Handling response where user data might be flat on expert or nested
                            const name = (expert as any)?.name || (expert as any)?.user?.name || "Astrologer";
                            const avatar = (expert as any)?.avatar || (expert as any)?.user?.avatar;

                            return (
                                <div key={item.id} className="col-md-6 col-lg-4">
                                    <AstrologerCard
                                        astrologerData={{
                                            id: expert?.id || item.expertId,
                                            userId: (expert as any)?.userId || expert?.id,
                                            image: getImageUrl(avatar),
                                            name: name,
                                            expertise: (expert as any)?.specialization || (expert as any)?.expertise || "Vedic Astrology",
                                            experience: (expert as any)?.experience_in_years || (expert as any)?.experience || 5,
                                            language: Array.isArray((expert as any)?.languages)
                                                ? (expert as any).languages.join(", ")
                                                : ((expert as any)?.language || "Hindi, English"),
                                            price: (expert as any)?.price || 0,
                                            chat_price: (expert as any)?.chat_price,
                                            call_price: (expert as any)?.call_price,
                                            video_call_price: (expert as any)?.video_call_price,
                                            video: (expert as any)?.video || "",
                                            ratings: (expert as any)?.rating || (expert as any)?.ratings || 5,
                                            is_available: (expert as any)?.is_available ?? true,
                                            total_likes: (expert as any)?.total_likes || 0
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
};

export default WishlistGrid;

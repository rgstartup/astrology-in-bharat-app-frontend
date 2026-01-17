"use client";

import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/features/shop/ProductCard";
import AstrologerCard from "@/components/features/astrologers/AstrologerCard";

const WishlistGrid: React.FC = () => {
    const { wishlistItems, expertWishlistItems, isLoading } = useWishlist();

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-[#fd6410]" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading your favorites...</p>
            </div>
        );
    }

    if (wishlistItems.length === 0 && expertWishlistItems.length === 0) {
        return (
            <div className="text-center py-10 bg-orange-50 rounded-2xl border border-dashed border-[#fd641033] mx-4">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <i className="fa-regular fa-heart fa-2x text-[#fd641055]"></i>
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
                        <i className="fa-solid fa-gift text-[#fd6410]"></i> Liked Products
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
                        <i className="fa-solid fa-user-astronaut text-[#fd6410]"></i> Liked Astrologers
                    </h5>
                    <div className="row g-4">
                        {expertWishlistItems.map((item) => {
                            const expert = item.expert;
                            return (
                                <div key={item.id} className="col-md-6 col-lg-4">
                                    <AstrologerCard
                                        astrologerData={{
                                            id: expert?.id || item.expertId,
                                            image: expert?.user?.avatar || "/images/astro-img1.png",
                                            name: expert?.user?.name || "Astrologer",
                                            expertise: expert?.specialization || "Vedic Astrology",
                                            experience: expert?.experience_in_years || 0,
                                            language: "Hindi, English", // Fallback
                                            price: 0, // Fallback
                                            video: "",
                                            ratings: expert?.rating || 5,
                                            is_available: true
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

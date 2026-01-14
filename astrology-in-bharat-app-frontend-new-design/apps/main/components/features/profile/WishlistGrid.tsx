"use client";

import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/features/shop/ProductCard";

const WishlistGrid: React.FC = () => {
    const { wishlistItems, isLoading } = useWishlist();

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

    if (wishlistItems.length === 0) {
        return (
            <div className="text-center py-5">
                <i className="fa-regular fa-heart fs-1 text-muted mb-3 opacity-25"></i>
                <h5 className="text-muted">Your wishlist is empty</h5>
                <p className="small text-muted mb-0">Start exploring and save your favorite items here!</p>
            </div>
        );
    }

    return (
        <div className="row g-4">
            {wishlistItems.map((item) => (
                <div key={item.id} className="col-md-6 col-lg-4">
                    <ProductCard
                        product={{
                            id: String(item.product.id),
                            imageUrl: item.product.imageUrl || item.product.image || "", // Handle both
                            name: item.product.name,
                            description: item.product.description || "",
                            price: item.product.price,
                            sale_price: item.product.sale_price,
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export default WishlistGrid;

"use client";

import React from "react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { ProductCard } from "@/components/features/shop/ProductCard";
import AstrologerCard from "@/components/features/astrologers/AstrologerCard";
import { FaHeart, FaGift, FaUserAstronaut, FaSpinner } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import { MdStars } from "react-icons/md";
import { PujaCard } from "@/components/features/puja/PujaCard";

const WishlistGrid: React.FC = () => {
    const { wishlistItems, expertWishlistItems, pujaWishlistItems, isLoading } = useWishlistStore();

    const cleanApiUrl = "http://localhost:6543/api/v1";

    const getImageUrl = (path?: string) => {
        if (!path) return "/images/dummy-astrologer.jpg";
        if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("/")) return path;
        return `${cleanApiUrl}/uploads/${path}`;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm animate-pulse">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-16 h-16 bg-white rounded-2xl shadow-lg border border-primary/10 flex items-center justify-center text-primary">
                        <FaSpinner className="animate-spin text-2xl" />
                    </div>
                </div>
                <p className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Finding your saved stars</p>
            </div>
        );
    }

    if (wishlistItems.length === 0 && expertWishlistItems.length === 0 && pujaWishlistItems.length === 0) {
        return (
            <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200 px-6 max-w-4xl mx-auto">
                <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 shadow-premium border border-slate-100 text-slate-200">
                    <FaHeart size={40} className="animate-pulse" />
                </div>
                <h5 className="text-3xl font-black text-slate-950 uppercase tracking-tighter mb-4">Your wishlist is silent</h5>
                <p className="text-lg text-slate-400 font-bold italic mb-0 max-w-sm mx-auto">Start exploring and save your favorite experts and products to see them here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-24 pb-20">
            {wishlistItems.length > 0 && (
                <section className="space-y-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
                        <div className="space-y-2">
                           <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                              <FaGift className="text-primary text-[10px]" />
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Saved Items</span>
                           </div>
                           <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Liked Products</h2>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 font-bold italic text-sm">
                           <span className="tabular-nums">{wishlistItems.length}</span> items saved
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlistItems.map((item, idx) => (
                            <div 
                                key={item.id} 
                                className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <ProductCard
                                    product={{
                                        id: String(item.product?.id || item.productId),
                                        imageUrl: item.product?.imageUrl || item.product?.image || (item.product as any)?.image_url || "",
                                        name: item.product?.name || "Product",
                                        description: item.product?.description || "",
                                        price: item.product?.price || 0,
                                        originalPrice: item.product?.sale_price || (item.product as any)?.original_price,
                                    } as any}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {expertWishlistItems.length > 0 && (
                <section className="space-y-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
                        <div className="space-y-2">
                           <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full">
                              <FaUserAstronaut className="text-indigo-500 text-[10px]" />
                              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Favorite Experts</span>
                           </div>
                           <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Liked Astrologers</h2>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 font-bold italic text-sm">
                           <span className="tabular-nums">{expertWishlistItems.length}</span> experts saved
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {expertWishlistItems.map((item, idx) => {
                            const expert = item.expert;

                            // Handling response where user data might be flat on expert or nested
                            const name = (expert as any)?.name || (expert as any)?.user?.name || "Astrologer";
                            const avatar = (expert as any)?.avatar || (expert as any)?.user?.avatar;

                            return (
                                <div 
                                    key={item.id} 
                                    className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <AstrologerCard
                                        astrologerData={{
                                            id: expert?.id || item.expertId,
                                            userId: (expert as any)?.userId || expert?.id,
                                            image: getImageUrl(avatar),
                                            name: name,
                                            expertise: (expert as any)?.specialization || (expert as any)?.expertise || "",
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

            {pujaWishlistItems.length > 0 && (
                <section className="space-y-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
                        <div className="space-y-2">
                           <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 rounded-full">
                              <MdStars className="text-orange-500 text-[10px]" />
                              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Divine Rituals</span>
                           </div>
                           <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Liked Pujas</h2>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 font-bold italic text-sm">
                           <span className="tabular-nums">{pujaWishlistItems.length}</span> pujas saved
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pujaWishlistItems.map((item, idx) => (
                            <div 
                                key={item.id} 
                                className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <PujaCard puja={item.puja as any} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Premium Trust Banner */}
            <div className="text-center pt-24 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                <div className="inline-flex items-center gap-6 px-10 py-5 bg-white rounded-full border border-gray-100 shadow-sm">
                    <HiOutlineSparkles className="text-orange" />
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]">Your preferences are synced across all devices</span>
                </div>
            </div>
        </div>
    );
};

export default WishlistGrid;

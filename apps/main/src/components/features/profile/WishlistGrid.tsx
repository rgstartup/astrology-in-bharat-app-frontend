"use client";

import React from "react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { ProductCard } from "@/components/features/shop/ProductCard";
import ExpertCard from "@/components/features/experts/ExpertCard";
import { FaHeart, FaGift, FaUserAstronaut, FaSpinner } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import { MdStars } from "react-icons/md";
import { PujaCard } from "@/components/features/puja/PujaCard";
import { useLanguageStore } from "@repo/store";
import { profileTranslations } from "@/lib/translations/profile";
import { getProductImageUrl } from "@/utils/image-utils";
import Skeleton from "@/components/ui/Skeleton";

const WishlistGrid: React.FC = () => {
    const { wishlistItems, expertWishlistItems, pujaWishlistItems, isLoading } = useWishlistStore();
    const { lang } = useLanguageStore();
    const t = profileTranslations[lang as keyof typeof profileTranslations] || profileTranslations.en;
    const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

    if (isLoading) {
        return (
            <div className="space-y-12">
                <div className="flex justify-between items-center border-b border-slate-100 pb-8">
                    <div className="space-y-2">
                        <Skeleton width={100} height={20} className="rounded-full" />
                        <Skeleton width={200} height={32} />
                    </div>
                    <Skeleton width={80} height={16} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton width="100%" height={200} className="rounded-3xl" />
                            <Skeleton width="100%" height={24} />
                            <Skeleton width="60%" height={16} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (wishlistItems.length === 0 && expertWishlistItems.length === 0 && pujaWishlistItems.length === 0) {
        return (
            <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200 px-6 max-w-4xl mx-auto">
                <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 shadow-premium border border-slate-100 text-slate-200">
                    <FaHeart size={40} className="animate-pulse" />
                </div>
                <h5 className="text-2xl md:text-3xl font-black text-slate-950 uppercase tracking-tighter mb-4" style={fontStyle}>{t.wishlist.emptyTitle}</h5>
                <p className="text-base md:text-lg text-slate-400 font-bold italic mb-0 max-w-sm mx-auto" style={fontStyle}>{t.wishlist.emptyDesc}</p>
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
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest" style={fontStyle}>{t.wishlist.savedItems}</span>
                           </div>
                           <h2 className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tight" style={fontStyle}>{t.wishlist.likedProducts}</h2>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 font-bold italic text-sm" style={fontStyle}>
                           <span className="tabular-nums">{wishlistItems.length}</span> {t.wishlist.itemsSaved}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlistItems.filter(item => item.product).map((item, idx) => (
                            <div 
                                key={item.id} 
                                className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <ProductCard
                                    product={{
                                        id: String(item.product?.id || item.productId),
                                        imageUrl: getProductImageUrl(item.product),
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
                              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest" style={fontStyle}>{t.wishlist.favoriteExperts}</span>
                           </div>
                           <h2 className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tight" style={fontStyle}>{t.wishlist.likedExperts}</h2>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 font-bold italic text-sm" style={fontStyle}>
                           <span className="tabular-nums">{expertWishlistItems.length}</span> {t.wishlist.expertsSaved}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {expertWishlistItems.filter(item => item.expert).map((item, idx) => {
                            const expert = item.expert;

                            // Handling response where user data might be flat on expert or nested
                            const name = (expert as any)?.name || (expert as any)?.user?.name || "Expert";
                            const avatar = (expert as any)?.avatar || (expert as any)?.user?.avatar;

                            return (
                                <div 
                                    key={item.id} 
                                    className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <ExpertCard
                                        expertData={{
                                            id: expert?.id,
                                            userId: (expert as any)?.userId,
                                            image: getProductImageUrl({ imageUrl: avatar }),
                                            name: name,
                                            expertise: (expert as any)?.specialization || "",
                                            experience: (expert as any)?.experience_in_years || 0,
                                            language: Array.isArray((expert as any)?.languages)
                                                ? (expert as any).languages.join(", ")
                                                : "Hindi",
                                            price: (expert as any)?.price,
                                            chat_price: (expert as any)?.chat_price,
                                            call_price: (expert as any)?.call_price,
                                            video_call_price: (expert as any)?.video_call_price,
                                            video: (expert as any)?.video,
                                            ratings: (expert as any)?.ratings,
                                            is_available: (expert as any)?.is_available,
                                            total_likes: (expert as any)?.total_likes
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
                              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest" style={fontStyle}>{t.wishlist.divineRituals}</span>
                           </div>
                           <h2 className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tight" style={fontStyle}>{t.wishlist.likedPujas}</h2>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 font-bold italic text-sm" style={fontStyle}>
                           <span className="tabular-nums">{pujaWishlistItems.length}</span> {t.wishlist.pujasSaved}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pujaWishlistItems.filter(item => item.puja).map((item, idx) => (
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
                <div className="inline-flex items-center gap-3 md:gap-6 px-6 md:px-10 py-3 md:py-5 bg-white rounded-full border border-gray-100 shadow-sm">
                    <HiOutlineSparkles className="text-orange" />
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]" style={fontStyle}>{t.wishlist.syncNote}</span>
                </div>
            </div>
        </div>
    );
};

export default WishlistGrid;

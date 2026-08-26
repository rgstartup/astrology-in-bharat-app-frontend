"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    X,
    Star,
    ShoppingBag,
    Zap,
    ShieldCheck,
    RotateCcw,
    Truck,
    CheckCircle2,
    Heart,
    Share2,
    ChevronLeft,
    ChevronRight,
    Info
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import { Product } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/__useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { toast } from "react-toastify";
import { normalizeImagePath } from "@/utils/image-utils";

interface ProductQuickViewProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({ isOpen, onClose, product }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [isBuyLoading, setIsBuyLoading] = useState(false);
    const router = useRouter();

    const { isAuthenticated } = useAuthStore();
    const { isInWishlist } = useWishlistStore();
    const { toggleLike } = useWishlist();
    const { addToCart, isAdding } = useCart();

    // Real gallery images from backend with normalization
    const galleryItems = useMemo(() => {
        if (!product) return [];

        const rawItems = product.gallery && product.gallery.length > 0
            ? product.gallery
            : [product.image || product.imageUrl || (product as any).image_url || (product as any).productImage];

        return rawItems
            .filter(Boolean)
            .map(img => normalizeImagePath(img as string));
    }, [product]);

    // 🔒 Robust Scroll Lock for all browsers
    useEffect(() => {
        if (isOpen) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`;
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            document.documentElement.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            document.documentElement.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen || !product) return null;

    const productId = String(product.id || (product as any)._id);
    const isLiked = isInWishlist(productId);

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.error("Please login first to use wishlist", {
                onClick: () => router.push("/sign-in"),
                autoClose: 3000,
                style: { cursor: 'pointer' }
            });
            return;
        }
        toggleLike({ id: productId, type: "product", isLiked });
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.error("Please login first to buy products", {
                onClick: () => router.push("/sign-in"),
                autoClose: 3000,
                style: { cursor: 'pointer' }
            });
            return;
        }
        addToCart({ productId, quantity });
    };

    const handleBuyNow = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.error("Please login first to buy products", {
                onClick: () => router.push("/sign-in"),
                autoClose: 3000,
                style: { cursor: 'pointer' }
            });
            return;
        }
        setIsBuyLoading(true);
        sessionStorage.setItem('buyNowItem', JSON.stringify({ productId, quantity }));
        router.push(`/client/checkout?type=order`);
    };

    const price = Number(product.price) || 0;
    const originalPrice = Number(product.originalPrice || (product as any).original_price) || price;
    const discount = product.percentageOff || Math.round(((originalPrice - price) / originalPrice) * 100) || 0;


    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-10 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl animate-in fade-in duration-500"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-[#FDF8F4]/80 backdrop-blur-2xl rounded-[3rem] border border-white/40 shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 fade-in duration-500">

                {/* ❌ Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 w-12 h-12 rounded-2xl bg-white/80 border border-orange/10 text-slate-400 hover:bg-orange hover:text-white hover:rotate-90 transition-all duration-500 shadow-xl flex items-center justify-center group"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* 📸 Left Column: Media Gallery */}
                <div className="w-full md:w-1/2 bg-white/40 p-4 md:p-8 flex flex-col gap-4">
                    <div className="relative group/main overflow-hidden rounded-[2.5rem] bg-white border border-white/60 shadow-inner flex-1 flex items-center justify-center">
                        <Swiper
                            style={{
                                '--swiper-navigation-color': '#ff6b00',
                                '--swiper-pagination-color': '#ff6b00',
                            } as any}
                            loop={true}
                            spaceBetween={10}
                            navigation={true}
                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="w-full h-full"
                        >
                            {galleryItems.map((img, index) => (
                                <SwiperSlide key={index} className="flex items-center justify-center p-6 lg:p-12">
                                    <img
                                        src={img}
                                        alt={product.name}
                                        className="max-w-full max-h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Discount Badge */}
                        <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-orange text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
                            SAVE {discount}%
                        </div>
                    </div>

                    {/* Thumbnail Thumbnails */}
                    <div className="h-24 shrink-0">
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            loop={true}
                            spaceBetween={12}
                            slidesPerView={4}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="thumbs-swiper h-full"
                        >
                            {galleryItems.map((img, index) => (
                                <SwiperSlide key={index} className="cursor-pointer">
                                    <div className="h-full rounded-2xl overflow-hidden border-2 border-transparent transition-all hover:border-orange/20 [.swiper-slide-thumb-active_&]:border-orange shadow-md">
                                        <img src={img} className="w-full h-full object-cover" alt="Thumb" />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>

                {/* 📄 Right Column: Detailed Info */}
                <div
                    className="w-full md:w-1/2 p-6 md:p-10 lg:p-14 overflow-y-auto no-scrollbar custom-scrollbar bg-gradient-to-br from-white/40 to-transparent"
                    data-lenis-prevent
                >
                    <div className="space-y-8">
                        {/* Title & Brand */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-orange uppercase tracking-[0.3em] font-outfit">Spiritual Artifacts</span>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-500/10">
                                    <CheckCircle2 className="w-3 h-3" />
                                    In Stock
                                </div>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-tight">{product.name}</h2>

                            <div className="flex items-center gap-6 pt-2">
                                <div className="flex items-center gap-1.5 font-black text-slate-900">
                                    <Star className="w-4 h-4 fill-orange text-orange" />
                                    <span className="text-sm tracking-tight">{(product as any).rating || 4.8}</span>
                                    <span className="text-slate-300 text-xs font-bold leading-none">/ 5.0</span>
                                </div>
                                <div className="w-px h-4 bg-slate-200"></div>
                                <button className="text-xs font-bold text-slate-400 hover:text-orange transition-colors flex items-center gap-1.5 uppercase tracking-widest">
                                    {(product as any).reviewCount || 42} Customer Reviews
                                </button>
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="bg-white px-8 py-6 rounded-[2rem] border border-orange/10 shadow-xl shadow-orange/5 flex items-center justify-between group/price">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price Overview</p>
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-slate-900 tracking-tighter">₹{price}</span>
                                    <span className="text-lg font-bold text-gray-300 line-through decoration-orange/40 decoration-2">₹{originalPrice}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="px-3 py-1 bg-orange/10 text-orange rounded-full text-[10px] font-black uppercase tracking-widest border border-orange/10">Limited Slot</span>
                                <div className="mt-2 flex items-center -space-x-2">
                                    {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden"><img src={`https://i.pravatar.cc/100?u=${i}`} className="w-full h-full object-cover" /></div>)}
                                    <span className="pl-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">+12 Order Today</span>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Description */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-l-4 border-orange pl-4">
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">About This Item</h4>
                                <Info className="w-3 h-3 text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-medium text-base leading-relaxed">
                                {product.description || "This sacred artifact has been meticulously handcrafted and energized by renowned practitioners to ensure peak spiritual vibration and protection for your space."}
                            </p>
                        </div>

                        {/* Trust Benefits Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-4 bg-white/30 rounded-2xl border border-white/50">
                                <ShieldCheck className="w-5 h-5 text-orange mt-0.5" />
                                <div>
                                    <p className="text-[10px] font-black text-slate-900 uppercase">AIB Certified</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase leading-none mt-1">100% Authentic</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-white/30 rounded-2xl border border-white/50">
                                <Truck className="w-5 h-5 text-orange mt-0.5" />
                                <div>
                                    <p className="text-[10px] font-black text-slate-900 uppercase">Free Delivery</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase leading-none mt-1">Across Bharat</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pt-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantity Selection</span>
                                <div className="flex items-center bg-white border border-slate-100 rounded-full p-1 shadow-sm">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-black text-slate-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isAdding}
                                        className="flex-1 bg-white border-2 border-slate-100 text-slate-900 py-4.5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200/50 hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2 group/bag leading-none relative overflow-hidden"
                                    >
                                        <ShoppingBag className="w-5 h-5 group-hover/bag:scale-110 transition-transform" />
                                        {isAdding ? "Adding..." : "Add To Box"}
                                    </button>
                                    <button
                                        onClick={handleLike}
                                        className={`w-16 bg-white border-2 border-slate-100 flex items-center justify-center rounded-[1.5rem] transition-all shadow-xl shadow-slate-200/50 active:scale-95 group/heart ${isLiked ? 'text-red-500 border-red-50' : 'text-slate-300 hover:text-red-500 hover:border-red-100'}`}
                                    >
                                        <Heart className={`w-6 h-6 group-hover/heart:fill-red-500 ${isLiked ? 'fill-red-500' : ''} transition-all`} />
                                    </button>
                                </div>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={isBuyLoading}
                                    className="w-full bg-orange text-white py-5 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl shadow-orange/30 hover:shadow-orange/50 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3 leading-none"
                                >
                                    {isBuyLoading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Zap className="w-6 h-6 fill-white" />
                                            Secure Checkout
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Social Share */}
                        <div className="pt-8 border-t border-white/60 flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Spread Spiritual Awareness</span>
                            <div className="flex gap-4">
                                <button className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-orange transition-all shadow-sm">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductQuickView;

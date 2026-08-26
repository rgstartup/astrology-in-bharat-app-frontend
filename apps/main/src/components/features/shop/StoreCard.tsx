"use client";

import {
  MapPin,
  Phone,
  ShieldCheck,
  ExternalLink,
  Store as StoreIcon,
  Star
} from "lucide-react";
import { Store } from "@/lib/types/shop";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Link from "next/link";
import { useMerchantProducts } from "@/hooks/useMerchantProducts";
import { useMemo, useEffect, useState } from "react";
import { merchantSocket } from "@/lib/socket";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuthStore } from "@/store/__useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { useLanguageStore } from "@repo/store";
import { homeTranslations } from "@/lib/translations/home";

import "swiper/css";

interface StoreCardProps {
  store: Store;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  const { lang } = useLanguageStore();
  const translationSet = (homeTranslations[lang as keyof typeof homeTranslations] || homeTranslations.en) as any;
  const t = translationSet.storeSection.card;
  const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  const [isOnline, setIsOnline] = useState(store.isOnline ?? false);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const { isMerchantInWishlist } = useWishlistStore();
  const { toggleLike } = useWishlist();

  const isLiked = isMerchantInWishlist(String(store.id));

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error(
        <span>
          Please login to like this store.{" "}
          <span className="underline font-black">Login now →</span>
        </span>,
        {
          onClick: () => router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname === '/' ? '/#astrology-store' : pathname)}`),
          style: { cursor: "pointer", ...fontStyle },
        }
      );
      return;
    }

    toggleLike({ id: String(store.id), type: "merchant", isLiked });
  };

  // ─── Real-time Online status via WebSockets ───
  useEffect(() => {
    console.log(`🏠 [Card ${store.id}] Initializing socket listener...`);

    const handleStatusChange = (data: { merchant_id: string; is_online: boolean }) => {
      console.log(`🏠 [Card ${store.id}] Socket event received:`, data);
      if (String(data.merchant_id) === String(store.id)) {
        console.log(`✅ [Card ${store.id}] Status MATCH: updating to ${data.is_online}`);
        setIsOnline(data.is_online);
      }
    };

    merchantSocket.on("merchant_status_changed", handleStatusChange);

    return () => {
      console.log(`🏠 [Card ${store.id}] Cleaning up socket listener`);
      merchantSocket.off("merchant_status_changed", handleStatusChange);
    };
  }, [store.id]);

  // Fallback: Fetch products if popularProducts is missing or empty
  // ... (displayProducts logic kept same)
  const shouldFetch = !store.popularProducts || store.popularProducts.length === 0;

  const { data: fetchedProducts } = useMerchantProducts(
    // ...
    shouldFetch ? String(store.id) : undefined,
    1,
    6
  );

  const displayProducts = useMemo(() => {
    // If backend already provided popularProducts, use them
    if (store.popularProducts && store.popularProducts.length > 0) {
      return store.popularProducts;
    }
    // Otherwise use fetched products images
    if (Array.isArray(fetchedProducts) && fetchedProducts.length > 0) {
      return fetchedProducts
        .map((p: any) => p.image || p.imageUrl || p.productImage)
        .filter(Boolean) as string[];
    }
    return [];
  }, [store.popularProducts, fetchedProducts]);

  return (
    <Link
      href={`/stores/${store.id}`}
      className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full font-outfit"
    >
      {/* Main Shop Header Image */}
      <div className="relative h-48 bg-gray-50 overflow-hidden">
        {store.image ? (
          <img
            src={store.image}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt={store.name}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
            <StoreIcon className="w-12 h-12 text-orange-200" />
          </div>
        )}

        {/* Like Button & Count Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col items-center gap-2">
          <button
            onClick={handleLike}
            className={`w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full transition-all duration-300 shadow-lg border border-white/20 hover:scale-110 active:scale-95 ${isLiked ? 'text-red-500 shadow-red-500/20' : 'text-gray-400 hover:text-red-500'}`}
          >
            <i className={`${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart text-lg`}></i>
          </button>

          {store.likesCount !== undefined && (
            <div className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-sm flex items-center justify-center min-w-[32px] animate-in fade-in slide-in-from-top-1 duration-500">
              <span className="text-[10px] font-black text-white leading-none">
                {store.likesCount > 999 ? `${(store.likesCount / 1000).toFixed(1)}k` : store.likesCount}
              </span>
            </div>
          )}
        </div>

        {/* Rating Badge Overlay */}
        <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl shadow-lg flex items-center gap-1.5 border border-white/20">
          <Star className="w-3.5 h-3.5 text-orange fill-orange" />
          <span className="text-[12px] font-black text-slate-900 leading-none">{store.rating}</span>
          <span className="text-[9px] font-bold text-slate-400 leading-none">({store.reviewCount})</span>
        </div>

        {/* Shop Name & Location Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-white group-hover:text-orange-400 transition-colors duration-300 font-bold text-xl drop-shadow-md truncate">{store.name}</h2>
          </div>
          <div className="flex items-center text-orange-200 text-[10px] font-black uppercase tracking-widest leading-none">
            <MapPin className="w-3 h-3 mr-1 text-orange" />
            {store.city}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        {/* Store Intro */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none" style={fontStyle}>
              {t.about}
            </span>
            <div className="flex items-center gap-3">
              {isOnline ? (
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-500/10 rounded-full border border-green-500/20 animate-in fade-in zoom-in duration-500">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                  </span>
                  <span className="text-[7px] font-black text-green-500 uppercase tracking-tighter" style={fontStyle}>{t.online}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-500/10 rounded-full border border-gray-500/20">
                  <span className="inline-flex rounded-full h-1.5 w-1.5 bg-gray-400"></span>
                  <span className="text-[7px] font-black text-gray-400 uppercase tracking-tighter" style={fontStyle}>{t.offline}</span>
                </div>
              )}
              {store.isTrusted && (
                <div className="flex items-center text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black ml-1 uppercase tracking-tighter" style={fontStyle}>{t.verified}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-3 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-orange shrink-0 mt-0.5" />
            <p className="line-clamp-2 text-xs font-bold leading-relaxed">{store.address}, {store.pincode}</p>
          </div>

          <div className="flex items-center space-x-3 text-xs text-gray-600">
            <Phone className="w-4 h-4 text-orange shrink-0" />
            <p className="font-mono font-bold">{store.phone}</p>
          </div>
        </div>

        {/* Popular Products */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none" style={fontStyle}>
              {t.popularProducts}
            </span>
            <div className="w-3.5 h-3.5 bg-gray-100 rounded-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
            </div>
          </div>

          <div className="relative">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={8}
              slidesPerView={3}
              loop={displayProducts.length >= 3}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              className="rounded-xl overflow-hidden pointer-events-none"
            >
              {displayProducts.length > 0 ? (
                displayProducts.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="h-16 bg-gray-50 rounded-lg overflow-hidden relative border border-gray-100 shadow-sm">
                      <img
                        src={img}
                        className="w-full h-full object-cover"
                        alt="Product"
                        onError={(e) => {
                          // Fallback for broken images
                          (e.target as HTMLImageElement).src = "/images/placeholder-product.png";
                        }}
                      />
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                // Show skeletons while loading or if no products found
                [1, 2, 3].map((i) => (
                  <SwiperSlide key={i}>
                    <div className="h-16 bg-gray-100 rounded-lg animate-pulse border border-gray-100" />
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <div
            className="w-full py-3 bg-orange-600 text-white text-xs font-bold rounded-2xl tracking-[0.1em] flex items-center justify-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-900/10 active:scale-95 text-center"
            style={fontStyle}
          >
            {t.btnVisit} <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

"use client";

import React from "react";
import NextImage from "next/image";
import { useAuthStore } from "@/store/useAuthStore"; // Changed import
import { useCartStore } from "@/store/useCartStore"; // Changed import
import { toast } from "react-toastify";
import { useRouter, usePathname } from "next/navigation";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { useLanguageStore } from "@repo/store";
import { homeTranslations } from "../../../lib/translations/home";

import { getProductImageUrl } from "@/utils/image-utils";
import { Product } from "@/lib/types";

const Image = NextImage as any;

interface ProductCardProps {
  product: Product;
  className?: string;
  isCompact?: boolean;
  onView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className, isCompact, onView }) => {
  const { lang } = useLanguageStore();
  const t = homeTranslations[lang as keyof typeof homeTranslations] || homeTranslations.en;
  const imageUrl = getProductImageUrl(product);

  const originalPrice = Number(product.originalPrice) || 0;
  const price = Number(product.price) || 0;
  const percentageOff = Number(product.percentageOff) || 0;

  // Hooks
  const { isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const { toggleLike } = useWishlist();
  const { addToCart: addToCartOpt, isAdding } = useCart();
  const [isBuyLoading, setIsBuyLoading] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const productId = String(product.id || product._id);
  const isLiked = productId ? isInWishlist(productId) : false;
  const [currentLikes, setCurrentLikes] = React.useState<number>(Number((product as any).total_likes || (product as any).likes || 0));

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error(
        <span>
          Please login to like this product.{" "}
          <span className="underline font-black">Login now →</span>
        </span>,
        {
          onClick: () => router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname === '/' ? '/#astrology-products' : pathname)}`),
          style: { cursor: "pointer" },
        }
      );
      return;
    }

    // Optimistic like count update
    const newIsLiked = !isLiked;
    setCurrentLikes((prev) => (newIsLiked ? prev + 1 : Math.max(0, prev - 1)));

    toggleLike({ id: productId, type: "product", isLiked });
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error(
        <span>
          Please login to add to cart.{" "}
          <span className="underline font-black">Login now →</span>
        </span>,
        {
          onClick: () => router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname === '/' ? '/#astrology-products' : pathname)}`),
          style: { cursor: "pointer" },
        }
      );
      return;
    }

    addToCartOpt({ productId: String(product.id || product._id), quantity: 1 });
  };

  return (
    <div
      onClick={() => onView?.(product)}
      className={`group relative bg-white rounded-[2rem] shadow-premium hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col border-2 border-orange cursor-pointer ${className || ""}`}
    >
      {/* 🔥 Heart Icon (Left) */}

      <div className="absolute top-4 left-4 z-10 flex flex-col items-center gap-1">
        <button
          onClick={handleLike}
          className={`w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full transition-all duration-300 shadow-sm border border-gray-100 hover:scale-110 ${isLiked ? 'text-red-500 bg-red-50/50 border-red-100' : 'text-gray-400 hover:text-red-500'}`}
        >
          <i className={`${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart text-base transition-transform active:scale-125`}></i>
        </button>
        {currentLikes > 0 && (
          <span className="text-[10px] font-semibold text-white bg-black/50 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
            {currentLikes >= 1000
              ? (currentLikes / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
              : currentLikes}
          </span>
        )}
      </div>

      {/* 🖼️ Image Area with Glow */}
      <div className={`relative w-full ${isCompact ? 'aspect-[5/4]' : 'aspect-[5/4]'} bg-gray-50/50 flex items-center justify-center overflow-hidden shrink-0 group-hover:bg-white transition-colors duration-500`}>
        <div className="absolute inset-0 bg-gradient-to-br from-orange/5 via-transparent to-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className={`relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-110`}>
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 992px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* 📄 Content Area */}
      <div className={`${isCompact ? 'p-4 gap-3' : 'p-6 gap-4'} flex flex-col flex-grow relative bg-white`}>
        <div className={`${isCompact ? 'space-y-0.5' : 'space-y-1'}`}>
          <div className="flex justify-between items-start gap-2">
            <h3 className={`${isCompact ? 'text-sm' : 'text-lg'} font-black text-gray-900 leading-tight group-hover:text-orange transition-colors duration-300`} title={product.name}>
              {product.name}
            </h3>
            <div className="flex items-center gap-1.5 text-orange font-black bg-orange/5 px-2.5 py-1 rounded-lg text-xs shrink-0 border border-orange/10">
              <i className="fa-solid fa-star text-xs"></i>
              <span>4.8</span>
            </div>
          </div>
          <p className={`${isCompact ? 'text-[10px]' : 'text-sm'} font-medium text-gray-500 line-clamp-2 leading-snug`}>
            {product.description}
          </p>
        </div>

        {/* 💰 Price Section */}
        <div className="flex items-center gap-3 mt-auto">
          <div className="flex items-baseline gap-2">
            <span className={`${isCompact ? 'text-xl' : 'text-2xl'} font-black text-gray-900`}>
              ₹{price}
            </span>
            {originalPrice > price && (
              <span className="text-sm font-bold text-gray-300 line-through">
                ₹{originalPrice}
              </span>
            )}
          </div>
          {percentageOff > 0 && (
            <div className="bg-orange/10 text-orange border border-orange/20 text-[9px] md:text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 uppercase tracking-wider">
              <i className="fa-solid fa-fire text-[8px] md:text-[10px]"></i>
              {lang === 'hi' ? `${percentageOff}% ${t.products.off}` : `${percentageOff}% ${t.products.off}`}
            </div>
          )}
        </div>

        {/* 🔘 Action Buttons */}
        <div className={`flex gap-3 ${isCompact ? 'pt-1' : 'pt-2'}`}>
          <button
            onClick={handleAddToCart}
            className={`flex-1 ${isCompact ? 'h-9 rounded-lg px-0.5 text-[9px]' : 'h-10 md:h-11 rounded-xl px-2 text-[10px] md:text-[11px]'} border-2 border-gray-100 text-gray-500 font-bold uppercase tracking-wider hover:border-orange hover:text-orange hover:bg-orange/5 transition-all duration-300 flex items-center justify-center group/btn shadow-sm hover:shadow-md cursor-pointer`}
          >
            <span className="leading-tight text-center" style={lang === 'hi' ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {}}>
              {t.products.addToCart}
            </span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!isAuthenticated) {
                toast.error(
                  <span>
                    Please login to buy this product.{" "}
                    <span className="underline font-black">Login now →</span>
                  </span>,
                  {
                    onClick: () => router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname === '/' ? '/#astrology-products' : pathname)}`),
                    style: { cursor: "pointer" },
                  }
                );
                return;
              }

              setIsBuyLoading(true);
              const id = product.id || product._id;
              sessionStorage.setItem('buyNowItem', JSON.stringify({ productId: id, quantity: 1 }));
              router.push(`/client/checkout?type=order`);
            }}
            disabled={isBuyLoading}
            className={`flex-1 ${isCompact ? 'h-9 rounded-lg px-0.5 text-[9px]' : 'h-10 md:h-11 rounded-xl px-2 text-[10px] md:text-[11px]'} bg-orange text-white font-black uppercase tracking-widest shadow-lg shadow-orange/20 hover:shadow-orange/40 hover:bg-orange/90 transition-all duration-300 flex items-center justify-center cursor-pointer`}
          >
            {isBuyLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="leading-tight text-center" style={lang === 'hi' ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {}}>
                  {t.products.buyNow}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};



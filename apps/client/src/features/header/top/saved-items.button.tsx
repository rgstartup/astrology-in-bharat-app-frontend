"use client";

import React, { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { Heart } from "lucide-react";
import { useAuth } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { PATHS } from "@repo/routes";
import { withCallbackUrl } from "@/utils/getPathnameOrDefault";

const SavedItemsButton = () => {
  const { isAuthenticated } = useAuth();
  const {
    wishlistItems,
    expertWishlistItems,
    pujaWishlistItems,
    merchantWishlistItems,
    fetchWishlist,
  } = useWishlistStore();

  useEffect(() => {
    fetchWishlist(isAuthenticated);
  }, [isAuthenticated, fetchWishlist]);

  const totalSavedCount =
    wishlistItems.length +
    expertWishlistItems.length +
    pujaWishlistItems.length +
    merchantWishlistItems.length;

  const targetHref = isAuthenticated
    ? `${PATHS.PROFILE}?tab=wishlist`
    : withCallbackUrl(PATHS.LOGIN, `${PATHS.PROFILE}?tab=wishlist`);

  return (
    <Link
      href={targetHref}
      aria-label="Saved items"
      title="Saved Items / Wishlist"
      className="relative size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 no-underline border border-white/15 group shadow-xs shrink-0"
    >
      <Heart className="size-4 text-white group-hover:text-rose-300 group-hover:fill-rose-300 transition-colors" />
      {totalSavedCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-3.5 h-3.5 px-0.5 rounded-full bg-[#FF5500] text-white text-[9px] font-bold flex items-center justify-center border border-[#301118] shadow-xs animate-in zoom-in-50">
          {totalSavedCount > 99 ? "99+" : totalSavedCount}
        </span>
      )}
    </Link>
  );
};

export default SavedItemsButton;

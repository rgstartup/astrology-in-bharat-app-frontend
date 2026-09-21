"use client";

import React, { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { ShoppingBag } from "lucide-react";
import { useAuth } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { PATHS } from "@repo/routes";

const CartComponent = () => {
  const { isAuthenticated } = useAuth();
  const { cartCount, fetchCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  return (
    <Link
      href={PATHS.CART}
      aria-label="Shopping cart"
      title="Shopping Cart"
      className="relative size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 no-underline border border-white/15 group shadow-xs shrink-0"
    >
      <ShoppingBag className="size-4 text-white group-hover:text-amber-200 transition-colors" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-3.5 h-3.5 px-0.5 rounded-full bg-[#FF5500] text-white text-[9px] font-bold flex items-center justify-center border border-[#301118] shadow-xs animate-in zoom-in-50">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>
  );
};

export default CartComponent;

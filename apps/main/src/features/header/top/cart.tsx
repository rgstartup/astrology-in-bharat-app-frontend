"use client";

import { useAuth } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { PATHS } from "@repo/routes";
import Link from "next/link";
import React, { useEffect } from "react";

const CartComponent = () => {
  const { isAuthenticated } = useAuth();
  const { cartCount, fetchCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <Link
      href={PATHS.CART}
      className="relative top-[3px] text-white hover:text-white inline-flex"
    >
      <i className="fa-solid fa-cart-shopping text-white text-xl" />
      {cartCount > 0 && (
        <span
          className="absolute inline-flex items-center justify-center rounded-full bg-red-500 text-white"
          style={{
            top: "-6px",
            right: "-10px",
            fontSize: "9px",
            padding: "2px 5px",
            minWidth: "15px",
            height: "15px",
            border: "1px solid #331a1a",
          }}
        >
          {cartCount}
        </span>
      )}
    </Link>
  );
};

export default CartComponent;

"use client";
import React from "react";
import { useCart } from "@/context/CartContext";

const FloatingCartButton = () => {
  const { openCart, cart } = useCart();

  if (cart.length === 0) return null;

  return (
    <button
      onClick={openCart}
      className="fixed bottom-8 right-8 z-40 bg-theme-orange text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform animate-bounce-custom"
    >
      <div className="relative">
        <i className="fa-solid fa-cart-shopping text-2xl"></i>
        <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
          {cart.length}
        </span>
      </div>
    </button>
  );
};

export default FloatingCartButton;

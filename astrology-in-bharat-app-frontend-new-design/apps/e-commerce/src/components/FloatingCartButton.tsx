"use client";
import React from "react";
import { useCart } from "@/context/CartContext";

const FloatingCartButton = () => {
  const { openCart, cart } = useCart();

  return (
    <button
      onClick={openCart}
      className={`fixed bottom-8 right-8 z-40 p-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 group ${
        cart.length > 0
          ? "bg-theme-orange text-white scale-110"
          : "bg-white text-theme-brown border border-orange-100"
      }`}
    >
      <div className="relative">
        <i className="fa-solid fa-cart-shopping text-2xl group-hover:rotate-12 transition-transform"></i>
        {cart.length > 0 && (
          <span className="absolute -top-4 -right-4 bg-red-600 text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
            {cart.length}
          </span>
        )}
      </div>

      {/* Tooltip or Label - hidden on mobile, visible on desktop hover */}
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-theme-brown text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
        Your Cart {cart.length > 0 ? `(${cart.length})` : "(Empty)"}
      </span>
    </button>
  );
};

export default FloatingCartButton;

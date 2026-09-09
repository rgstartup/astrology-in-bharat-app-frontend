"use client";

import React from "react";

interface FloatingBarProps {
  isSticky: boolean;
  title: string;
  price: number;
  onBuyNow: () => void;
  onAddToCart: () => void;
  isAdding: boolean;
}

const FloatingBar: React.FC<FloatingBarProps> = ({ 
  isSticky, 
  title, 
  price,
  onBuyNow,
  onAddToCart,
  isAdding
}) => {
  return (
    <div
      className={`fixed bottom-0 left-0 w-full z-50 transition-all duration-700 ease-in-out hidden md:block ${
        isSticky ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="bg-white/80 backdrop-blur-2xl border-t border-gray-100 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.1)] rounded-t-[3rem] px-12 py-8">
        <div className="container mx-auto flex justify-between items-center gap-12">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-orange/10 text-orange flex items-center justify-center text-2xl shadow-inner italic font-black">
              <i className="fa-solid fa-sparkles"></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-orange uppercase tracking-[0.2em] mb-1">You are viewing</p>
              <h5 className="text-xl font-black text-gray-900 leading-none">{title}</h5>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-right">Special Price</p>
              <h5 className="text-3xl font-black text-gray-900 leading-none italic">
                ₹{price}
              </h5>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={onAddToCart}
                disabled={isAdding}
                className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-orange hover:text-orange hover:bg-orange/5 transition-all flex items-center gap-3 group"
              >
                <i className="fa-solid fa-cart-plus group-hover:scale-110 transition-transform"></i>
                {isAdding ? "Adding..." : "Add to Cart"}
              </button>
              <button 
                onClick={onBuyNow}
                className="px-10 py-4 bg-orange text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-premium hover:shadow-2xl hover:bg-orange/90 transition-all flex items-center gap-3"
              >
                <i className="fa-solid fa-bolt"></i>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingBar;

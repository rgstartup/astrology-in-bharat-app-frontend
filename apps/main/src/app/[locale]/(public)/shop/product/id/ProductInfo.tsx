"use client";

import React from "react";

interface Product {
  id: string;
  title: string;
  tagline: string;
  price: number;
  originalPrice: number;
  description: string;
  keyPoints: string[];
  avgRating: number;
  totalRatings: number;
}

interface ProductInfoProps {
  product: Product;
  quantity: number;
  setQuantity: (q: number) => void;
  onBuyNow: () => void;
  onAddToCart: () => void;
  isAdding: boolean;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) =>
  Array.from({ length: 5 }, (_, i) => (
    <i
      key={i}
      className={`fas fa-star text-xs ${i < rating ? "text-orange" : "text-gray-200"}`}
    ></i>
  ));

const ProductInfo: React.FC<ProductInfoProps> = ({ 
  product, 
  quantity, 
  setQuantity, 
  onBuyNow, 
  onAddToCart, 
  isAdding 
}) => {
  return (
    <div className="w-full lg:w-1/2 space-y-8" id="product-info-section">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange/10 text-orange rounded-full text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-4 duration-500">
          <i className="fa-solid fa-sparkles text-[10px]"></i>
          Energized Product
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
          {product.title}
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-orange/5 px-3 py-1.5 rounded-xl border border-orange/10">
            <StarRating rating={Math.round(product.avgRating)} />
            <span className="text-sm font-black text-orange ml-1">{product.avgRating}</span>
          </div>
          <span className="text-sm font-bold text-gray-400">
            {product.totalRatings.toLocaleString()} Verified Reviews
          </span>
        </div>
      </div>

      <div className="flex items-baseline gap-4">
        <h2 className="text-4xl font-black text-gray-900 italic">
          ₹{product.price}
        </h2>
        {product.originalPrice > product.price && (
          <span className="text-lg font-bold text-gray-300 line-through">
            ₹{product.originalPrice}
          </span>
        )}
        <div className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20">
          Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
        </div>
      </div>

      <p className="text-gray-500 font-bold leading-relaxed text-lg">
        {product.description}
      </p>

      {/* Key Points */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {product.keyPoints.map((point, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-orange/20 transition-all hover:bg-white hover:shadow-xl group">
            <div className="w-8 h-8 rounded-lg bg-orange/10 text-orange flex items-center justify-center text-xs group-hover:bg-orange group-hover:text-white transition-all">
              <i className="fa-solid fa-check"></i>
            </div>
            <span className="text-sm font-black text-gray-700">{point}</span>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="relative overflow-hidden p-6 rounded-[2rem] bg-orange/5 border-2 border-dashed border-orange/20 group animate-pulse hover:animate-none transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-orange shadow-sm">
              <i className="fa-solid fa-ticket text-xl"></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-orange uppercase tracking-widest mb-1">Exclusive Offer</p>
              <p className="text-sm font-black text-gray-900">Use code <span className="text-orange text-lg mx-1 uppercase">SAVE10</span> for extra discount!</p>
            </div>
          </div>
          <button className="hidden sm:block px-6 py-2.5 bg-white text-gray-900 rounded-xl font-black text-xs uppercase tracking-widest border border-gray-100 shadow-sm hover:bg-gray-50 transition-all active:scale-95">
            Copy
          </button>
        </div>
      </div>

      {/* Quantity & Buttons */}
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Quantity:</label>
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
             <button 
               onClick={() => setQuantity(Math.max(1, quantity - 1))}
               className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-400 hover:text-orange transition-all active:scale-90 shadow-sm"
             >
              <i className="fa-solid fa-minus text-xs"></i>
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              className="w-16 bg-transparent text-center font-black text-gray-900 outline-none border-none focus:ring-0"
            />
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-400 hover:text-orange transition-all active:scale-90 shadow-sm"
            >
              <i className="fa-solid fa-plus text-xs"></i>
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <button 
            onClick={onAddToCart}
            disabled={isAdding}
            className="flex-1 px-10 py-5 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-orange hover:text-orange hover:bg-orange/5 transition-all flex items-center justify-center gap-3 group/cart"
          >
            <i className="fa-solid fa-shopping-cart group-hover/cart:scale-110 transition-transform"></i>
            {isAdding ? "Adding..." : "Add to your Cart"}
          </button>
          <button 
            onClick={onBuyNow}
            className="flex-1 px-10 py-5 bg-orange text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-premium hover:shadow-2xl hover:bg-orange/90 transition-all flex items-center justify-center gap-3"
          >
            <i className="fa-solid fa-bolt"></i>
            Proceed to Buy
          </button>
        </div>
      </div>

      <div className="flex items-center gap-8 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-shield-check text-emerald-500"></i>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Safe Checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-truck-fast text-blue-500"></i>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Free Shipping</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;

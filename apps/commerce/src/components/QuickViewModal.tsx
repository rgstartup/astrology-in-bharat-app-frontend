import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Star, ShieldCheck, Truck, Plus, Minus, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  stock: number;
  status: string;
  imageUrl?: string;
  gallery?: string[];
  description?: string;
  created_at?: string;
}

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Fallback if gallery is missing but imageUrl is present
  const images = product.gallery && product.gallery.length > 0 
    ? product.gallery 
    : (product.imageUrl ? [product.imageUrl] : []);

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const discount = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-outfit">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl bg-[#f4f1ee] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row h-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-rose-500 hover:bg-rose-50 hover:scale-105 transition-all shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Gallery */}
        <div className="w-full md:w-[45%] p-6 md:p-8 flex flex-col gap-4">
          <div className="relative w-full aspect-square bg-white rounded-[2rem] overflow-hidden shadow-sm flex items-center justify-center group">
            {images.length > 0 ? (
              <img 
                src={images[currentImageIndex]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="text-gray-400 font-bold text-xs">No Image</div>
            )}

            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute top-5 left-5 bg-[#fd6410] text-white px-4 py-1.5 rounded-full text-[10px] font-bold shadow-lg">
                Save {discount}%
              </div>
            )}

            {/* Arrows */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-[#fd6410] shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-[#fd6410] shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={cn(
                    "flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300",
                    currentImageIndex === idx 
                      ? "border-[#fd6410] shadow-md scale-105" 
                      : "border-transparent opacity-60 hover:opacity-100 hover:scale-100"
                  )}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-[55%] p-6 md:p-10 md:pl-4 flex flex-col overflow-y-auto overflow-x-hidden">
          
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[#fd6410] text-[10px] font-bold">
              {product.category}
            </span>
            <span className="px-3 py-1 bg-green-100/50 text-green-700 rounded-full text-[9px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1c29] leading-[1.1] tracking-tight mb-4 break-words">
            {product.name}
          </h2>

          {/* Mock Reviews */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-1.5 text-amber-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold text-sm text-gray-900">4.8 <span className="text-gray-400 font-medium">/ 5.0</span></span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <span className="text-xs font-bold text-gray-400">
              42 Customer Reviews
            </span>
          </div>

          {/* Price Box */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 mb-8 relative group hover:border-[#fd6410]/30 transition-colors">
            <div className="absolute top-4 right-4 px-3 py-1 bg-orange-50 text-[#fd6410] rounded-full text-[9px] font-bold">
              Limited Slot
            </div>
            <p className="text-[10px] font-bold text-gray-400 mb-2">Price Overview</p>
            <div className="flex items-end gap-3">
              <span className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter">
                {formatPrice(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-lg font-bold text-gray-300 line-through mb-1.5">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap sm:flex-nowrap items-center gap-3 bg-gray-50/50 p-2.5 rounded-2xl w-full sm:w-max max-w-full">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[8px] font-bold">JD</div>
                <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-[8px] font-bold">AK</div>
                <div className="w-6 h-6 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-[8px] font-bold">SP</div>
              </div>
              <span className="text-[10px] font-bold text-gray-500">
                +12 Order Today
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="flex items-center gap-2 text-[11px] font-bold text-gray-900 mb-3">
              <div className="w-1 h-3 bg-[#fd6410] rounded-full" />
              About This Item
              <Info className="w-3.5 h-3.5 text-gray-400" />
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
              {product.description || "No detailed description provided for this product. Please update the product details to add a description."}
            </p>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-auto">
            <div className="bg-white p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#fd6410] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-900">AIB Certified</p>
                <p className="text-[8px] font-bold text-gray-400 mt-0.5">100% Authentic</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#fd6410] shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-900">Free Delivery</p>
                <p className="text-[8px] font-bold text-gray-400 mt-0.5">Across Bharat</p>
              </div>
            </div>
          </div>

          {/* Quantity Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200/50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400">
              Quantity Selection
            </span>
            <div className="flex items-center bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-500 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-gray-900 text-sm">
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-8 h-8 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-500 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

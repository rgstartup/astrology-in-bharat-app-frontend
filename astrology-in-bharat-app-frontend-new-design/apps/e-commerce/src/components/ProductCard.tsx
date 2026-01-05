"use client";
import React from "react";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  title,
  description,
  price,
  originalPrice,
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ id, title, price, image, quantity: 1 });
  };

  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  return (
    <div className="group bg-white rounded-3xl p-5 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-theme-orange h-full flex flex-col justify-between hover:-translate-y-2">
      <div>
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="flex justify-end mb-2">
            <span className="bg-theme-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              {discount}% OFF
            </span>
          </div>
        )}

        {/* Product Image */}
        <div className="mb-4 aspect-square relative bg-gradient-to-br from-orange-50 to-purple-50 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/300x300?text=Product";
            }}
          />
        </div>

        {/* Product Info */}
        <h4 className="text-lg font-bold text-gray-900 mb-2 font-pl group-hover:text-theme-orange transition-colors">
          {title}
        </h4>
        <p className="text-sm text-gray-600 mb-4 font-outfit line-clamp-2">
          {description}
        </p>
      </div>

      <div>
        {/* Pricing */}
        <div className="mb-4 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-2xl font-bold text-theme-orange font-pl">
            ₹{price.toLocaleString("en-IN")}
          </span>
          <span className="text-sm text-gray-400 line-through font-outfit">
            ₹{originalPrice.toLocaleString("en-IN")}
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleAddToCart}
          className="w-full py-3 px-6 bg-theme-orange text-white rounded-full font-semibold hover:bg-theme-orange-dark transition-all shadow-md hover:shadow-lg transform active:scale-95 flex items-center justify-center gap-2 font-pl group-hover:scale-105"
        >
          <i className="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

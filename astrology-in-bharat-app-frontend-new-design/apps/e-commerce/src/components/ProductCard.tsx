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

  return (
    <div className="group bg-white rounded-[2rem] p-5 shadow-sm hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-orange-100 flex flex-col h-full hover:-translate-y-1">
      {/* Product Image */}
      <div className="mb-5 aspect-square relative bg-[#f9f9f9] rounded-[1.8rem] overflow-hidden flex items-center justify-center p-6 border border-gray-50">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-115"
          loading="lazy"
          onError={(e) =>
            (e.currentTarget.src =
              "https://cdn-icons-png.flaticon.com/512/2645/2645843.png")
          }
        />
      </div>

      {/* Product Info */}
      <div className="px-1 flex-grow">
        <h4 className="text-[1.2rem] font-bold text-theme-brown mb-2 font-pl line-clamp-1 group-hover:text-theme-orange transition-colors">
          {title}
        </h4>
        <p className="text-sm text-gray-500 mb-6 font-outfit line-clamp-2 leading-relaxed opacity-80">
          {description}
        </p>
      </div>

      {/* Pricing and Action */}
      <div className="px-1 mt-auto flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-theme-brown font-pl leading-none mb-1">
            ₹{price.toLocaleString("en-IN")}
          </span>
          {originalPrice > price && (
            <span className="text-xs text-gray-400 line-through font-outfit">
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="py-2.5 px-6 bg-theme-orange text-white text-sm font-bold rounded-xl hover:bg-theme-orange-dark transition-all shadow-md active:scale-95 font-pl shadow-[#fd6410]/20 hover:shadow-[#fd6410]/40"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

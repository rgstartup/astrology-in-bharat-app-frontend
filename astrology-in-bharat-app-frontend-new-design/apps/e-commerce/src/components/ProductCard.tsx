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
    <div className="group bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-orange-100 flex flex-col h-full">
      {/* Product Image */}
      <div className="mb-4 aspect-square relative bg-[#f8f8f8] rounded-[1.5rem] overflow-hidden flex items-center justify-center p-4">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) =>
            (e.currentTarget.src =
              "https://cdn-icons-png.flaticon.com/512/2645/2645843.png")
          }
        />
      </div>

      {/* Product Info */}
      <div className="px-1 flex-grow">
        <h4 className="text-[1.1rem] font-bold text-[#4a2c2a] mb-1 font-pl line-clamp-1">
          {title}
        </h4>
        <p className="text-xs text-gray-500 mb-4 font-outfit line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Pricing and Action */}
      <div className="px-1 mt-auto flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-theme-brown font-pl">
            ₹{price}
          </span>
          {originalPrice > price && (
            <span className="text-[10px] text-gray-400 line-through font-outfit">
              ₹{originalPrice}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="py-1.5 px-4 bg-theme-orange text-white text-xs font-bold rounded-lg hover:bg-theme-orange-dark transition-colors shadow-sm active:scale-95 font-pl shadow-[#fd6410]/20"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

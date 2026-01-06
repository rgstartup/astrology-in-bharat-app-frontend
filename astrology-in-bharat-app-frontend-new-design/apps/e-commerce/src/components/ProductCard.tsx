"use client";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
}

const ProductCard = ({
  image,
  title,
  description,
  price,
  originalPrice,
}: ProductCardProps) => {
  return (
    <div className="group relative rounded-xl bg-white border border-orange-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image Section */}
      <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 ">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-orange-100/30" />
        <Image
          src={image}
          alt={title}
          width={260}
          height={260}
          className="object-contain relative z-10 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-theme-brown mb-1 font-pl">
          {title}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{description}</p>

        {/* Price */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xl font-bold text-theme-orange">₹{price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{originalPrice}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button className="flex-1 rounded-xl bg-theme-orange text-white py-2.5 text-sm font-bold hover:bg-orange-600 transition shadow-md hover:shadow-lg">
            Add to Cart
          </button>

          <Link
            href="#"
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-orange-200 text-theme-orange hover:bg-orange-50 transition"
          >
            <i className="fa-regular fa-heart"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

"use client";
import React, { useState } from "react";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    image: "/images/product-1.webp",
    title: "Rudraksha Mala",
    description: "Natural Rudraksha 108 beads, spiritual and energetic.",
    price: 699,
    originalPrice: 999,
    category: "Malas",
  },
  {
    id: 2,
    image: "/images/product-2.webp",
    title: "Citrine Bracelet",
    description: "Shine like a crystal beads, attracts good luck.",
    price: 449,
    originalPrice: 699,
    category: "Bracelets",
  },
  {
    id: 3,
    image: "/images/product-3.jpg",
    title: "Tiger Eye Bracelet",
    description: "Promotes strength, courage and protection.",
    price: 379,
    originalPrice: 599,
    category: "Bracelets",
  },
  {
    id: 4,
    image: "/images/product-4.jpg",
    title: "Amethyst Bracelet",
    description: "Semi-precious tiger eye crystal beads.",
    price: 499,
    originalPrice: 799,
    category: "Bracelets",
  },
  {
    id: 5,
    image: "/images/product-5.jpg",
    title: "Shree Yantra",
    description: "Golden sacred geometry for prosperity and peace.",
    price: 799,
    originalPrice: 1299,
    category: "Yantras",
  },
  {
    id: 6,
    image: "/images/product-6.jpg",
    title: "Navagraha Yantra",
    description: "Balances all nine planetary energies.",
    price: 899,
    originalPrice: 1499,
    category: "Yantras",
  },
  {
    id: 7,
    image: "/images/product-1.webp",
    title: "Gemstone Ring",
    description: "Specifically curated gemstone for astrological benefits.",
    price: 1200,
    originalPrice: 1999,
    category: "Rings",
  },
  {
    id: 8,
    image: "/images/product-2.webp",
    title: "Camphor Ring",
    description: "Powerful ring made for spiritual cleansing.",
    price: 999,
    originalPrice: 1599,
    category: "Rings",
  },
];

const categories = ["All", "Bracelets", "Yantras", "Rings", "Malas"];

const ProductList = () => {
  const [activeTab, setActiveTab] = useState("All");

  const filteredProducts =
    activeTab === "All"
      ? products
      : products.filter((p) => p.category === activeTab);

  return (
    <section className="py-20 bg-theme-ivory" id="products">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 border-b border-orange-100 pb-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-theme-brown font-pl">
              Featured Products
            </h2>
          </div>
          <div className="bg-orange-50/50 text-theme-orange-dark px-6 py-3 rounded-2xl border border-orange-100 flex items-center gap-3 font-outfit text-sm font-bold shadow-sm backdrop-blur-sm">
            <i className="fa-solid fa-cloud text-xl animate-pulse text-orange-400"></i>
            <span>Free shipping on orders over ₹999</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-8 py-2.5 rounded-xl font-bold transition-all duration-300 font-pl border-2 whitespace-nowrap ${
                activeTab === cat
                  ? "bg-theme-orange text-white border-theme-orange shadow-md scale-105"
                  : "bg-white text-gray-600 border-gray-100 hover:border-theme-orange hover:text-theme-orange"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;

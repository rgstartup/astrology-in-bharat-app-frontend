import React from "react";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    image: "/images/product/product1.jpg",
    title: "Rudraksha Mala",
    description: "Energized for peace & spiritual growth",
    price: 1499,
    originalPrice: 1999,
  },
  {
    id: 2,
    image: "/images/product/product2.jpg",
    title: "Gemstone Ring",
    description: "Recommended as per kundli analysis",
    price: 2999,
    originalPrice: 3499,
  },
  {
    id: 3,
    image: "/images/product/product3.jpg",
    title: "Shree Yantra",
    description: "For wealth, success & prosperity",
    price: 1199,
    originalPrice: 1699,
  },
  {
    id: 4,
    image: "/images/product/product4.jpg",
    title: "Astrology Bracelet",
    description: "Balances planetary energies",
    price: 899,
    originalPrice: 1299,
  },
  {
    id: 5,
    image: "/images/product/product1.jpg",
    title: "Navaratna Ring",
    description: "Nine gemstones for complete protection",
    price: 3499,
    originalPrice: 4999,
  },
  {
    id: 6,
    image: "/images/product/product2.jpg",
    title: "Crystal Ball",
    description: "For meditation and clarity",
    price: 1799,
    originalPrice: 2499,
  },
  {
    id: 7,
    image: "/images/product/product3.jpg",
    title: "Rudraksha Bracelet",
    description: "For stress relief and focus",
    price: 799,
    originalPrice: 1199,
  },
  {
    id: 8,
    image: "/images/product/product4.jpg",
    title: "Ganesha Idol",
    description: "Brass idol for prosperity",
    price: 999,
    originalPrice: 1499,
  },
];

const ProductList = () => {
  return (
    <section className="py-20 bg-white" id="products">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-orange-100 text-theme-orange px-4 py-2 rounded-full text-sm font-semibold mb-4 font-outfit">
            ⭐ Bestsellers
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-pl">
            Featured Astrology{" "}
            <span className="text-theme-orange">Products</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-outfit text-lg">
            Hand-picked, energized, and certified products to bring positivity
            and success to your life
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-16">
          <a
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-theme-orange hover:bg-theme-orange-dark text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl font-pl text-lg group"
          >
            View All Products{" "}
            <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductList;

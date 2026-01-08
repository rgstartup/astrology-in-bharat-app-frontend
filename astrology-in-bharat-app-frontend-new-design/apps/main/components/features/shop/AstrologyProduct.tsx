import React from "react";
import NextImage from "next/image";
import { getProducts } from "../../../libs/api-products";

const Image = NextImage as any;

/* 🔹 Skeleton Card */
const ProductSkeleton = () => {
  return (
    <div className="col-lg-3 col-md-6 col-sm-12">
      <div className="bg-white rounded-2xl p-3 shadow-[0_10px_25px_rgba(0,0,0,0.08)] h-full animate-pulse flex flex-col">
        <div className="mb-[15px] h-[200px] w-full bg-gray-200 rounded-xl"></div>

        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>

        <div className="mt-auto">
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded-full w-full"></div>
        </div>
      </div>
    </div>
  );
};

const AstrologyProduct = async () => {
  const products = await getProducts();

  // Fallback if no products
  const productList = products || [];

  return (
    <section className="aib-products-section bg-edeef1 space-section">
      <div className="container">
        <div className="light-card">
          {/* <!-- Section Heading --> */}
          <div className="row mb-4">
            <div className="col-12">
              <h2 className="title-line mb-4 c-1e0b0f">
                <span>Astrology Products</span>
              </h2>
              <p className="aib-products-subtitle c-1e0b0f m-0">
                Energized & Expert-Recommended Astrology Products for Positive
                Life Changes
              </p>
            </div>
          </div>

          {/* <!-- Products Grid --> */}
          <div className="row g-4">
            {productList.length === 0 ? (
              /* 🔥 4 Skeleton Cards */
              Array.from({ length: 4 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            ) : (
              productList.slice(0, 4).map((product) => {
                const imageUrl = product.imageUrl ? (
                  product.imageUrl.startsWith("http") ? product.imageUrl :
                    product.imageUrl.startsWith("/") ? product.imageUrl :
                      `/uploads/${product.imageUrl}`
                ) : "";

                const originalPrice = Number(product.originalPrice) || 0;
                const price = Number(product.price) || 0;
                const percentageOff = Number(product.percentageOff) || 0;

                return (
                  <div
                    key={product.id || product._id}
                    className="col-lg-3 col-md-6 col-sm-12"
                  >
                    <div className="group relative bg-white rounded-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
                      {/* 🔥 Top Header: Offer Tag (Left) & Heart Icon (Right) */}
                      {percentageOff > 0 && (
                        <div className="absolute top-3 left-3 z-10">
                          <div className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 animate-pulse">
                            <i className="fa-solid fa-tag text-[10px]"></i>
                            {percentageOff}% OFF
                          </div>
                        </div>
                      )}

                      {/* ❤️ Wishlist Icon */}
                      <button className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm w-9 h-9 flex items-center justify-center">
                        <i className="fa-regular fa-heart text-lg"></i>
                      </button>

                      {/* 🖼️ Image Area with Glow */}
                      <div className="relative w-full aspect-square bg-[#f9f9f9] flex items-center justify-center overflow-hidden shrink-0">
                        <div className="absolute w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-60"></div>
                        <div className="relative w-full h-full">
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover transform group-hover:scale-105 transition-transform duration-500 mix-blend-normal"
                          />
                        </div>
                      </div>

                      {/* 📄 Content Area */}
                      <div className="p-3 flex flex-col gap-2 flex-grow">
                        <div>
                          <div className="flex justify-between items-start mb-0.5">
                            <h3 className="text-lg font-bold text-[#111827] line-clamp-1" title={product.name}>
                              {product.name}
                            </h3>
                            <div className="flex items-center gap-1 text-yellow-400 text-xs font-medium bg-yellow-50 px-1.5 py-0.5 rounded">
                              <i className="fa-solid fa-star text-[10px]"></i>
                              <span className="text-gray-600">4.8</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        {/* 💰 Price Section */}
                        <div className="flex items-end gap-2 mt-auto pt-2">
                          <span className="text-2xl font-bold text-[#F95E09]">₹{price}</span>
                          {originalPrice > price && (
                            <span className="text-base text-gray-400 line-through mb-1 ml-3">₹{originalPrice}</span>
                          )}
                        </div>

                        {/* 🔘 Action Buttons */}
                        <div className="grid grid-cols-5 gap-3 mt-1">
                          <button className="col-span-1 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors h-10">
                            <i className="fa-solid fa-bag-shopping"></i>
                          </button>
                          <button className="col-span-4 bg-[#F95E09] hover:bg-[#D84E06] text-white font-semibold rounded-full shadow-[0_4px_20px_-2px_rgba(249,94,9,0.3)] hover:shadow-orange-500/40 transform active:scale-95 transition-all duration-200 h-10 flex items-center justify-center gap-2 text-sm">
                            <span>Buy Now</span>
                            <i className="fa-solid fa-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* <!-- View All Button --> */}
          <div className="view-all mt-4 mb-3">
            <a href="#" className="btn-link wfc m-auto text-decoration-none">
              <i className="fa-solid fa-cart-shopping"></i> View All Products
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AstrologyProduct;

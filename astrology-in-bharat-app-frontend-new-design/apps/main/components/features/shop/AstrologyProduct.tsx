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

                return (
                  <div
                    key={product.id || product._id}
                    className="col-lg-3 col-md-6 col-sm-12"
                  >
                    <div className="bg-white rounded-2xl p-3 text-center shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition duration-300 border border-[#fd641047] hover:-translate-y-1.5 h-full flex flex-col">
                      <div className="mb-[15px] relative h-[200px] w-full overflow-hidden rounded-xl shrink-0">
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="flex flex-col flex-grow">
                        <h4 className="text-[22px] font-semibold text-[#1e0b0f] mb-1.5 line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-base text-[#1a1a1a] mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="mt-auto">
                          <div className="mb-[15px]">
                            <span className="text-lg font-bold text-[#fd6410] mr-2">
                              ₹{product.price}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-sm text-[#1e0b0f9e] line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>

                          <a
                            href="#"
                            className="inline-block py-2.5 px-6 bg-[#fd6410] text-white rounded-[25px] no-underline font-semibold hover:bg-[#e5670d] hover:text-white w-full"
                          >
                            Buy Now
                          </a>
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

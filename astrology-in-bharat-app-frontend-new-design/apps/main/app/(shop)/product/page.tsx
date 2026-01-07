import React from "react";
import NextLink from "next/link";
const Link = NextLink as any;
import NextImage from "next/image";
const Image = NextImage as any;
import { products, purpose } from "@/components/AstrologyServices/homePagaData";

const page: React.FC = () => {
  return (
    <>
      {/* Top Banner */}
      <section className="banner-part">
        <div className="overlay-hero">
          <div className="container">
            <h4 className=" text-white text-center  display-5 fw-semibold display-3">
              Our Products
            </h4>
          </div>
        </div>
      </section>

      {/* Best Sellers Product Grid */}
      <section className="store-products py-5 ">
        <div className="container">
          <h2 className="section-heading text-center mb-5 display-6 fw-semibold text-[#301118]">
            Best Sellers
          </h2>
          <div className="product-slider-container">
            <div className="row g-4">
              {products.map((product) => (
                <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
                  <div className="ser-card vert-move h-100 flex flex-col p-4 shadow-sm hover:shadow-lg transition-all rounded-4 border">
                    <div className="relative w-full h-[160px] mb-3 overflow-hidden rounded-3">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="services-img object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="text-lg font-bold text-[#301118] h-[50px] overflow-hidden line-clamp-2">
                      {product.title}
                    </h4>
                    <p className="p-sm text-muted text-sm line-clamp-2 grow">
                      {product.description}
                    </p>
                    <div className=" mt-auto pt-3 flex items-center justify-between">
                      <h5 className="mb-0 fw-bold text-[#fd6410]">
                        {product.price}
                      </h5>
                      <Link
                        href="/product/id"
                        className="btn-link text-sm font-bold flex items-center gap-1 hover:text-[#fd6410]"
                      >
                        <i className="fas fa-shopping-cart"></i> Add
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Purpose Section */}
      <section className="store-products py-20 bg-[#fff5f0] border-t border-[#fd64102b]">
        <div className="container">
          <h2 className="section-heading text-center mb-5 display-6 fw-semibold text-[#301118]">
            Shop By Purpose
          </h2>
          <div className="product-slider-container">
            <div className="row g-4">
              {purpose.map((item) => (
                <div key={item.id} className="col-lg-2 col-md-4 col-sm-6">
                  <div className="vert-move p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all border border-[#fd64101a]">
                    <div className="relative w-full aspect-square overflow-hidden rounded-full">
                      <Image
                        src={item.image}
                        alt="Purpose"
                        fill
                        className="services-img object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default page;

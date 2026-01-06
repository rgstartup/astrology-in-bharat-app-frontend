import React from "react";
import Link from "next/link";
import { products, purpose } from "@/components/AstrologyServices/homePagaData";

const page: React.FC = () => {
  return (
    <>
      {/* Top Banner */}
      <section className="banner-part">
        <div className="overlay-hero">
          <div className="container">
            <h4 className=" text-white text-center  display-5 fw-semibold display-3">
              Our Prodcuts
            </h4>
          </div>
        </div>
      </section>

      {/* Best Sellers Product Grid */}
      <section className="store-products py-5 ">
        <div className="container">
          <h2 className="section-heading text-center mb-5 display-6 fw-semibold text-center mb-5">
            Best Sellers
          </h2>
          <div className="product-slider-container">
            <div className="row ">
              {products.map((product) => (
                <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
                  <div className="ser-card vert-move">
                    <img
                      src={product.image}
                      alt="Image Not Found"
                      className="services-img w-100 mb-3"
                      style={{ height: "160px", objectFit: "cover" }}
                    />
                    <h4>{product.title}</h4>
                    <p className="p-sm text-muted">{product.description}</p>
                    <div className=" mt-auto pt-3">
                      <h5 className="mb-0 fw-bold">{product.price}</h5>
                      <button className="btn btn-primary orderNowbtn mt-3">
                        <Link href="/product/id">
                          <i className="fas fa-shopping-cart me-2"></i>
                          Add To Cart
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Purpose Section */}
      <section
        className="store-products py-50 bg-cream "
        style={{ marginBottom: "-90px", paddingBottom: "100px" }}
      >
        <div className="container">
          <h2 className="section-heading  text-center mb-5 display-6 fw-semibold  ">
            Shop By Purpose
          </h2>
          <div className="product-slider-container">
            <div className="row ">
              {purpose.map((item) => (
                <div key={item.id} className="col-lg-2 col-md-4 col-sm-6">
                  <div className=" vert-move">
                    <img
                      src={item.image}
                      alt="Image Not Found"
                      className="services-img w-100 mb-3"
                      style={{ height: "160px", objectFit: "cover" }}
                    />
                    {/* <span>{item.title}</span> */}
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

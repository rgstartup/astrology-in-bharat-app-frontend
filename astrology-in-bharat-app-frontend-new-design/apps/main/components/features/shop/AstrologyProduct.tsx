import React from "react";
import NextImage from "next/image";
const Image = NextImage as any;

const AstrologyProduct = () => {
  return (
    <section className="aib-products-section bg-edeef1  space-section">
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
            {/* <!-- Product Card --> */}
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="bg-white rounded-2xl p-3 text-center shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition duration-300 border border-[#fd641047] hover:-translate-y-1.5 h-full flex flex-col">
                <div className="mb-[15px] relative h-[200px] w-full overflow-hidden rounded-xl shrink-0">
                  <Image
                    src="/images/product/product1.jpg"
                    alt="Rudraksha Mala"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <h4 className="text-[22px] font-semibold text-[#1e0b0f] mb-1.5">
                    Rudraksha Mala
                  </h4>
                  <p className="text-base text-[#1a1a1a] mb-3">
                    Energized for peace & spiritual growth
                  </p>
                  <div className="mt-auto">
                    <div className="mb-[15px]">
                      <span className="text-lg font-bold text-[#fd6410] mr-2">
                        ₹1,499
                      </span>
                      <span className="text-sm text-[#1e0b0f9e] line-through">
                        ₹1,999
                      </span>
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

            {/* <!-- Product Card --> */}
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="bg-white rounded-2xl p-3 text-center shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition duration-300 border border-[#fd641047] hover:-translate-y-1.5 h-full flex flex-col">
                <div className="mb-[15px] relative h-[200px] w-full overflow-hidden rounded-xl shrink-0">
                  <Image
                    src="/images/product/product2.jpg"
                    alt="Gemstone Ring"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <h4 className="text-[22px] font-semibold text-[#1e0b0f] mb-1.5">
                    Gemstone Ring
                  </h4>
                  <p className="text-base text-[#1a1a1a] mb-3">
                    Recommended as per kundli analysis
                  </p>
                  <div className="mt-auto">
                    <div className="mb-[15px]">
                      <span className="text-lg font-bold text-[#fd6410] mr-2">
                        ₹2,999
                      </span>
                      <span className="text-sm text-[#1e0b0f9e] line-through">
                        ₹3,499
                      </span>
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

            {/* <!-- Product Card --> */}
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="bg-white rounded-2xl p-3 text-center shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition duration-300 border border-[#fd641047] hover:-translate-y-1.5 h-full flex flex-col">
                <div className="mb-[15px] relative h-[200px] w-full overflow-hidden rounded-xl shrink-0">
                  <Image
                    src="/images/product/product3.jpg"
                    alt="Yantra"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <h4 className="text-[22px] font-semibold text-[#1e0b0f] mb-1.5">
                    Shree Yantra
                  </h4>
                  <p className="text-base text-[#1a1a1a] mb-3">
                    For wealth, success & prosperity
                  </p>
                  <div className="mt-auto">
                    <div className="mb-[15px]">
                      <span className="text-lg font-bold text-[#fd6410] mr-2">
                        ₹1,199
                      </span>
                      <span className="text-sm text-[#1e0b0f9e] line-through">
                        ₹1,699
                      </span>
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

            {/* <!-- Product Card --> */}
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="bg-white rounded-2xl p-3 text-center shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition duration-300 border border-[#fd641047] hover:-translate-y-1.5 h-full flex flex-col">
                <div className="mb-[15px] relative h-[200px] w-full overflow-hidden rounded-xl shrink-0">
                  <Image
                    src="/images/product/product4.jpg"
                    alt="Astrology Bracelet"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <h4 className="text-[22px] font-semibold text-[#1e0b0f] mb-1.5">
                    Astrology Bracelet
                  </h4>
                  <p className="text-base text-[#1a1a1a] mb-3">
                    Balances planetary energies
                  </p>
                  <div className="mt-auto">
                    <div className="mb-[15px]">
                      <span className="text-lg font-bold text-[#fd6410] mr-2">
                        ₹899
                      </span>
                      <span className="text-sm text-[#1e0b0f9e] line-through">
                        ₹1,299
                      </span>
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
          </div>

          {/* <!-- View All Button -->  */}
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

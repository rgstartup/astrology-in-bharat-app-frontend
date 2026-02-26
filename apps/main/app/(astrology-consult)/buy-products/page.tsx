import React from "react";
import NextImage from "next/image";
const Image = NextImage as any;
import { HiOutlineSparkles as HiOs } from "react-icons/hi";
const HiOutlineSparkles = HiOs as any;
import { FaGem as FaGe, FaArrowLeft as FaAl } from "react-icons/fa";
const FaGem = FaGe as any;
const FaArrowLeft = FaAl as any;
import NextLink from "next/link";
const Link = NextLink as any;
import WhyChooseUs from "@/components/layout/main/WhyChooseUs";
import CTA from "@/components/layout/main/CTA";

const BuyProductsPage = () => {
  return (
    <div className="main-wrapper">
      {/* Hero Section */}
      <section className="banner-part light-back">
        <div className="overlay-hero">
          <div className="container">
            <div className="contant-hero">
              <div className="row align-items-center">
                <div className="col-lg-7 col-md-12">
                  <div className="hero-card shine">
                    <div className="card-z">
                      <span className="aib-trust-badge">
                        Authentic Vedic Remedies
                      </span>
                      <h1>Astro Marketplace</h1>
                      <h4 className="card-title">
                        Energize Your Life with Gems
                      </h4>
                      <p>
                        Discover a curated collection of lab-certified
                        gemstones, energized yantras, and authentic spiritual
                        products to enhance your cosmic well-being.
                      </p>
                      <ul className="list-check">
                        <li>
                          <i className="fa-solid fa-check"></i> 100% Lab
                          Certified Gemstones
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Energized Vedic
                          Yantras
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Premium
                          Rudraksha Beads
                        </li>
                        <li>
                          <i className="fa-solid fa-check"></i> Pan India
                          Delivery
                        </li>
                      </ul>
                      <button className="btn-link wfc mt-4 mb-4">
                        View Products
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-12 text-center">
                  <div className="right-illus">
                    <Image
                      src="/images/horoscope-round2.png"
                      alt="Zodiac"
                      width={500}
                      height={500}
                      className="w-[90%] mx-auto absolute z-0 left-[10%] top-0 animate-[spin_30s_linear_infinite] opacity-30"
                    />
                    <div className="relative z-10 p-5">
                      <div className="w-[180px] h-[180px] bg-white rounded-full flex items-center justify-center border-4 border-[#fd6410] shadow-2xl mx-auto">
                        <FaGem className="text-[#fd6410] text-7xl animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="space-section light-back">
        <div className="container">
          <div className="light-card border border-[#fd64102b] p-10 md:p-20 text-center shadow-2xl relative overflow-hidden max-w-4xl mx-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#fd64100d] rounded-full blur-3xl -mr-32 -mt-32"></div>

            <div className="bg-[#fd6410] w-20 h-20 rounded-full flex items-center justify-center mb-8 mx-auto shadow-xl">
              <HiOutlineSparkles className="text-white text-4xl animate-spin-slow" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-[#301118] mb-4">
              Under Cosmic Alignment
            </h2>
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-8">
              Expected Reveal: Coming Soon
            </p>

            <p className="text-gray-500 italic max-w-2xl mx-auto mb-12 leading-relaxed">
              We are sourcing the finest, ethically mined gemstones and
              authenticating ancient remedies. Our marketplace for
              high-vibration spiritual tools will be open for you very soon.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="btn-link py-4 px-12 shadow-xl inline-flex items-center gap-3 no-underline"
              >
                <FaArrowLeft size={12} /> Back to Home
              </Link>
              <button className="bg-[#301118] text-white px-12 py-4 rounded-3 text-sm font-bold hover:bg-[#4a1a25] transition-colors border-0">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <CTA />
    </div>
  );
};

export default BuyProductsPage;



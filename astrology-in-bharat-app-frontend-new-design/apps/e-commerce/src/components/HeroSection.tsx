import React from "react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 bg-theme-orange rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-purple-400 rounded-full blur-3xl animate-pulse-soft delay-75"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse-soft delay-150"></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="lg:w-7/12 w-full">
            <div className="space-y-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-orange-200">
                <i className="fa-solid fa-shield-halved text-theme-orange"></i>
                <span className="text-sm font-semibold text-gray-700 font-outfit">
                  100% Authentic & Lab Certified
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight font-pl">
                Connect with Verified{" "}
                <span className="text-theme-orange relative">
                  Astrologers
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="12"
                    viewBox="0 0 200 12"
                    fill="none"
                  >
                    <path
                      d="M2 10C60 2 140 2 198 10"
                      stroke="#fd6410"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <br />
                Online
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl font-outfit">
                Unlock the power of the cosmos with our energized and certified
                astrology products. Curated by expert astrologers for your
                well-being.
              </p>

              {/* Feature List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {[
                  "Lab Certified Gemstones",
                  "Energized by Vedic Pandits",
                  "Global Shipping Available",
                  "Expert Consultation Included",
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-check text-green-600 text-sm"></i>
                    </div>
                    <span className="text-gray-700 font-outfit font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <a
                  href="#products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-theme-orange hover:bg-theme-orange-dark text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl font-pl text-lg group"
                >
                  Shop Now
                  <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </a>
                <a
                  href="/consultation"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-full font-semibold transition-all shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-theme-orange font-pl text-lg"
                >
                  <i className="fa-solid fa-video"></i>
                  Consult Experts
                </a>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-theme-orange font-pl">
                    50K+
                  </div>
                  <p className="text-sm text-gray-600 font-outfit">
                    Happy Customers
                  </p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-theme-orange font-pl">
                    4.8★
                  </div>
                  <p className="text-sm text-gray-600 font-outfit">
                    Customer Rating
                  </p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-theme-orange font-pl">
                    100%
                  </div>
                  <p className="text-sm text-gray-600 font-outfit">Authentic</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image/Illustration */}
          <div className="lg:w-5/12 w-full flex justify-center lg:justify-end relative">
            <div className="relative">
              {/* Main Circle */}
              <div className="relative w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-orange-100 to-purple-100 rounded-full flex items-center justify-center shadow-2xl">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-white rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-8xl animate-float">💎</span>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-0 right-0 bg-white p-4 rounded-2xl shadow-xl animate-float">
                <div className="text-center">
                  <span className="text-3xl block mb-1">🕉️</span>
                  <p className="text-xs font-semibold text-gray-700 font-outfit">
                    Yantras
                  </p>
                </div>
              </div>

              <div className="absolute bottom-10 left-0 bg-white p-4 rounded-2xl shadow-xl animate-float delay-75">
                <div className="text-center">
                  <span className="text-3xl block mb-1">📿</span>
                  <p className="text-xs font-semibold text-gray-700 font-outfit">
                    Rudraksha
                  </p>
                </div>
              </div>

              <div className="absolute top-1/2 -left-8 bg-white p-4 rounded-2xl shadow-xl animate-float delay-150">
                <div className="text-center">
                  <span className="text-3xl block mb-1">💍</span>
                  <p className="text-xs font-semibold text-gray-700 font-outfit">
                    Rings
                  </p>
                </div>
              </div>

              {/* Decorative Dots */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-4 border-theme-orange rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border-4 border-purple-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 43.9999C106.667 43.9999 213.333 7.33325 320 7.33325C426.667 7.33325 533.333 43.9999 640 43.9999C746.667 43.9999 853.333 7.33325 960 7.33325C1066.67 7.33325 1173.33 43.9999 1280 43.9999C1386.67 43.9999 1440 19.9999 1440 19.9999V100H0V43.9999Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;

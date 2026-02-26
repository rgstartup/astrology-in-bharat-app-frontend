import React from "react";

const HeroSection = () => {
  return (
    <section className="banner-part light-back">
      <div className="overlay-hero">
        <div className="container">
          <div className="contant-hero">
            <div className="row align column-reverse">
              <div className="col-lg-6 col-md-12">
                <div className="hero-card shine">
                  <div className="card-z">
                    <span className="aib-trust-badge">
                      India’s Trusted Astrology Platform
                    </span>
                    <h1>Your One-Stop Astrology Store</h1>
                    {/* <h4 className="card-title ">
                      Discover Vastu & expert-recommended astrology products to
                      influence your destiny and bring positive energy!
                    </h4> */}
                    <p>
                      Discover Vastu & expert-recommended astrology products to
                      influence your destiny and bring positive energy!
                    </p>
                    {/* <ul className="list-check">
                      <li>
                        {" "}
                        <i className="fa-solid fa-check"></i> Verified &amp;
                        Experienced Astrologers
                      </li>
                      <li>
                        {" "}
                        <i className="fa-solid fa-check"></i> Instant Chat, Call
                        &amp; Video Support
                      </li>
                      <li>
                        {" "}
                        <i className="fa-solid fa-check"></i> 100% Privacy &amp;
                        Confidentiality{" "}
                      </li>
                      <li>
                        {" "}
                        <i className="fa-solid fa-check"></i> Accurate
                        Predictions &amp; Remedies
                      </li>
                      <li>
                        {" "}
                        <i className="fa-solid fa-check"></i> Trusted by
                        Thousands Across India
                      </li>
                    </ul> */}
                    {/* Hero Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 mb-8">
                      <a
                        href="#products"
                        className="btn-link wfc !mt-0 !mb-0 min-w-[160px] text-center"
                      >
                        Shop Now
                      </a>
                      <a
                        href="/products"
                        className="flex items-center justify-center gap-2 px-8 py-3 bg-white hover:bg-gray-50 text-gray-800 rounded-xl font-bold transition-all shadow-md hover:shadow-lg border border-gray-100 font-pl min-w-[200px]"
                      >
                        View All Products
                        <i className="fa-solid fa-angle-right text-theme-orange"></i>
                      </a>
                    </div>

                    {/* Search Bar (User called it Side Bar) */}
                    <div className="max-w-xl">
                      <div className="relative flex items-center bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden group focus-within:ring-2 focus-within:ring-theme-orange/20 transition-all h-14">
                        <input
                          type="text"
                          placeholder="Search for products..."
                          className="w-full h-full py-4 px-6 outline-none text-gray-700 font-outfit placeholder:text-gray-400"
                        />
                        <button className="bg-theme-orange hover:bg-theme-orange-dark text-white w-16 h-full flex items-center justify-center transition-colors">
                          <i className="fa-solid fa-magnifying-glass text-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12">
                <div className="right-illus">
                  <img
                    src="images/Astrologer-h.png"
                    alt="Astrologer"
                    className="Astrologer-img-h fa-spin"
                  />
                  <img
                    src="images/astro-products.png"
                    alt="Astrologer"
                    className="Astrologer-img relative bottom-[-23px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


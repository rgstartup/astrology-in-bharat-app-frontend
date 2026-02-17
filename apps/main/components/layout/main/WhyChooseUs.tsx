import React from "react";
import homepageData from "../../../public/data/homepage.json";

const WhyChooseUs = () => {
  // Split into left and right columns (3 each)
  const leftItems = homepageData.whyChooseUs.slice(0, 3);
  const rightItems = homepageData.whyChooseUs.slice(3, 6);

  return (
    <section className="why-section back-img">
      <div className="container">
        <h2 className="title-line mb-3 color-light">
          <span>Why Choose Astrology in Bharat</span>
        </h2>
        <p className="aib-products-subtitle  color-light m-0">
          Trusted Astrology. Accurate Guidance. Complete Privacy.
        </p>
        <div className="row align-items-center text-center">
          {/* <!-- Left column --> */}
          <div className="col-md-4">
            {leftItems.map((item) => (
              <div key={item.id} className="border border-primary/30 rounded-xl my-5 p-6 bg-[#1e0b0f6e]">
                <i className={`fa-solid ${item.icon} bg-gradient-to-r from-primary to-primary-hover text-white w-[70px] h-[70px] rounded-full text-[40px] mb-3.5 flex items-center justify-center mx-auto`} style={{ width: "80px", height: "80px", borderRadius: "100%", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", margin: "auto" }}></i>
                <div className="choose-text mt-4">
                  <h4 className="text-[22px] font-semibold text-white">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          {/* <!-- Center Image --> */}
          <div className="col-md-4 text-center">
            <div className="overflow-hidden relative">
              <img
                src="/images/horoscope-round2.png"
                className="w-[90%] mx-auto absolute z-10 left-[10%] top-0 animate-[spin_10s_linear_infinite]"
                alt="horoscope"
              />
              <img
                src="/images/astro.png"
                alt="astro"
                className="relative z-20 bottom-[22px]"
              />
            </div>
          </div>

          {/* <!-- Right column --> */}
          <div className="col-md-4">
            {rightItems.map((item) => (
              <div key={item.id} className="border border-primary/30 rounded-xl my-5 p-6 bg-[#1e0b0f6e]">
                <i className={`fa-solid ${item.icon} bg-gradient-to-r from-primary to-primary-hover text-white w-[70px] h-[70px] rounded-full text-[40px] mb-3.5 flex items-center justify-center mx-auto`} style={{ width: "80px", height: "80px", borderRadius: "100%", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", margin: "auto" }}></i>
                <div className="choose-text mt-4">
                  <h4 className="text-[22px] font-semibold text-white">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

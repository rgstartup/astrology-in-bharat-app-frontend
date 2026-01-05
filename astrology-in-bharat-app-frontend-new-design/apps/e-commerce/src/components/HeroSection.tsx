import React from "react";

const HeroSection = () => {
  return (
    <section className="banner-part light-back">
      <div className="overlay-hero">
        <div className="container">
          <div className="contant-hero">
            <div className="row align column-reverse">
              <div className="col-lg-7 col-md-12">
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
                    <a href="#" className="btn-link wfc mt-4 mb-4">
                      Shop Now
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 col-md-12">
                <div className="right-illus">
                  <img
                    src="images/Astrologer-h.png"
                    alt="Astrologer"
                    className="Astrologer-img-h fa-spin"
                  />
                  <img
                    src="images/astro-products.png"
                    alt="Astrologer"
                    className="Astrologer-img"
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

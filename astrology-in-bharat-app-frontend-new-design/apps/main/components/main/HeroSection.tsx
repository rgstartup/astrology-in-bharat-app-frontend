import React from 'react'

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
                      <h1>Connect with Verified Astrologers Online</h1>
                      <h4 className="card-title ">
                        Instant Chat, Call, or Video Consultations
                      </h4>
                      <p>
                        At Astrology in Bharat, find trusted astrologers for
                        love, career, health, or life guidance. Connect anytime
                        via chat, audio, or video and get personalized solutions
                        with full privacy.
                      </p>
                      <ul className="list-check">
                        <li>
                          {" "}
                          <i className="fa-solid fa-check"></i> Verified &amp;
                          Experienced Astrologers
                        </li>
                        <li>
                          {" "}
                          <i className="fa-solid fa-check"></i> Instant Chat,
                          Call &amp; Video Support
                        </li>
                        <li>
                          {" "}
                          <i className="fa-solid fa-check"></i> 100% Privacy
                          &amp; Confidentiality{" "}
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
                      </ul>
                      <a href="#" className="btn-link wfc mt-4 mb-4">
                        Start Consultation
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
                      src="images/Astrologer.png"
                      alt="Astrologer"
                      className="Astrologer-img"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-sm-3 col-6">
                <a href="#">
                  <div className="card-hero text-center">
                    <img
                      src="images/icon1.png"
                      alt="icon1.png"
                      className="mx-auto"
                    />
                    <h5>Live Chat Support</h5>
                    <p className="color-light">
                      Get instant answers from expert astrologers through live
                      chat sessions.
                    </p>
                  </div>
                </a>
              </div>

              <div className="col-sm-3 col-6">
                <a href="#">
                  <div className="card-hero flex flex-col items-center text-center">
                    <img src="images/icon2.png" alt="icon2.png" />
                    <h5 className="mt-2">Speak with Astrologer</h5>
                    <p className="color-light">
                      Connect via phone call for personal guidance on your life
                      questions.
                    </p>
                  </div>
                </a>
              </div>

              <div className="col-sm-3 col-6">
                <a href="#">
                  <div className="card-hero flex flex-col items-center text-center">
                    <img src="images/icon3.png" alt="icon3.png" />
                    <h5 className="mt-2">Astrology Product Store</h5>
                    <p className="color-light">
                      Shop gemstones, yantras, and spiritual items recommended
                      by experts.
                    </p>
                  </div>
                </a>
              </div>

              <div className="col-sm-3 col-6">
                <a href="#">
                  <div className="card-hero flex flex-col items-center text-center">
                    <img src="images/icon4.png" alt="icon4.png" />
                    <h5 className="mt-2">Book A Pooja</h5>
                    <p className="color-light">
                      Book religious ceremonies & rituals performed by
                      experienced priests.
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default HeroSection
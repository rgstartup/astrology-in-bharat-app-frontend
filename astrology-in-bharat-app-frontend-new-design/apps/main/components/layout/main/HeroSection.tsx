import React from "react";
import Image from "next/image";
import Link from "next/link";

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
                      At Astrology in Bharat, find trusted astrologers for love,
                      career, health, or life guidance. Connect anytime via
                      chat, audio, or video and get personalized solutions with
                      full privacy.
                    </p>
                    <ul className="list-check">
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
                    </ul>
                    <Link
                      href="/our-astrologers"
                      className="btn-link wfc mt-4 mb-4"
                    >
                      Start Consultation
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 col-md-12">
                <div className="right-illus relative h-[400px]">
                  <Image
                    src="/images/Astrologer-h.png"
                    alt="Astrologer background"
                    fill
                    className="Astrologer-img-h fa-spin object-contain opacity-30"
                  />
                  <Image
                    src="/images/Astrologer.png"
                    alt="Astrologer"
                    fill
                    className="Astrologer-img object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-sm-3 col-6">
              <Link href="/our-astrologers">
                <div className="card-hero text-center">
                  <Image
                    src="/images/icon1.png"
                    alt="Live Chat"
                    width={60}
                    height={60}
                    className="mx-auto"
                  />
                  <h5>Live Chat Support</h5>
                  <p className="color-light">
                    Get instant answers from expert astrologers through live
                    chat sessions.
                  </p>
                </div>
              </Link>
            </div>

            <div className="col-sm-3 col-6">
              <Link href="/our-astrologers">
                <div className="card-hero flex flex-col items-center text-center">
                  <Image
                    src="/images/icon2.png"
                    alt="Speak"
                    width={60}
                    height={60}
                  />
                  <h5 className="mt-2">Speak with Astrologer</h5>
                  <p className="color-light">
                    Connect via phone call for personal guidance on your life
                    questions.
                  </p>
                </div>
              </Link>
            </div>

            <div className="col-sm-3 col-6">
              <Link href="/buy-products">
                <div className="card-hero flex flex-col items-center text-center">
                  <Image
                    src="/images/icon3.png"
                    alt="Store"
                    width={60}
                    height={60}
                  />
                  <h5 className="mt-2">Astrology Product Store</h5>
                  <p className="color-light">
                    Shop gemstones, yantras, and spiritual items recommended by
                    experts.
                  </p>
                </div>
              </Link>
            </div>

            <div className="col-sm-3 col-6">
              <Link href="/online-puja">
                <div className="card-hero flex flex-col items-center text-center">
                  <Image
                    src="/images/icon4.png"
                    alt="Pooja"
                    width={60}
                    height={60}
                  />
                  <h5 className="mt-2">Book A Pooja</h5>
                  <p className="color-light">
                    Book religious ceremonies & rituals performed by experienced
                    priests.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

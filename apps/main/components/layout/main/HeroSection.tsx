import React from "react";
import Image from "next/image";
import Link from "next/link";
import Featured4Cards from "@/components/ui/common/Featured4Cards";

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

          <Featured4Cards />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;



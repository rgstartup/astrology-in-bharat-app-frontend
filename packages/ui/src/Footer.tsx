"use client";
import React from "react";

const Footer: React.FC = () => {
  return (
    <>
      {/* Newsletter Section */}
      <div className="newsletter py-4">
        <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div>
            <h4 className="fw-bold mb-1">JOIN OUR NEWSLETTER</h4>
            <p className="mb-0 small">
              Subscribe for Any News Updates from IIAG
            </p>
          </div>
          <form className="newsletter-form mt-3 mt-lg-0 d-flex">
            <input
              type="email"
              className="form-control rounded-pill me-2"
              placeholder="Enter your email"
            />
            <button className="btn btn-dark rounded-pill px-4">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <footer className="footer-section">
        {/* Footer Content */}
        <div className="footer-main py-5">
          <div className="container">
            <div className="row">
              {/* About */}
              <div className="col-lg-4 col-md-6 mb-4">
                <img
                  src="/images/logo2.png"
                  alt="Logo Not Found"
                  className="mb-2 footer-logo"
                />
                <p className="small">
                  At Astrology in Bharat, find trusted astrologers for love,
                  career, health, or life guidance. Connect anytime via chat,
                  audio, or video and get personalized solutions with full
                  privacy.
                </p>
                <div className="social-icons mt-3">
                  <a href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-instagram"></i>
                  </a>

                  <a href="#">
                    <i className="fab fa-whatsapp"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>

                  <a href="#" className="subscribe-btn ">
                    SUBSCRIBE
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="col-lg-2 col-md-6 mb-4">
                <h6 className="fw-bold border-bottom pb-2">Quick Links</h6>
                <ul className="list-unstyled small">
                  <li>
                    <a href="#">Home</a>
                  </li>
                  <li>
                    <a href="#">Courses</a>
                  </li>
                  <li>
                    <a href="#">Consultation</a>
                  </li>
                  <li>
                    <a href="#">Astro Store</a>
                  </li>
                  <li>
                    <a href="#">Contact us</a>
                  </li>
                  <li>
                    <a href="#">Blog</a>
                  </li>
                </ul>
              </div>

              {/* Information */}
              <div className="col-lg-2 col-md-6 mb-4">
                <h6 className="fw-bold border-bottom pb-2">Information</h6>
                <ul className="list-unstyled small">
                  <li>
                    <a href="#">Astrology</a>
                  </li>
                  <li>
                    <a href="#">Vastu Shastra</a>
                  </li>
                  <li>
                    <a href="#">NG Software</a>
                  </li>
                  <li>
                    <a href="#">About us</a>
                  </li>
                  <li>
                    <a href="#">Refund Policy</a>
                  </li>
                  <li>
                    <a href="#">Return Policy</a>
                  </li>
                  <li>
                    <a href="#">Shipping Policy</a>
                  </li>
                </ul>
              </div>

              {/* Courses */}
              <div className="col-lg-2 col-md-6 mb-4">
                <h6 className="fw-bold border-bottom pb-2">Courses</h6>
                <ul className="list-unstyled small">
                  <li>
                    <a href="#">Bhartiya Jyotish</a>
                  </li>
                  <li>
                    <a href="#">KP Astrology</a>
                  </li>
                  <li>
                    <a href="#">Advance KP</a>
                  </li>
                  <li>
                    <a href="#">Vastu Shastra</a>
                  </li>
                  <li>
                    <a href="#">Astro-Vastu</a>
                  </li>
                </ul>
              </div>

              {/* Featured Products */}
              <div className="col-lg-2 col-md-6 mb-4">
                <h6 className="fw-bold border-bottom pb-2">
                  Featured Products
                </h6>
                <ul className="list-unstyled small">
                  <li>
                    <a href="#">Blue Sapphire (Neelam Stone)</a>
                  </li>
                  <li>
                    <a href="#">Five Mukhi Rudraksha</a>
                  </li>
                  <li>
                    <a href="#">Nakshatra Gold Software</a>
                  </li>
                  <li>
                    <a href="#">Shakti Chakra (Vastu Mapping Tool)</a>
                  </li>
                  <li>
                    <a href="#">Tulsi Mala</a>
                  </li>
                  <li>
                    <a href="#">Vastu Deep Mala Book</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom py-3 border-top">
          <div className="container d-flex flex-column flex-md-row justify-content-between small">
            <div>
              Copyright © {new Date().getFullYear()}-
              {new Date().getFullYear() + 1} Astrology In Bharat. All rights
              reserved.
            </div>
            <div>
              <a href="#" className="text-white">
                Privacy Policy
              </a>{" "}
              &nbsp;|&nbsp;
              <a href="#" className="text-white">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

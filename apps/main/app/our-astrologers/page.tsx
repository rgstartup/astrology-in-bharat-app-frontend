"use client"
import React from "react";
import Link from "next/link";
import { ListOfAllAstrologers } from "@/data/homePagaData";

const page = () => {
  return (
    <section className="astrologer-list">
      <div className="container">
        <div className="text-center mb-40">
          <h2 className="title-primary color-secondary">
            Find Your Astrologer
          </h2>
          <p className="p-md mt-2">
            Connect with the best Vedic experts for instant guidance.
          </p>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search Astrologer, Type, Language..."
          />
          <button>Search</button>
        </div>

        {/* <!-- Astrologer Card 1 --> */}
        <div className="astro-grid">
          {ListOfAllAstrologers.map((item) => {
            const modalId = `astro-video-${item.id}`;
            const modalLabelId = `astro-video-label-${item.id}`;
            return (
              <Link
                href="/astrologer-details"
                className="grid-item"
                key={item.id}
              >
                <div className="astro-card">
                  <div className="vid-part">
                    <img
                      src={item.image}
                      alt="Pandit Sharma"
                      className="astro-profile-img"
                    />
                    <span
                      className="play-vid fa-beat"
                      data-bs-toggle="modal"
                      data-bs-target={`#${modalId}`}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent link navigation when clicking play
                        e.stopPropagation();
                      }}
                    >
                      <i className="fa-solid fa-circle-play"></i>
                    </span>
                  </div>
                  <div className="rating-star">★★★★★</div>
                  <div className="astro-name">{item.name}</div>
                  <div className="astro-tags">{item.expertise}</div>
                  <div className="astro-info">
                    <strong>Exp:</strong> {item.experience} Years
                  </div>
                  <div className="astro-info">
                    <strong>Lang:</strong> {item.language}
                  </div>
                  <div className="astro-info">
                    <strong>Price:</strong> ₹{item.price}/min
                  </div>
                  <div className="astro-actions">
                    <button>
                      <i className="fa-regular fa-comment-dots"></i> Chat
                    </button>
                    <button className="call">
                      <i className="fa-solid fa-phone-volume"></i> Call
                    </button>
                    <button className="video-call">
                      <i className="fa-solid fa-video"></i> Video
                    </button>
                  </div>
                </div>

                {/* Modal per astrologer */}
                <div
                  className="modal fade"
                  id={modalId}
                  tabIndex={-1}
                  aria-labelledby={modalLabelId}
                  aria-hidden="true"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h4
                          className="modal-title-astro-about"
                          id={modalLabelId}
                        >
                          Meet Astrologer {item.name} Introduction Video
                        </h4>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <iframe
                          width="100%"
                          height="500"
                          src={item.video}
                          title={item.name}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="view-all">
          <button className="btn-link wfc m-auto w-20">
            Load More Astrologers
          </button>
        </div>
      </div>

      {/* New Section: Why Choose Us */}
      <div className="new-section-wrapper mt-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="title-secondary color-primary">
                Why Choose Our Astrologers?
              </h2>
              <ul className="list-check text-dark">
                <li className="text-dark">
                  <i className="fa-solid fa-check"></i> 100% Verified &
                  Experienced Experts
                </li>
                <li className="text-dark">
                  <i className="fa-solid fa-check"></i> Private & Confidential
                  Consultations
                </li>
                <li className="text-dark">
                  <i className="fa-solid fa-check"></i> Available 24/7 for
                  Instant Support
                </li>
                <li className="text-dark">
                  <i className="fa-solid fa-check"></i> Accurate Predictions &
                  Remedies
                </li>
              </ul>
            </div>
            <div className="col-lg-6 text-center">
              <img
                src="/images/horoscope-bg.png"
                style={{ maxWidth: "80%" }}
                alt="Why Choose Us"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;

import React from "react";
import Link from "next/link";
import { ListOfAllAstrologers } from "@/data/homePagaData";

const page = () => {
  return (
    <section className="astrologer-list">
      <div className="container">
        <h2>Find Your Astrologer</h2>

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
                  </div>
                </div>

                {/* Modal per astrologer */}
                <div
                  className="modal fade"
                  id={modalId}
                  tabIndex={-1}
                  aria-labelledby={modalLabelId}
                  aria-hidden="true"
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
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
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
          <a href="#" className="btn-link wfc m-auto w-20">
            View All Astrologers
          </a>
        </div>
      </div>
    </section>
  );
};

export default page;

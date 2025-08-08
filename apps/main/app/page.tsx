import React from "react";
import {
  featuredCardsHeroSection,
  ListOfAllAstrologers,
  ZodiacSignsData,
  AstrologyServicesData,
} from "@/data/homePagaData";

const Page: React.FC = () => {
  return (
    <>
      <section className="banner-part ">
        <div className="overlay-hero">
          <div className="container">
            <div className="row align">
              <div className="col-lg-7 col-md-12">
                <h1>
                  Connect with
                  <span style={{ color: "#daa23e" }}>
                    Verified <br /> Astrologers{" "}
                  </span>
                  Online
                </h1>
                <h4 className="card-title mt-4 mb-4">
                  Instant Chat, Call, or Video Consultations
                </h4>
                <p>
                  At Astrology in Bharat, find trusted astrologers for love,
                  career, health, or life guidance. Connect anytime via chat,
                  audio, or video and get personalized solutions with full
                  privacy.
                </p>
                <ul className="list-check">
                  <li>
                    <i className="fa-solid fa-check"></i> Verified & Experienced
                    Astrologers
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> Instant Chat, Call &
                    Video Support
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> 100% Privacy &
                    Confidentiality
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> Accurate Predictions &
                    Remedies
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> Trusted by Thousands
                    Across India
                  </li>
                </ul>
                <a href="#" className="btn-link wfc mt-4 mb-4">
                  Start Consultation
                </a>
              </div>
              <div className="col-lg-5 col-md-12">
                <div className="right-hero">
                  <img
                    src="images/Astrologer.png"
                    alt="Astrologer"
                    className="Astrologer-img"
                  />
                </div>
              </div>
            </div>

            <div className="row mt-4">
              {featuredCardsHeroSection.map((card) => (
                <div key={card.id} className="col-sm-3 col-6">
                  <a href={card.link}>
                    <div className="card-hero">
                      <img src={card.image} alt={card.altText} />
                      <h5>{card.title}</h5>
                      <p>{card.description}</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
              return (
                <div className="grid-item" key={item.id}>
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
                        data-bs-target="#exampleModal"
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

                  {/* <!-- Modal --> */}
                  <div
                    className="modal fade"
                    id="exampleModal"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h4
                            className="modal-title-astro-about"
                            id="exampleModalLabel"
                          >
                            Meet Astrologer Parbhata Giri Introduction Video
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
                            title="शिव जी ने माता पार्वती को क्यों दिया ये भयंकर श्राप 😱😱 ?  #shivshankar #mataparvati"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="view-all">
            <a href="#" className="btn-link wfc m-auto">
              View All Astrologers
            </a>
          </div>
        </div>
      </section>

      {/* <!-- Horoscopes-section --> */}
      <section className="horoscopes-container">
        <div className="container">
          <div className="row">
            <h2 className="text-center mt-3 mb-2 horoscopes-heading">
              Choose Your Zodiac Sign
            </h2>
            <p className="text-center horoscopes-heading">
              Discover Your Daily, Monthly and Yearly Horoscope
            </p>

            {ZodiacSignsData.map((item) => {
              return (
                <div className="col-lg-2 col-sm-6 col-md-4 col-6" key={item.id}>
                  <a href="#">
                    <div className="horoscopes-items">
                      <img src={item.image} alt="Image Not Found" />
                      <h3>{item.title}</h3>
                      <p>{item.date}</p>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="astrology-services py-5">
        <div className="container">
          <h2>Astrology Services</h2>
          <div className="row">
            {AstrologyServicesData.map((item) => {
              return (
                <div className="col-lg-3 col-md-6" key={item.id}>
                  <div className="ser-card">
                    <img
                      src={item.image}
                      alt="Kundli"
                      className="services-img"
                    />
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;

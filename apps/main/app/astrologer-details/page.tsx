import React from "react";
import Link from "next/link";
import { products } from "@/data/homePagaData";

const page = () => {
  return (
    <>
      {/* ================= ASTRO PROFILE ================= */}
      <div className="container mt-40">
        <div className="row astro-profile-main-card align-items-start">
          {/* LEFT */}
          <div className="col-lg-6 col-md-12 p-2 astro-profile-right-border">
            <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start text-center text-md-start">
              <div className="position-relative me-md-4 mb-3 mb-md-0">
                <img
                  src="/images/astro-img1.png"
                  alt="Amita Sharma"
                  className="img-circle-md"
                />

                <span
                  className="play-btn-overlay fa-beat"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  <i className="fa-solid fa-circle-play"></i>
                </span>

                <div className="star-rating-lg">★★★★★</div>
              </div>

              <div>
                <h4 className="astro-name-lg">Amita Sharma</h4>

                <div className="mb-1">
                  <span className="astro-meta-label">Lang.</span> Hindi, English
                </div>

                <div className="astro-tags-pill">Vedic, Numero, Vastu</div>

                <div className="mb-1">
                  <span className="astro-meta-label">Exp.</span> 4 years
                </div>

                <div>
                  <span className="astro-meta-label">Call.</span> ₹50.00/min
                </div>
              </div>
            </div>

            <div className="astro-actions-grid">
              <button className="btn-astro-action btn-purple">
                <i className="fa-solid fa-phone-volume"></i> Call
              </button>
              <button className="btn-astro-action btn-gold">
                <i className="fa-solid fa-video"></i> Video
              </button>
              <button className="btn-astro-action btn-blue">
                <i className="fa-solid fa-comment"></i> Chat
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-lg-6 col-md-12 profile-content custom-scroll mt-4 mt-lg-0">
            <h4 className="profile-section-title">Profile</h4>

            <div className="mb-3">
              <button className="profile-tab-btn tab-btn-purple">About</button>
              <button className="profile-tab-btn tab-btn-gold">Experience</button>
            </div>

            <p className="profile-desc-text">
              Acharya Amita Sharma, born and brought up in the holy city of
              Varanasi (U.P.) had her education at Banaras Hindu University (BHU).
              She received astrological grooming under legendary mentors and
              currently practices professionally in Noida.
            </p>

            <p className="profile-desc-text">
              She specializes in Vedic Astrology, Bhrigu Nandi Nadi (BNN), Vedic
              Vastu, Numerology & Crystal Healing with proven results.
            </p>

            <div className="mt-3 d-flex gap-2 flex-wrap">
              <button className="orderNowbtn">Notify Me</button>
              <button className="orderNowbtn bg-secondary">Message</button>
            </div>

            <p className="p-xxs color-muted mt-2">
              * Email alert when astrologer comes online!
            </p>
          </div>
        </div>
      </div>

      {/* ================= BIRTH DETAILS & TESTIMONIAL ================= */}
      <div className="container my-5">
        <div className="row">
          {/* FORM */}
          <div className="col-lg-6">
            <div className="ser-card h-100 p-20">
              <h4 className="title-secondary color-secondary mb-20">
                Please share your birth details
              </h4>

              <form>
                <div className="row g-3">
                  {[
                    "Name",
                    "Email",
                    "Mobile",
                    "Date Of Birth",
                    "Birth Time",
                    "Birth Place",
                  ].map((label, i) => (
                    <div key={i} className="col-md-6">
                      <label className="p-sm fw-semibold">{label}</label>
                      <input className="form-control" required />
                    </div>
                  ))}
                </div>

                <div className="text-end mt-20">
                  <button className="orderNowbtn px-4">Submit</button>
                </div>
              </form>
            </div>
          </div>

          {/* TESTIMONIAL */}
          <div className="col-lg-6">
            <div className="ser-card h-100 p-20">
              <h4 className="text-center title-secondary color-secondary">
                Client Success Stories
              </h4>

              <p className="text-center p-sm">
                Transformative experiences from our community
              </p>

              {[1, 2].map((_, i) => (
                <div key={i} className="testimonial-card p-20 mt-20 shadow">
                  <div className="d-flex align-items-center mb-10">
                    <img
                      src="/images/astro-img1.png"
                      className="img-circle-sm me-3"
                    />
                    <div>
                      <h6 className="fw-bold mb-0">Alexandra Thompson</h6>
                      <small className="color-muted">
                        Life Coach | New York
                      </small>
                    </div>
                    <div className="ms-auto color-primary">★★★★★</div>
                  </div>

                  <p className="p-sm">
                    The consultation was incredibly accurate and deeply
                    insightful. Highly recommended!
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      <section className="store-products py-50">
        <div className="container">
          <h2 className="title-secondary text-center mb-40">
            Best <span className="color-secondary">Sellers</span>
          </h2>

          <div className="row">
            {products.map((product) => (
              <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
                <div className="ser-card vert-move">
                  <img
                    src={product.image}
                    className="services-img w-100 mb-10"
                  />
                  <h4>{product.title}</h4>
                  <p className="p-sm">{product.description}</p>
                  <h5 className="fw-bold mt-10">{product.price}</h5>

                  <button className="orderNowbtn mt-10">
                    <Link href="/product/id">
                      <i className="fas fa-shopping-cart me-2"></i>
                      Add To Cart
                    </Link>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= VIDEO TESTIMONIAL ================= */}
      <section className="testimonial-part">
        <div className="container py-50">
          <h3 className="text-center fw-bold">
            <span className="color-secondary">More Videos</span>
          </h3>

          <p className="text-center p-md">
            Real stories of transformation from our clients
          </p>

          <div className="row mt-30">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="col-lg-4 col-md-6 mb-4">
                <div className="card shadow">
                  <iframe
                    width="100%"
                    height="260"
                    src="https://www.youtube.com/embed/INoPh_oRooU"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default page;

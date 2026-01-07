"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { products } from "@/components/features/services/homePagaData";
import { useRouter } from "next/navigation";
import ReviewModal from "@/components/ui/modals/ReviewModal";
import NextImage from "next/image";

const Image = NextImage as any;
const NextLink = Link as any;

interface AstrologerData {
  id: string | number;
  name: string;
  image: string;
  expertise: string;
  experience: number;
  language: string;
  price: number;
  video: string;
  ratings: number;
}

export default function AstrologerDetailsClient({
  astrologer,
}: {
  astrologer: AstrologerData;
}) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const router = useRouter();

  const handleChatClick = () => {
    router.push("/user-detail-form");
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row profile-card align-items-start">
          <div className="col-lg-6 col-md-12 p-2">
            <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start text-center text-md-start">
              <div className="position-relative me-md-3 mb-3 mb-md-0 text-center">
                <div
                  className="rounded-circle overflow-hidden shadow-sm border border-gold"
                  style={{ width: "150px", height: "150px" }}
                >
                  <Image
                    src={astrologer.image}
                    alt={astrologer.name}
                    width={150}
                    height={150}
                    className="object-cover"
                  />
                </div>

                <span
                  className="fa-beat d-flex align-items-center justify-content-center"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  style={{
                    position: "absolute",
                    bottom: "30px",
                    left: "70%",
                    backgroundColor: "#DAA23E",
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    color: "#fff",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                >
                  <i className="fa-solid fa-circle-play"></i>
                </span>

                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "18px",
                    color: "#DAA23E",
                    letterSpacing: "3px",
                  }}
                >
                  {"★".repeat(astrologer.ratings)}
                </div>
              </div>

              <div>
                <h5 className="fw-bold text-black">{astrologer.name}</h5>
                <div className="mb-1 text-black">
                  <strong>Lang.</strong> {astrologer.language}
                </div>
                <div className="mb-1 astro-tags">{astrologer.expertise}</div>
                <div className="mb-1 text-black">
                  <strong>Exp.</strong> {astrologer.experience} years
                </div>
                <div className="text-black">
                  <strong>Call.</strong> ₹{astrologer.price.toFixed(2)}/min
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-center justify-content-md-start mt-4 gap-2">
              <button
                className="astro-call d-flex align-items-center gap-1"
                onClick={handleChatClick}
              >
                <i className="fa-solid fa-phone-volume"></i> Call
              </button>
              <button
                className="astro-videocall d-flex align-items-center gap-1"
                onClick={handleChatClick}
              >
                <i className="fa-solid fa-video"></i> Video Call
              </button>
              <button
                className="astro-chat d-flex align-items-center gap-1"
                onClick={handleChatClick}
              >
                <i className="fa-solid fa-comment"></i> Chat
              </button>
            </div>
          </div>

          <div className="col-lg-6 col-md-12 profile-content custom-scroll mt-4 mt-lg-0">
            <h4 className="fw-bold">Profile</h4>
            <ul className="nav-links mt-4 mb-3 d-flex gap-3 flex-wrap">
              <li className="nav-item">
                <a href="#" className="about">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="experience">
                  Experience
                </a>
              </li>
            </ul>
            <p>
              Acharya {astrologer.name}, professional Astrologer with rich
              experience in Vedic Astrology / Bhrigu Nandi Nadi (BNN) / Vedic
              Vastu / Vedic Numerology & Crystal Healing.
            </p>

            <div className="mt-3 d-flex flex-wrap gap-2">
              <button className="btn custom-btn-primary">Notify Me</button>
              <button className="btn custom-btn-secondary">Message</button>
            </div>
            <p className="small text-muted mt-2">
              * Email alert when astrologer comes online!
            </p>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row">
          <div className="col-lg-6">
            <div className="leftcard border-0 h-100">
              <div className="card-body p-4">
                <h4 className="mb-4">
                  <strong style={{ color: "#732882" }}>
                    Please share your birth details:-
                  </strong>
                </h4>
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Your Name"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Mobile <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Mobile"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Date Of Birth <span className="text-danger">*</span>
                      </label>
                      <input type="date" className="form-control" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Birth Time <span className="text-danger">*</span>
                      </label>
                      <input type="time" className="form-control" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Birth Place <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Birth Place"
                        required
                      />
                    </div>
                  </div>
                  <div className="text-end mt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 text-white submit-button"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="rightcard border-0 h-100">
              <div className="rightcard-body p-4">
                <h4 className="text-center">
                  <strong style={{ color: "#732882" }}>
                    Client Success Stories
                  </strong>
                </h4>
                <p className="text-center">
                  Transformative experiences from our valued community
                </p>
                <div className="testimonial-card p-4 shadow-sm mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="rounded-circle me-3 overflow-hidden"
                      style={{ width: "50px", height: "50px" }}
                    >
                      <Image
                        src="/images/astro-img1.png"
                        alt="Alexandra"
                        width={50}
                        height={50}
                      />
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">Alexandra Thompson</h6>
                      <small className="text-muted">
                        Life Coach | New York
                      </small>
                    </div>
                    <div className="ms-auto text-warning">★★★★★</div>
                  </div>
                  <p className="mb-0">
                    {
                      "The birth chart reading was incredibly detailed and accurate."
                    }
                  </p>
                </div>
                <button
                  className="story-btn mt-4"
                  onClick={() => setIsReviewModalOpen(true)}
                >
                  <i className="fa-solid fa-share"></i>
                  <span>Share Your Story</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={() => setIsReviewModalOpen(false)}
      />

      <section className="store-products py-5">
        <div className="container">
          <h2 className="section-heading display-6 fw-semibold text-center mb-5">
            Best <span style={{ color: "#732882" }}>Sellers</span>
          </h2>
          <div className="row">
            {products.map((product) => (
              <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div className="ser-card vert-move h-100">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={300}
                    height={160}
                    className="w-100 object-cover mb-3"
                    style={{ height: "160px" }}
                  />
                  <h4>{product.title}</h4>
                  <p className="p-sm text-muted">{product.description}</p>
                  <div className="mt-auto pt-3">
                    <h5 className="mb-0 fw-bold">{product.price}</h5>
                    <button className="btn btn-primary orderNowbtn mt-3">
                      <NextLink href="/product/id">
                        <i className="fas fa-shopping-cart me-2"></i>Add To Cart
                      </NextLink>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="modal fade" id="exampleModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title-astro-about">
                Meet Astrologer {astrologer.name} Video
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <iframe
                width="100%"
                height="500"
                src={astrologer.video}
                title="Intro Video"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

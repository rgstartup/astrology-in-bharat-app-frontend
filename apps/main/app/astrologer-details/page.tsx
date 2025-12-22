"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { products } from "@/data/homePagaData";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ReviewModal from "@/components/ReviewModal";

interface AstrologerData {
  name: string;
  image: string;
  expertise: string;
  experience: number;
  language: string;
  price: number;
  video: string;
  ratings: number;
}

const Page = () => {
  const searchParams = useSearchParams();
  const [astrologer, setAstrologer] = useState<AstrologerData>({
    name: "Amita Sharma",
    image: "/images/astro-img1.png",
    expertise: "Vedic, Numero, Vastu",
    experience: 4,
    language: "Hindi, English",
    price: 50,
    video: "",
    ratings: 5,
  });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    // Read query parameters
    const name = searchParams.get('name');
    const image = searchParams.get('image');
    const expertise = searchParams.get('expertise');
    const experience = searchParams.get('experience');
    const language = searchParams.get('language');
    const price = searchParams.get('price');
    const video = searchParams.get('video');
    const ratings = searchParams.get('ratings');

    // Update state if parameters exist
    if (name) {
      setAstrologer({
        name: name || "Amita Sharma",
        image: image || "/images/astro-img1.png",
        expertise: expertise || "Vedic, Numero, Vastu",
        experience: Number(experience) || 4,
        language: language || "Hindi, English",
        price: Number(price) || 50,
        video: video || "",
        ratings: Number(ratings) || 5,
      });
    }
  }, [searchParams]);

  const router = useRouter();

  const handleChatClick = () => {
    router.push('/user-detail-form');
  }

  // Generate star rating
  const renderStars = (rating: number) => {
    return "★".repeat(Math.floor(rating));
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row profile-card align-items-start">
          <div className="col-lg-6 col-md-12 p-2">
            <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start text-center text-md-start">
              <div className="position-relative me-md-3 mb-3 mb-md-0 text-center">
                {/* Image */}
                <img
                  src={astrologer.image}
                  alt={astrologer.name}
                  className="rounded-circle"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    border: "3px solid rgba(218, 162, 62, 0.45)",
                  }}
                />

                {/* Play Button */}
                <span
                  className="fa-beat d-flex align-items-center justify-content-center"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  style={{
                    position: "absolute",
                    bottom: "30px", // slightly above image edge
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

                {/* Stars */}
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "18px",
                    color: "#DAA23E",
                    letterSpacing: "3px",
                  }}
                >
                  ★★★★★
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
              <button className="astro-call d-flex align-items-center gap-1" onClick={handleChatClick}>
                <i className="fa-solid fa-phone-volume"></i> Call
              </button>
              <button className="astro-videocall d-flex align-items-center gap-1" onClick={handleChatClick}>
                <i className="fa-solid fa-video"></i> Video Call
              </button>
              <button className="astro-chat d-flex align-items-center gap-1" onClick={handleChatClick}>
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
              Acharya Amita Sharma, born and brought up in the holy city of
              Varanasi (U.P.) had her education at Banaras Hindu University
              (BHU). She got Astrological grooming in the company of the legends
              in Varanasi. Currently in Noida working as a professional
              Astrologer with rich experience in Vedic Astrology / Bhrigu Nandi
              Nadi (BNN) / Vedic Vastu / Vedic Numerology & Crystal Healing.
            </p>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              ornare elit sed feugiat malesuada.
            </p>
            <p>
              Integer accumsan turpis a gravida pulvinar. Suspendisse luctus ex
              at mauris tincidunt fermentum.
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
                        className="form-control form-inputs"
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
                      <input type="time" className="form-control form-inputs" required />
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

                    <div className="col-md-6">
                      <label className="form-label" htmlFor="gender">
                        Gender
                      </label>
                      <select className="form-select" id="gender" required defaultValue="">
                        <option value="" disabled hidden>
                          Select
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="invalid-feedback">Please select a gender.</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Marital Status</label>
                      <select className="form-select">
                        <option value="" disabled hidden>
                          Select
                        </option>
                        <option>Single</option>
                        <option>Married</option>
                        <option>Divorced</option>
                        <option>Widowed</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Occupation</label>
                      <select className="form-select form-inputs">
                        <option value="" disabled hidden>
                          Select
                        </option>
                        <option>Student</option>
                        <option>Working Professional</option>
                        <option>Business</option>
                        <option>Other</option>
                      </select>
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

                <div className="testimonial-card p-4 shadow-sm">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src="/images/astro-img1.png"
                      alt="Alexandra Thompson"
                      className="rounded-circle me-3"
                      width="50"
                      height="50"
                    />
                    <div>
                      <h6 className="mb-0 fw-bold">Alexandra Thompson</h6>
                      <small className="text-muted">
                        Life Coach | New York
                      </small>
                    </div>
                    <div className="ms-auto text-warning">★★★★★</div>
                  </div>
                  <p className="mb-0">
                    {"The birth chart reading was incredibly detailed and accurate. It helped me understand my life path and make important career decisions."}
                  </p>
                </div>

                <div className="testimonial-card p-4 mt-4 shadow-sm">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src="/images/astro-img1.png"
                      alt="Max Thump"
                      className="rounded-circle me-3"
                      width="50"
                      height="50"
                    />
                    <div>
                      <h6 className="mb-0 fw-bold">Max Thump</h6>
                      <small className="text-muted">
                        Life Coach | New York
                      </small>
                    </div>
                    <div className="ms-auto text-warning">★★★★★</div>
                  </div>
                  <p className="mb-0">
                    {"The planetary transit analysis provided invaluable timing for my business decisions. The accuracy of predictions and professional guidance has been truly remarkable."}</p>
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
        onSubmit={(data) => {
          console.log("Review Submitted:", data);
          // Here you would typically send the data to your backend
          setIsReviewModalOpen(false);
        }}
      />

      <section className="store-products py-5 ">
        <div className="container">
          <h2 className="section-heading  display-6 fw-semibold text-center mb-5">
            Best <span style={{ color: "#732882" }}>Sellers</span>
          </h2>
          <div className="product-slider-container">
            <div className="row ">
              {products.map((product) => (
                <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
                  <div className="ser-card vert-move">
                    <img
                      src={product.image}
                      alt="Image Not Found"
                      className="services-img w-100 mb-3"
                      style={{ height: "160px", objectFit: "cover" }}
                    />
                    <h4>{product.title}</h4>
                    <p className="p-sm text-muted">{product.description}</p>
                    <div className=" mt-auto pt-3">
                      <h5 className="mb-0 fw-bold">{product.price}</h5>
                      <button className="btn btn-primary orderNowbtn mt-3">
                        <Link href="/product/id">
                          <i className="fas fa-shopping-cart me-2"></i>
                          Add To Cart
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="testimonial-part">
        <div className="container py-5">
          <div className="row">
            <img src="/images/medal.svg" alt="" height="70px" width="70px" />
            <h3 className="text-center">
              <span style={{ color: "rgb(115, 40, 130)" }}>More Videos</span>
            </h3>
            <p
              className="text-center"
              style={{ fontSize: " 18px", color: "rgb(0, 0, 0)" }}
            >
              Lets see what our customers say about us: <br />
              Real stories of how our astrology and Vastu services have made a
              positive difference in their lives.
            </p>

            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card h-80">
                <div className="card-header text-dark d-flex align-items-center gap-3">
                  <div className="video-box text-center">
                    <div className="video-container">
                      <iframe
                        width="100%"
                        height="315"
                        src="https://www.youtube.com/embed/INoPh_oRooU?si=YQTkhY3KRdwTXqbq"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        style={{ borderRadius: "15px" }}
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card h-80">
                <div className="card-header text-dark d-flex align-items-center gap-3">
                  <div className="video-box text-center">
                    <div className="video-container">
                      <iframe
                        width="100%"
                        height="315"
                        src="https://www.youtube.com/embed/INoPh_oRooU?si=YQTkhY3KRdwTXqbq"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        style={{ borderRadius: "15px" }}
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card h-80">
                <div className="card-header text-dark d-flex align-items-center gap-3">
                  <div className="video-box text-center">
                    <div className="video-container">
                      <iframe
                        width="100%"
                        height="315"
                        src="https://www.youtube.com/embed/INoPh_oRooU?si=YQTkhY3KRdwTXqbq"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        style={{ borderRadius: "15px" }}
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;


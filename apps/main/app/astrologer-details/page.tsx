import React from "react";

const page = () => {
  return (
    <>
      <div className="container mt-5">
        <div className="row profile-card align-items-start">
          <div className="col-lg-6 col-md-12 p-2">
            <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start text-center text-md-start">
              <div className="position-relative me-md-3 mb-3 mb-md-0">
                <img
                  src="/images/astro-img1.png"
                  alt="Amita Sharma"
                  className="rounded-circle"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    border: "3px solid rgba(218, 162, 62, 0.45)",
                  }}
                />

                <span
                  className="play-vid fa-beat"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  <i className="fa-solid fa-circle-play"></i>
                </span>
                <div className="stars mt-2">★★★★★</div>
              </div>

              <div>
                <h5 className="fw-bold text-black">Amita Sharma</h5>
                <div className="mb-1 text-black">
                  <strong>Lang.</strong> Hindi, English
                </div>
                <div className="mb-1 astro-tags">Vedic, Numero, Vastu</div>
                <div className="mb-1 text-black">
                  <strong>Exp.</strong> 4 years
                </div>
                <div className="text-black">
                  <strong>Call.</strong> ₹50.00/min
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-center justify-content-md-start mt-4 gap-2">
              <button className="astro-call d-flex align-items-center gap-1">
                <i className="fa-solid fa-phone-volume"></i> Call
              </button>
              <button className="astro-videocall d-flex align-items-center gap-1">
                <i className="fa-solid fa-video"></i> Video Call
              </button>
              <button className="astro-chat d-flex align-items-center gap-1">
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
                      <input
                        type="time"
                        className="form-control form-inputs"
                        required
                      />
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
                      <label className="form-label">Gender</label>
                      <select className="form-select">
                        <option selected disabled>
                          Select
                        </option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Marital Status</label>
                      <select className="form-select">
                        <option selected disabled>
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
                        <option selected disabled>
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
                    "The birth chart reading was incredibly detailed and
                    accurate. It helped me understand my life path and make
                    important career decisions."
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
                    "The planetary transit analysis provided invaluable timing
                    for my business decisions. The accuracy of predictions and
                    professional guidance has been truly remarkable."
                  </p>
                </div>

                <button className="story-btn mt-4">
                  <i className="fa-solid fa-share"></i>
                  <a href="#">Share Your Story</a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="product-part">
        <div className="container py-5">
          <h2 className="text-center gy-2">
            The<span style={{ color: "#732882" }}> Astrology Bharat</span>
            <span style={{ color: "#000000" }}>Product</span>
            <span style={{ color: "#732882" }}>Store</span>
          </h2>
          <div className="row justify-content-center gap-4 gap-lg-0">
            <div className="col-lg-3 col-md-6 mb-4 d-flex justify-content-center">
              <div className="product-card">
                <img
                  src="/images/astro-img1.png"
                  className="product-img"
                  alt="Product"
                />
                <div className="pt-3 text-sm">
                  <h5 className="text-black">Premium Crystal Ball</h5>
                  <p className="product-description text-black">
                    Professional grade crystal for divination and meditation
                  </p>
                  <div className="product-price-part gap-2 mt-3">
                    <a className="product-price py-2"> ₹359 </a>
                    <a className="product-button py-2 fs-5">Buy Now</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4 d-flex justify-content-center">
              <div className="product-card">
                <img
                  src="/images/astro-img1.png"
                  className="product-img"
                  alt="Product"
                />
                <div className="pt-3 text-sm">
                  <h5 className="text-black">Premium Crystal Ball</h5>
                  <p className="product-description text-black">
                    Professional grade crystal for divination and meditation
                  </p>
                  <div className="product-price-part gap-2 mt-3">
                    <a className="product-price py-2"> ₹359 </a>
                    <a className="product-button py-2 fs-5">Buy Now</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4 d-flex justify-content-center">
              <div className="product-card">
                <img
                  src="/images/astro-img1.png"
                  className="product-img"
                  alt="Product"
                />
                <div className="pt-3 text-sm">
                  <h5 className="text-black">Premium Crystal Ball</h5>
                  <p className="product-description text-black">
                    Professional grade crystal for divination and meditation
                  </p>
                  <div className="product-price-part gap-2 mt-3">
                    <a className="product-price py-2"> ₹359 </a>
                    <a className="product-button py-2 fs-5">Buy Now</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4 d-flex justify-content-center">
              <div className="product-card">
                <img
                  src="/images/astro-img1.png"
                  className="product-img"
                  alt="Product"
                />
                <div className="pt-3 text-sm">
                  <h5 className="text-black">Premium Crystal Ball</h5>
                  <p className="product-description text-black">
                    Professional grade crystal for divination and meditation
                  </p>
                  <div className="product-price-part gap-2 mt-3">
                    <a className="product-price py-2"> ₹359 </a>
                    <a className="product-button py-2 fs-5">Buy Now</a>
                  </div>
                </div>
              </div>
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
              Let’s see what our customers say about us: <br />
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

export default page;

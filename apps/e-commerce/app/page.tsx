// app/store/page.tsx
"use client";
import React from "react";

export default function Page() {
  // Sample product list
  const products = [
    {
      id: 1,
      name: "Astrology Kundli Report",
      price: "₹499",
      img: "/images/product1.jpg",
    },
    {
      id: 2,
      name: "Gemstone - Emerald",
      price: "₹2999",
      img: "/images/product2.jpg",
    },
    {
      id: 3,
      name: "Numerology Report",
      price: "₹799",
      img: "/images/product3.jpg",
    },
    {
      id: 4,
      name: "Vastu Consultation",
      price: "₹1499",
      img: "/images/product4.jpg",
    },
    {
      id: 5,
      name: "Palmistry Session",
      price: "₹999",
      img: "/images/product5.jpg",
    },
    {
      id: 6,
      name: "Gemstone - Ruby",
      price: "₹2499",
      img: "/images/product6.jpg",
    },
  ];

  return (
    <div className="container my-5">
    <h2 className="text-center mb-4">Best Sellers</h2>
    <div className="row g-4">
      {/* Card 1 */}
      <div className="col-12 col-sm-6 col-md-4 col-lg-3">
        <div className="card shadow-sm border-0 h-100 rounded-4">
          <img
            src="/images/ser1.jpg"
            className="card-img-top rounded-4"
            alt="Dhan Yog Bracelet"
          />
          <div className="card-body">
            <h6 className="card-title">Dhan Yog Bracelet</h6>
            <div className="d-flex align-items-center mb-2">
              <div className="text-warning me-2">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star-half-alt"></i>
              </div>
              <small className="text-muted">1280 reviews</small>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="fw-bold">₹699</span>{" "}
                <del className="text-muted">₹1,999</del>
              </div>
              <button className="btn btn-dark btn-sm rounded-3">
                <i className="fa fa-shopping-bag me-1"></i> Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="col-12 col-sm-6 col-md-4 col-lg-3">
        <div className="card shadow-sm border-0 h-100 rounded-4">
          <img
            src="/images/ser2.jpg"
            className="card-img-top rounded-4"
            alt="Raw Pyrite Bracelet"
          />
          <div className="card-body">
            <h6 className="card-title">Raw Pyrite Bracelet</h6>
            <div className="d-flex align-items-center mb-2">
              <div className="text-warning me-2">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star-half-alt"></i>
              </div>
              <small className="text-muted">1387 reviews</small>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="fw-bold">₹699</span>{" "}
                <del className="text-muted">₹1,999</del>
              </div>
              <button className="btn btn-dark btn-sm rounded-3">
                <i className="fa fa-shopping-bag me-1"></i> Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="col-12 col-sm-6 col-md-4 col-lg-3">
        <div className="card shadow-sm border-0 h-100 rounded-4">
          <img
            src="/images/ser3.jpg"
            className="card-img-top rounded-4"
            alt="Maha Dhan Yog Combo"
          />
          <div className="card-body">
            <h6 className="card-title">Maha Dhan Yog Combo</h6>
            <div className="d-flex align-items-center mb-2">
              <div className="text-warning me-2">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star-half-alt"></i>
              </div>
              <small className="text-muted">381 reviews</small>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="fw-bold">₹899</span>{" "}
                <del className="text-muted">₹5,397</del>
              </div>
              <button className="btn btn-dark btn-sm rounded-3">
                <i className="fa fa-shopping-bag me-1"></i> Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card 4 */}
      <div className="col-12 col-sm-6 col-md-4 col-lg-3">
        <div className="card shadow-sm border-0 h-100 rounded-4">
          <img
            src="/images/ser4.jpg"
            className="card-img-top rounded-4"
            alt="Love & Money Attractor Bracelet"
          />
          <div className="card-body">
            <h6 className="card-title">Love & Money Attractor Bracelet</h6>
            <div className="d-flex align-items-center mb-2">
              <div className="text-warning me-2">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star-half-alt"></i>
              </div>
              <small className="text-muted">1159 reviews</small>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="fw-bold">₹699</span>{" "}
                <del className="text-muted">₹1,999</del>
              </div>
              <button className="btn btn-dark btn-sm rounded-3">
                <i className="fa fa-shopping-bag me-1"></i> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

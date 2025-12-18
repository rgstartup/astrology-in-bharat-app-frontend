"use client";
import React, { useState } from "react";

export default function ReviewsPage() {
  const [filter, setFilter] = useState("all");

  const reviews = [
    {
      id: 1,
      user: "Rahul Sharma",
      astrologer: "Priya Joshi",
      rating: 5,
      comment: "Excellent consultation! Very accurate predictions.",
      date: "2024-01-15",
      status: "approved",
    },
    {
      id: 2,
      user: "Sneha Patel",
      astrologer: "Amit Kumar",
      rating: 4,
      comment: "Good service, helped me a lot.",
      date: "2024-01-14",
      status: "pending",
    },
    {
      id: 3,
      user: "Vikram Singh",
      astrologer: "Priya Joshi",
      rating: 1,
      comment: "Completely fake! Waste of money and time.",
      date: "2024-01-13",
      status: "flagged",
    },
    {
      id: 4,
      user: "Anjali Verma",
      astrologer: "Rajesh Sharma",
      rating: 5,
      comment: "Amazing experience! Highly recommended.",
      date: "2024-01-12",
      status: "approved",
    },
  ];

  const filteredReviews =
    filter === "all"
      ? reviews
      : reviews.filter((review) => review.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-success";
      case "pending":
        return "bg-warning text-dark";
      case "flagged":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const renderStars = (rating: number) => {
    return (
      <>
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`bi bi-star${i < rating ? "-fill" : ""} text-warning`}
          ></i>
        ))}
      </>
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Reviews Moderation</h2>
        <div className="btn-group">
          <button
            className={`btn ${filter === "all" ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`btn ${filter === "pending" ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`btn ${filter === "flagged" ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() => setFilter("flagged")}
          >
            Flagged
          </button>
          <button
            className={`btn ${filter === "approved" ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() => setFilter("approved")}
          >
            Approved
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-start border-primary border-4">
            <div className="card-body">
              <h6 className="text-muted">Total Reviews</h6>
              <h3>{reviews.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-start border-warning border-4">
            <div className="card-body">
              <h6 className="text-muted">Pending</h6>
              <h3>
                {reviews.filter((r) => r.status === "pending").length}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-start border-danger border-4">
            <div className="card-body">
              <h6 className="text-muted">Flagged</h6>
              <h3>
                {reviews.filter((r) => r.status === "flagged").length}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-start border-success border-4">
            <div className="card-body">
              <h6 className="text-muted">Approved</h6>
              <h3>
                {reviews.filter((r) => r.status === "approved").length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="card shadow-sm">
        <div className="card-body">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="border-bottom pb-3 mb-3 last-child-no-border"
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 className="mb-1">
                    <strong>{review.user}</strong> reviewed{" "}
                    <span className="text-primary">{review.astrologer}</span>
                  </h6>
                  <div className="mb-2">{renderStars(review.rating)}</div>
                  <p className="mb-2">{review.comment}</p>
                  <small className="text-muted">
                    <i className="bi bi-calendar me-1"></i>
                    {review.date}
                  </small>
                </div>
                <div className="text-end">
                  <span
                    className={`badge ${getStatusBadge(review.status)} mb-2`}
                  >
                    {review.status.toUpperCase()}
                  </span>
                  <div className="btn-group-vertical d-block">
                    {review.status !== "approved" && (
                      <button className="btn btn-sm btn-success mb-1">
                        <i className="bi bi-check-circle me-1"></i>
                        Approve
                      </button>
                    )}
                    {review.status !== "flagged" && (
                      <button className="btn btn-sm btn-warning mb-1">
                        <i className="bi bi-flag me-1"></i>
                        Flag
                      </button>
                    )}
                    <button className="btn btn-sm btn-danger">
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
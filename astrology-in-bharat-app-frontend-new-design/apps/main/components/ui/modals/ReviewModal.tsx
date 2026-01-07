"use client";
import React, { useState } from "react";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { rating: number; review: string; name: string }) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError("Please select a star rating.");
            return;
        }
        if (!review.trim()) {
            setError("Please write a review.");
            return;
        }
        if (!name.trim()) {
            setError("Please enter your name.");
            return;
        }

        onSubmit({ rating, review, name });
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setRating(0);
        setHoverRating(0);
        setReview("");
        setName("");
        setError(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    }

    if (!isOpen) return null;

    return (
        <>
            <div
                className="modal-backdrop fade show"
                onClick={handleClose}
                style={{ display: "block", zIndex: 1040 }}
            ></div>

            <div
                className="modal fade show"
                style={{ display: "block", zIndex: 1050 }}
                tabIndex={-1}
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg">
                        <div className="modal-header border-bottom-0 pb-0">
                            <h5 className="modal-title fw-bold" style={{ color: "#732882" }}>
                                Share Your Story
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleClose}
                                aria-label="Close"
                            ></button>
                        </div>

                        <div className="modal-body pt-2">
                            <p className="text-muted small mb-4">
                                Rate your experience with the astrologer.
                            </p>

                            <form onSubmit={handleSubmit}>
                                {/* Star Rating */}
                                <div className="mb-4 text-center">
                                    <div className="d-flex justify-content-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <i
                                                key={star}
                                                className={`fa-star fa-2x cursor-pointer ${star <= (hoverRating || rating)
                                                    ? "fa-solid"
                                                    : "fa-regular text-muted"
                                                    }`}
                                                style={{
                                                    cursor: "pointer",
                                                    transition: "color 0.2s",
                                                    color: star <= (hoverRating || rating) ? "#daa23e" : undefined
                                                }}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setRating(star)}
                                            ></i>
                                        ))}
                                    </div>
                                    <div className="mt-2 fw-bold" style={{ color: "#daa23e" }}>
                                        {rating > 0 ? `${rating} / 5` : "Tap a star to rate"}
                                    </div>
                                </div>

                                {/* Name Input */}
                                <div className="mb-3">
                                    <label htmlFor="reviewerName" className="form-label fw-bold small">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="reviewerName"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ borderRadius: "10px" }}
                                    />
                                </div>

                                {/* Review Textarea */}
                                <div className="mb-3">
                                    <label htmlFor="reviewText" className="form-label fw-bold small">
                                        Write a Review
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="reviewText"
                                        rows={4}
                                        placeholder="Tell us about your experience..."
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        style={{ borderRadius: "10px", resize: "none" }}
                                    ></textarea>
                                </div>

                                {error && (
                                    <div className="alert alert-danger py-2 small" role="alert">
                                        <i className="fa-solid fa-circle-exclamation me-2"></i>
                                        {error}
                                    </div>
                                )}

                                <div className="d-grid gap-2 mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{
                                            backgroundColor: "#732882",
                                            borderColor: "#732882",
                                            borderRadius: "50px",
                                            padding: "10px",
                                        }}
                                    >
                                        Submit Review
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={handleClose}
                                        style={{
                                            borderRadius: "50px",
                                            padding: "10px",
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReviewModal;

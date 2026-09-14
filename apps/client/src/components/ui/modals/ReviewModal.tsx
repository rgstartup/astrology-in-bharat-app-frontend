"use client";
import React, { useState, useEffect } from "react";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { rating: number; review: string }) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Disable body scroll when modal is open
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
            document.body.style.height = "100%";
        } else {
            document.body.style.overflow = originalStyle;
            document.documentElement.style.overflow = "";
            document.body.style.height = "";
        }
        return () => {
            document.body.style.overflow = originalStyle;
            document.documentElement.style.overflow = "";
            document.body.style.height = "";
        };
    }, [isOpen]);

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

        onSubmit({ rating, review });
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setRating(0);
        setHoverRating(0);
        setReview("");
        setError(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(249,115,22,0.3)] overflow-hidden animate-in zoom-in-95 fade-in duration-500 max-h-[90vh] flex flex-col"
        data-lenis-prevent="true"
      >
        {/* Decorative Top Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-orange via-orange/80 to-orange shrink-0" />
        
        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 custom-scrollbar overscroll-contain">
          {/* Header */}
          <div className="px-8 pt-10 pb-6 flex justify-between items-start sticky top-0 bg-white z-10 border-b border-slate-50">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black text-slate-900 m-0 tracking-tight">Post your review</h2>
              <p className="text-[10px] font-black text-orange uppercase tracking-[0.2em] m-0">We value your honest feedback</p>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-orange hover:text-white transition-all duration-300 group"
            >
              <i className="fa-solid fa-xmark text-lg group-hover:rotate-90 transition-transform"></i>
            </button>
          </div>

          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Star Rating Section */}
              <div className="bg-orange/5 border border-orange/10 rounded-[2rem] p-8 flex flex-col items-center group/rating">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`text-4xl transition-all duration-300 transform outline-none ${
                          star <= (hoverRating || rating) 
                          ? "text-orange scale-110 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]" 
                          : "text-slate-200 hover:text-slate-300"
                      }`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <i className="fa-solid fa-star"></i>
                    </button>
                  ))}
                </div>
                <div className="mt-6 px-5 py-2 bg-white rounded-full shadow-sm border border-slate-100 ring-4 ring-orange/5">
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                    {rating > 0 ? `${rating} Stars Selected` : "Tap to rate"}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {/* Review Textarea */}
                <div className="relative">
                  <label className="absolute -top-2.5 left-6 px-2 bg-white text-[9px] font-black text-orange uppercase tracking-[0.2em] z-10">
                    Share Your Story
                  </label>
                  <div className="relative group">
                      <div className="absolute left-6 top-6 text-slate-400 group-focus-within:text-orange transition-colors">
                          <i className="fa-solid fa-comment-dots text-sm"></i>
                      </div>
                      <textarea
                      className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-2xl focus:border-orange focus:ring-4 focus:ring-orange/5 transition-all outline-none font-bold text-sm min-h-[140px] resize-none placeholder:text-slate-300"
                      placeholder="Tell us about the product and your experience..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center gap-3 font-bold text-[11px] animate-in slide-in-from-top-2">
                  <i className="fa-solid fa-triangle-exclamation text-sm"></i>
                  <span className="uppercase tracking-wider">{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 sticky bottom-0 bg-white z-10">
                <button
                  type="button"
                  className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                  onClick={handleClose}
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-5 bg-gradient-to-r from-orange to-orange/80 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_10px_20px_rgba(249,115,22,0.2)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.3)] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-3 decoration-0 border-0 outline-none"
                >
                  Submit Review
                  <i className="fa-solid fa-shield-check text-sm"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;



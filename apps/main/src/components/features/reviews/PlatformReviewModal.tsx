"use client";

import React, { useState, useEffect } from "react";
import { api as http } from "@/lib/api";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib";
import { CloseButton } from "@repo/ui";
const QUICK_TAGS = [
  "Highly Accurate",
  "Life Changing",
  "Great Guidance",
  "Very Helpful",
  "Best Platform",
  "Amazing Experience",
];

const REVIEW_SHOWN_KEY = "platform_review_shown";

interface PlatformReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const PlatformReviewModal: React.FC<PlatformReviewModalProps> = ({
  isOpen,
  onClose,
  userName,
}) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 50);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    try {
      const [res, err] = await http.post('/reviews', {
        rating,
        comment: review || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        review_type: 'platform',
      });

      if (err) {
        toast.error(getErrorMessage(err) || "Review submit karne mein problem hui. Dobara try karein.");
        return;
      }
      setSubmitted(true);
      setTimeout(() => handleClose(), 2500);
    } catch (error) {
      toast.error(getErrorMessage(error) || "Kuch gadbad ho gayi. Dobara try karein.");
    }
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[3px] pointer-events-auto transition-opacity duration-400 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div
        className={`relative pointer-events-auto mx-4 w-full max-w-md transform transition-all duration-500 ease-out ${
          visible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-8 opacity-0 scale-95"
        }`}
      >
        <div className="bg-white rounded-[2rem] shadow-[0_30px_80px_-10px_rgba(48,17,24,0.25)] border border-orange-100 overflow-hidden">
          
          {/* Decorative top gradient */}
          <div className="h-1.5 bg-gradient-to-r from-[#F25E0A] via-orange-400 to-[#301118]" />

          {!submitted ? (
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center shadow-inner">
                    <span className="text-xl">🌟</span>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-black text-[#301118] leading-tight">
                      {userName ? `${userName},` : ""} Share Your Experience!
                    </h3>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                      Aapka feedback hamare liye bahut important hai
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-2 mt-1">
                  <CloseButton onClick={handleClose} />
                </div>
              </div>

              {/* Star Rating */}
              <div className="mb-5">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2.5">
                  Apna Rating Dijiye
                </p>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transform transition-transform duration-150 hover:scale-110 active:scale-95"
                    >
                      <svg
                        className={`w-9 h-9 transition-colors duration-150 drop-shadow-sm ${
                          star <= (hovered || rating)
                            ? "text-orange-400 fill-orange-400"
                            : "text-gray-200 fill-gray-200"
                        }`}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={0.5}
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  ))}
                  {(hovered || rating) > 0 && (
                    <span className="text-[11px] font-black text-orange-400 ml-2">
                      {["", "😐 Poor", "🙁 Fair", "😊 Good", "😄 Great", "🤩 Excellent!"][hovered || rating]}
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Tags */}
              <div className="mb-5">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2.5">
                  Quick Tags (Optional)
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all duration-200 ${
                        selectedTags.includes(tag)
                          ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                          : "bg-orange-50 text-orange-600 border-orange-100 hover:border-orange-300"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Area */}
              <div className="mb-6">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2.5">
                  Apna Anubhav Likhein (Optional)
                </p>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Aapka kya anubhav raha Astrology in Bharat ke saath?"
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] text-gray-700 font-medium resize-none focus:outline-none focus:border-orange-200 focus:bg-white transition-all duration-200 placeholder:text-gray-300"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#F25E0A] to-orange-500 text-white text-[12px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/25 hover:from-orange-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  Submit Review ✨
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-3.5 rounded-2xl bg-gray-50 text-gray-400 text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors duration-200"
                >
                  Skip
                </button>
              </div>
            </div>
          ) : (
            /* Success State */
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <span className="text-3xl">🙏</span>
              </div>
              <h3 className="text-xl font-black text-[#301118] mb-2">Dhanyavaad!</h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                Aapka review humein aur behtar banane mein madad karta hai.
                <br />Shukriya for being a part of our family! 💫
              </p>
              <div className="mt-5 flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={`text-2xl ${s <= rating ? "text-orange-400" : "text-gray-200"}`}>★</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformReviewModal;

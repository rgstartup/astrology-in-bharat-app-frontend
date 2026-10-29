"use client";

import React, { useState } from "react";
import { Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { submitReview } from "../api/review-api";

import type { SessionThankYouExpert } from "./session-thank-you";

export type ReviewFormProps = {
  status?: string;
  isDarkMode?: boolean;
  reviewRating: number;
  setReviewRating: (val: number) => void;
  reviewComment: string;
  setReviewComment: (val: string) => void;
  reviewSubmitted: boolean;
  setReviewSubmitted: (val: boolean) => void;
  sessionId: string | null;
  expertData: SessionThankYouExpert;
  router: { push: (path: string) => void };
};

/**
 * Resolves effective star rating between hovered preview and committed selection.
 *
 * @param hoverRating - Current hovered star index.
 * @param reviewRating - Selected star index.
 * @returns Active star count for visual highlight.
 */
function resolveActiveRating(
  hoverRating: number,
  reviewRating: number,
): number {
  if (hoverRating > 0) return hoverRating;
  return reviewRating;
}

/**
 * Generates screen-reader accessible label for star buttons.
 *
 * @param star - Star index (1-5).
 * @returns Human readable accessible label.
 */
function getStarAriaLabel(star: number): string {
  if (star === 1) return "Rate 1 star";
  return `Rate ${star} stars`;
}

/**
 * Derives visual styling classes for star icons.
 *
 * @param star - Current star value.
 * @param activeRating - Active rating benchmark.
 * @returns Tailwind CSS classes.
 */
function getStarIconClass(star: number, activeRating: number): string {
  if (star <= activeRating) {
    return "fill-amber-400 text-amber-400 drop-shadow-xs";
  }
  return "text-[#d3cec6] hover:text-[#9c9fa5]";
}

/**
 * Renders contextual sentiment comment underneath the stars in waterfall style.
 *
 * @param props - Component properties with active rating.
 * @returns Contextual sentiment badge.
 */
function RatingFeedbackComment({ activeRating }: { activeRating: number }) {
  if (activeRating === 1) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-medium text-rose-800 transition-all">
        Poor — Needs improvement
      </span>
    );
  }
  if (activeRating === 2) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-800 transition-all">
        Fair — Could have been better
      </span>
    );
  }
  if (activeRating === 3) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-800 transition-all">
        Good — Satisfactory session
      </span>
    );
  }
  if (activeRating === 4) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800 transition-all">
        Very Good — Helpful and insightful
      </span>
    );
  }
  if (activeRating === 5) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100/70 px-2.5 py-0.5 text-[11px] font-medium text-emerald-900 transition-all">
        Excellent! — Loved the consultation
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#ece8e1] bg-white px-2.5 py-0.5 text-[11px] text-[#7b7b78] transition-all">
      Tap a star to rate
    </span>
  );
}

/**
 * Renders button inner content during submission state.
 */
function SubmitButtonContent({ isSubmitting }: { isSubmitting: boolean }) {
  if (isSubmitting) {
    return (
      <span className="flex items-center gap-2">
        <Spinner />
        Submitting review...
      </span>
    );
  }
  return <>Submit Review</>;
}

/**
 * Interactive review form allowing users to submit star ratings and qualitative comments.
 *
 * @param props - ReviewForm properties.
 * @returns Review submission form JSX.
 */
export default function ReviewForm({
  status,
  reviewRating,
  setReviewRating,
  reviewComment,
  setReviewComment,
  reviewSubmitted,
  setReviewSubmitted,
  sessionId,
  expertData,
  router,
}: ReviewFormProps) {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (status === "expired") return null;
  if (status === "terminated") return null;

  const activeRating = resolveActiveRating(hoverRating, reviewRating);

  /**
   * Handles asynchronous review submission.
   */
  const handleSubmit = async () => {
    if (reviewSubmitted) return;
    if (isSubmitting) return;

    if (!sessionId) {
      toast.error("Invalid Session ID. Cannot submit review.");
      return;
    }

    if (reviewRating === 0) {
      toast.warning("Please select a star rating before submitting");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      sessionId: sessionId,
      expert_id: expertData?.id,
      rating: reviewRating,
      comment: reviewComment.trim(),
    };

    const res = await submitReview(
      sessionId,
      expertData?.id ? Number(expertData.id) : 0,
      reviewRating,
      reviewComment.trim(),
    );
    setIsSubmitting(false);

    if (!res.ok) {
      const errMsg = res.error.message;
      if (errMsg?.toLowerCase().includes("already reviewed")) {
        setReviewSubmitted(true);
        setTimeout(() => router.push("/"), 1500);
        return;
      }
      toast.error(errMsg || "Failed to submit review. Please try again.");
      return;
    }

    setReviewSubmitted(true);
    toast.success("Thank you for your feedback!");
    setTimeout(() => router.push("/"), 1500);
  };

  if (reviewSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-center">
        <CheckCircle className="size-5 text-emerald-600" />
        <h4 className="text-sm font-semibold text-emerald-900">
          Review Submitted
        </h4>
        <p className="text-xs text-emerald-700">
          Thank you for sharing your feedback. Redirecting you home...
        </p>
      </div>
    );
  }

  return (
    <section
      aria-label="Rate your experience"
      className="flex w-full flex-col gap-2.5"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#111111]">
          Rate Your Consultation
        </h3>
      </div>

      {/* Star Selector Box with contextual comment underneath */}
      <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[#ece8e1] bg-[#faf8f5]/60 py-2.5 px-3 shadow-2xs">
        <div
          className="flex items-center justify-center gap-1"
          role="radiogroup"
          aria-label="Rating"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setReviewRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={getStarAriaLabel(star)}
              aria-pressed={star === reviewRating}
              className="group p-1 transition-transform hover:scale-115 active:scale-95 focus:outline-hidden touch-manipulation cursor-pointer"
            >
              <Star
                className={cn(
                  "size-5 sm:size-6 transition-colors",
                  getStarIconClass(star, activeRating),
                )}
              />
            </button>
          ))}
        </div>

        {/* Dynamic sentiment comment underneath the stars */}
        <RatingFeedbackComment activeRating={activeRating} />
      </div>

      {/* Comment Section */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="review-comment"
          className="text-xs font-medium text-[#626260]"
        >
          Feedback & Comments <span className="text-[#9c9fa5]">(Optional)</span>
        </label>
        <Textarea
          id="review-comment"
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          placeholder="Share what went well or how the expert can improve..."
          rows={2}
          className="max-h-24 resize-none overflow-y-auto rounded-xl border-[#e3ded6] bg-white text-sm text-[#111111] placeholder:text-[#9c9fa5] focus-visible:border-[#111111] focus-visible:ring-0"
        />
      </div>

      {/* Submit Button */}
      <Button
        className="h-10 w-full rounded-xl bg-[#111111] text-sm font-medium text-white transition-all hover:bg-black active:scale-[0.99] cursor-pointer"
        disabled={isSubmitting}
        onClick={handleSubmit}
      >
        <SubmitButtonContent isSubmitting={isSubmitting} />
      </Button>
    </section>
  );
}

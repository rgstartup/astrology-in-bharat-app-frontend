"use client";

import React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@repo/lib";
import { api } from "@/actions";

type ReviewFormProps = {
  status?: string;
  isDarkMode: boolean;
  reviewRating: number;
  setReviewRating: (val: number) => void;
  reviewComment: string;
  setReviewComment: (val: string) => void;
  reviewSubmitted: boolean;
  setReviewSubmitted: (val: boolean) => void;
  sessionId: string | null;
  expertData: any;
  router: any;
  onSkip?: () => void;
};

/** Waterfall: reviews only exist for sessions that actually ran. */
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
  onSkip,
}: ReviewFormProps) {
  if (status === "expired" || status === "terminated") return null;

  const handleSubmit = async () => {
    if (reviewSubmitted) return;

    if (!sessionId) {
      toast.error("Invalid Session ID. Cannot submit review.");
      return;
    }

    if (reviewRating === 0) {
      toast.warning("Please select a rating before submitting");
      return;
    }

    const payload = {
      sessionId: sessionId,
      expert_id: expertData?.id,
      rating: reviewRating,
      comment: reviewComment.trim(),
    };

    setReviewSubmitted(true);

    const [res, err] = await api.post("/reviews", payload);

    if (err) {
      const errMsg = getErrorMessage(err);
      if (errMsg.toLowerCase().includes("already reviewed")) {
        setTimeout(() => router.push("/"), 1500);
      } else {
        setReviewSubmitted(false);
        toast.error(errMsg || "Failed to submit review. Please try again.");
      }
    } else {
      setTimeout(() => router.push("/"), 1500);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-center">
        Rate your Experience <span className="font-medium normal-case tracking-normal">(optional)</span>
      </h3>
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setReviewRating(star)}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                "text-muted-foreground",
                star <= reviewRating && "fill-primary text-primary"
              )}
            />
          </Button>
        ))}
      </div>
      <Textarea
        value={reviewComment}
        onChange={(e) => setReviewComment(e.target.value)}
        placeholder="Sharing your experience helps others..."
        rows={2}
        className="resize-none"
      />
      <Button className="w-full" disabled={reviewSubmitted} onClick={handleSubmit}>
        {reviewSubmitted ? (
          <span className="flex items-center gap-2">
            <Spinner />
            Submitted
          </span>
        ) : (
          "Submit Review"
        )}
      </Button>
      {onSkip && !reviewSubmitted && (
        <Button variant="ghost" className="w-full" onClick={onSkip}>
          Skip for now
        </Button>
      )}
    </div>
  );
}

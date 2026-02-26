"use client";
import React, { useCallback, useMemo } from "react";
import { Button } from "@repo/ui";
import { Star, Calendar, CheckCircle, Flag, Trash2 } from "lucide-react";
import type { Review } from "@/app/components/reviews/review";

interface ReviewCardProps {
  review: Review;
  isLast: boolean;
}

const statusBadges = {
  approved: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  flagged: "bg-red-100 text-red-700 border-red-200",
};

export function ReviewCard({ review, isLast }: ReviewCardProps) {
  const handleApprove = useCallback(() => {

  }, [review.id]);

  const handleFlag = useCallback(() => {

  }, [review.id]);

  const handleDelete = useCallback(() => {

  }, [review.id]);

  const formattedDate = useMemo(
    () =>
      new Date(review.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    [review.date]
  );

  return (
    <div className={`pb-4 ${!isLast ? "border-b border-gray-200" : ""}`}>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Left Section */}
        <div className="flex gap-4 flex-1">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
              {review.avatar}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-gray-800">{review.user}</h3>
              <span className="text-gray-500 text-sm">reviewed</span>
              <span className="font-medium text-orange-600">{review.astrologer}</span>
            </div>

            {/* Rating */}
            <div className="flex gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                    }`}
                />
              ))}
            </div>

            {/* Comment */}
            <p className="text-gray-700 mb-2 leading-relaxed">{review.comment}</p>

            {/* Date */}
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <time dateTime={review.date}>{formattedDate}</time>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-col items-start lg:items-end gap-3">
          {/* Status Badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadges[review.status]
              }`}
          >
            {review.status.toUpperCase()}
          </span>

          {/* Action Buttons */}
          <div className="flex flex-wrap lg:flex-col gap-2">
            {review.status !== "approved" && (
              <Button variant="success" size="sm" icon={CheckCircle} onClick={handleApprove}>
                Approve
              </Button>
            )}
            {review.status !== "flagged" && (
              <Button variant="warning" size="sm" icon={Flag} onClick={handleFlag}>
                Flag
              </Button>
            )}
            <Button variant="danger" size="sm" icon={Trash2} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}




"use client";
import React, { useMemo } from "react";
import { Star, Calendar, Hash } from "lucide-react";
import type { Review } from "@/app/components/reviews/review";

interface ReviewCardProps {
  review: Review;
  isLast: boolean;
  onUpdate?: (updatedData?: any) => void;
}

const statusBadges = {
  approved: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-600/10 text-yellow-700 border-yellow-600/20",
  flagged: "bg-red-100 text-red-700 border-red-200",
};

import { sendReviewResponse, updateReviewStatus } from "@/services/admin.service";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib";
import { Send, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
import { Button } from "@repo/ui";

export function ReviewCard({ review, isLast, onUpdate }: ReviewCardProps) {
  const [adminMessage, setAdminMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const handleStatusUpdate = async (status: string) => {
    try {
      const [_, error] = await updateReviewStatus(review.id, status);
      if (error) throw new Error(getErrorMessage(error));
      toast.success(`Review ${status} successfully`);
      if (onUpdate) onUpdate({ status }); // Pass updated status
    } catch (err: any) {
      toast.error(getErrorMessage(err) || "Failed to update status");
    }
  };

  const handleSendMessage = async () => {
    if (!adminMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }
    setSending(true);
    try {
      const [_, error] = await sendReviewResponse(review.id, adminMessage);
      if (error) throw new Error(getErrorMessage(error));
      toast.success("Message sent successfully");
      setAdminMessage("");
      if (onUpdate) onUpdate();
    } catch (err: any) {
      toast.error(getErrorMessage(err) || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formattedDate = useMemo(() => {
// ...
    try {
      if (!review.date) return "N/A";
      const date = new Date(review.date);
      if (isNaN(date.getTime())) return "Invalid Date";
      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    } catch (e) {
      return "Invalid Date";
    }
  }, [review.date]);

  return (
    <div className={`pb-4 ${!isLast ? "border-b border-gray-200" : ""}`}>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Left Section */}
        <div className="flex gap-4 flex-1">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-orange to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden">
              {review.avatarUrl ? (
                <img 
                  src={review.avatarUrl} 
                  alt={review.user} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(`[AdminReview] Image Load Error for ${review.user}:`, review.avatarUrl);
                    (e.target as any).style.display = 'none';
                  }}
                />
              ) : (
                review.avatar
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-gray-800">{review.user}</h3>
              <span className="text-gray-500 text-sm">reviewed</span>
              <span className="font-medium text-orange">
                {review.review_type === 'platform' ? 'Astrology in Bharat' : (review.expert || 'Unknown')}
              </span>
              {review.review_type === 'platform' && (
                <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-black uppercase rounded-full">Platform</span>
              )}
              <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusBadges[review.status as keyof typeof statusBadges]}`}>
                {review.status}
              </div>
            </div>

            {/* Rating */}
            <div className="flex gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < review.rating ? "text-yellow-600 fill-yellow-600" : "text-gray-300"
                    }`}
                />
              ))}
            </div>

            {/* Comment */}
            <p className="text-gray-700 mb-2 leading-relaxed">{review.comment}</p>

            {/* Date & Session */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <time dateTime={typeof review.date === 'string' ? review.date : ''}>{formattedDate}</time>
              </div>
              {review.sessionId && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">
                  <Hash className="w-3.5 h-3.5" />
                  <span>Session {review.sessionId}</span>
                </div>
              )}
            </div>
            {/* Tags */}
            {review.tags && review.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {review.tags.map((tag: string) => (
                  <span key={tag} className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-lg border border-gray-100">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Moderation Actions */}
        <div className="flex flex-col items-start lg:items-end gap-4 w-full lg:w-72">
          {review.review_type === 'platform' && review.status === 'pending' && (
            <div className="flex gap-2 w-full">
              <button
                onClick={() => handleStatusUpdate('approved')}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-lg shadow-emerald-200 active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approve
              </button>
              <button
                onClick={() => handleStatusUpdate('rejected')}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-[11px] font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-lg shadow-red-200 active:scale-95"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </button>
            </div>
          )}

          {review.review_type !== 'platform' && (
            <div className="w-full space-y-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message to Astrologer:</p>
              <textarea
                className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/50 focus:border-orange outline-none resize-none h-20 placeholder:text-gray-400 transition-all"
                placeholder="Type your message here..."
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
              />
              <Button
                variant="primary"
                size="sm"
                className="w-full rounded-xl font-bold py-3"
                disabled={sending}
                onClick={handleSendMessage}
              >
                {sending ? "Sending..." : "Send Response"}
                <Send className="ml-2 w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

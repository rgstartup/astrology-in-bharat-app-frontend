"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";

// Components
import { StatsCards } from "@repo/ui";
import { SearchInput } from "@repo/ui";
import { Button } from "@repo/ui";
import { ReviewCard } from "@/app/components/reviews/ReviewCard";
import { getReviews, getReviewStats } from "@/services/admin.service";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib";

// Icons
import { MessageSquare, Loader2, Star, ThumbsUp, ThumbsDown, Meh } from "lucide-react";
import type { Review } from "@/app/components/reviews/review";

export default function ReviewsPage() {
  const [filter, setFilter] = useState("all");
  const [reviewType, setReviewType] = useState("all"); // 'all' | 'platform' | 'expert' | 'merchant'
  const [searchQuery, setSearchQuery] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    good: 0,
    moderate: 0,
    bad: 0,
  });

  const fetchStats = useCallback(async () => {
    const [data, error] = await getReviewStats();
    if (!error && data) {
      setStats(data);
    }
  }, []);

  const fetchReviews = useCallback(async (pageNum: number, isNewSearch = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const [data, error] = await getReviews({
        page: pageNum,
        limit: 15,
        ratingType: filter === "all" ? undefined : filter,
        search: searchQuery || undefined,
        review_type: reviewType === "all" ? undefined : reviewType,
      });

      if (error) throw new Error(getErrorMessage(error));
// ... mapping logic remains same ...

      const newReviews: Review[] = (data?.reviews || data || []).map((r: any) => ({
        id: r.id,
        user: r.user?.name || r.client?.name || r.reviewer_name || r.reviewerName || r.client?.user?.name || r.userName || "Unknown",
        expert: r.expert?.user?.name || r.expert?.name || r.expertName || "Unknown",
        rating: r.rating,
        comment: r.comment || "",
        date: r.created_at || r.createdAt || r.date,
        status: r.status || "pending",
        avatar: (r.user?.name || r.client?.name || r.reviewer_name || r.reviewerName || r.client?.user?.name || r.userName || "U").charAt(0).toUpperCase(),
        avatarUrl: r.user?.avatar || r.client?.avatar || r.client?.profile_picture || null,
        sessionId: r.session_id || r.sessionId || r.orderId,
        tags: r.tags || [],
        review_type: r.review_type || "expert",
      }));

      if (isNewSearch) {
        setReviews(newReviews);
      } else {
        setReviews(prev => [...prev, ...newReviews]);
      }
      setHasMore(newReviews.length === 15);
    } catch (err: any) {
      toast.error(getErrorMessage(err) || "Failed to fetch reviews");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filter, searchQuery, reviewType]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    setPage(1);
    fetchReviews(1, true);
  }, [filter, searchQuery, reviewType, fetchReviews]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage);
  };

  const statsConfig = useMemo(() => [
    {
      title: "Total Reviews",
      value: stats.total.toLocaleString(),
      icon: MessageSquare,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100",
    },
    {
      title: "Good Reviews (4-5★)",
      value: stats.good.toLocaleString(),
      icon: ThumbsUp,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100",
    },
    {
      title: "Moderate (3★)",
      value: stats.moderate.toLocaleString(),
      icon: Meh,
      iconColor: "text-yellow-600",
      iconBgColor: "bg-yellow-600/10",
    },
    {
      title: "Bad Reviews (1-2★)",
      value: stats.bad.toLocaleString(),
      icon: ThumbsDown,
      iconColor: "text-red-600",
      iconBgColor: "bg-red-100",
    },
  ], [stats]);

  const filterButtons = [
    { value: "all", label: "All Reviews", variant: "primary" },
    { value: "good", label: "Good Reviews", variant: "success" },
    { value: "moderate", label: "Moderate Reviews", variant: "warning" },
    { value: "bad", label: "Bad Reviews", variant: "danger" },
  ];

  return (
    <main className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reviews Moderation</h1>
          <p className="font-medium text-gray-700 mt-1">Manage and moderate user reviews</p>
        </div>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search reviews..."
          className="w-full md:w-80"
          size="md"
        />
      </header>

      <StatsCards stats={statsConfig} columns={4} />

      {/* Review Type Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        {[
          { value: "all", label: "All Reviews", emoji: "📋" },
          { value: "platform", label: "🌟 Platform Reviews", emoji: "" },
          { value: "expert", label: "Expert Reviews", emoji: "👨‍💼" },
          { value: "merchant", label: "Shop Reviews", emoji: "🏪" },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => { setReviewType(value); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
              reviewType === value
                ? value === "platform"
                  ? "bg-brand-orange text-white shadow-md shadow-orange-100/50"
                  : "bg-orange text-white shadow-md"
                : "bg-gray-100 font-bold text-gray-700 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {filterButtons.map(({ value, label, variant }) => (
          <Button
            key={value}
            variant={filter === value ? (variant as any) : "outline"}
            size="md"
            onClick={() => {
              setFilter(value);
              setPage(1);
            }}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-700 font-medium">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p>Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-700 text-lg font-bold">No reviews found</p>
              <p className="text-gray-600 font-medium text-sm mt-1">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <ReviewCard
                    key={`${review.id}-${index}`}
                    review={review}
                    isLast={index === reviews.length - 1}
                    onUpdate={(updatedData) => {
                      fetchStats();
                      if (updatedData && updatedData.status) {
                        setReviews(prev => prev.map(r => r.id === review.id ? { ...r, status: updatedData.status } : r));
                      } else {
                        // If we don't have updated data, fallback to refetch or assume no change needed in UI
                      }
                    }}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="pt-6 flex justify-center border-t border-gray-100">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="w-full md:w-auto px-8"
                  >
                    {loadingMore ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {loadingMore ? "Loading..." : "Load More Reviews"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}




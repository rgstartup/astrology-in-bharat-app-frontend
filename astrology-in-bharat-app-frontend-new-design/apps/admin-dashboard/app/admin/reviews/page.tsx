"use client";
import React, { useState, useMemo } from "react";

// Components
import { StatsCards } from "../../../../shared/components/StatsCard";
import { SearchInput } from "../../../../shared/components/SearchInput";
import { Button } from "../../../../shared/components/Button";
import { ReviewCard } from "@/app/components/reviews/ReviewCard";

// Icons
import { MessageSquare } from "lucide-react";

// Data config
import { reviewsData, getStatsConfig } from "@/app/components/reviews/reviewsConfig";

export default function ReviewsPage() {
  // Filter state (all, pending, flagged, approved)
  const [filter, setFilter] = useState("all");

  // Search query state
  const [searchQuery, setSearchQuery] = useState("");

  // Get stats config (memoized)
  const statsConfig = useMemo(() => getStatsConfig(reviewsData), []);

  // Filter reviews based on status and search query
  const filteredReviews = useMemo(() => {
    return reviewsData.filter((review) => {
      const matchesFilter = filter === "all" || review.status === filter;
      const matchesSearch =
        review.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.astrologer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  // Filter button configs
  const filterButtons = [
    { value: "all", label: "All Reviews", variant: "primary" },
    { value: "pending", label: "Pending", variant: "warning" },
    { value: "flagged", label: "Flagged", variant: "danger" },
    { value: "approved", label: "Approved", variant: "success" },
  ];

  // Get review count for each filter
  const getCount = (status: string) =>
    status === "all" ? "" : ` (${reviewsData.filter((r) => r.status === status).length})`;

  return (
    <main className="space-y-6">
      {/* Header with search */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reviews Moderation</h1>
          <p className="text-gray-600 mt-1">Manage and moderate user reviews</p>
        </div>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search reviews..."
          className="w-full md:w-80"
          size="md"
        />
      </header>

      {/* Stats cards - Total, Pending, Flagged, Approved */}
      <StatsCards stats={statsConfig} columns={4} />

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {filterButtons.map(({ value, label, variant }) => (
          <Button
            key={value}
            variant={filter === value ? (variant as any) : "outline"}
            size="md"
            onClick={() => setFilter(value)}
          >
            {label}
            {getCount(value)}
          </Button>
        ))}
      </div>

      {/* Reviews list or empty state */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 space-y-4">
          {filteredReviews.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No reviews found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            // Review cards
            filteredReviews.map((review, index) => (
              <ReviewCard
                key={review.id}
                review={review}
                isLast={index === filteredReviews.length - 1}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
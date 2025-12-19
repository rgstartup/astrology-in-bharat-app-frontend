"use client";
import React, { useState } from "react";
import { Star, Calendar, CheckCircle, Flag, Trash2, MessageSquare, AlertCircle, Filter } from "lucide-react";
import { StatsCards } from "@/app/components/admin/StatsCard";
import { SearchInput } from "@/app/components/admin/SearchInput"; // ✅ Import
import { Button } from "@/app/components/admin/Button"; // ✅ Import

export default function ReviewsPage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const reviews = [
    {
      id: 1,
      user: "Rahul Sharma",
      astrologer: "Priya Joshi",
      rating: 5,
      comment: "Excellent consultation! Very accurate predictions.",
      date: "2024-01-15",
      status: "approved",
      avatar: "RS",
    },
    {
      id: 2,
      user: "Sneha Patel",
      astrologer: "Amit Kumar",
      rating: 4,
      comment: "Good service, helped me a lot.",
      date: "2024-01-14",
      status: "pending",
      avatar: "SP",
    },
    {
      id: 3,
      user: "Vikram Singh",
      astrologer: "Priya Joshi",
      rating: 1,
      comment: "Completely fake! Waste of money and time.",
      date: "2024-01-13",
      status: "flagged",
      avatar: "VS",
    },
    {
      id: 4,
      user: "Anjali Verma",
      astrologer: "Rajesh Sharma",
      rating: 5,
      comment: "Amazing experience! Highly recommended.",
      date: "2024-01-12",
      status: "approved",
      avatar: "AV",
    },
    {
      id: 5,
      user: "Karan Mehta",
      astrologer: "Amit Kumar",
      rating: 3,
      comment: "Average service, nothing special.",
      date: "2024-01-11",
      status: "pending",
      avatar: "KM",
    },
  ];

  const statsConfig = [
    {
      title: "Total Reviews",
      value: reviews.length,
      icon: MessageSquare,
      iconColor: "text-orange-600",
      iconBgColor: "bg-orange-100",
      trend: { value: "+12%", isPositive: true, period: "this month" },
    },
    {
      title: "Pending Review",
      value: reviews.filter((r) => r.status === "pending").length,
      icon: Filter,
      iconColor: "text-yellow-600",
      iconBgColor: "bg-yellow-100",
      trend: { value: "-5%", isPositive: false, period: "vs last week" },
    },
    {
      title: "Flagged",
      value: reviews.filter((r) => r.status === "flagged").length,
      icon: AlertCircle,
      iconColor: "text-red-600",
      iconBgColor: "bg-red-100",
      trend: { value: "+2", isPositive: false, period: "need attention" },
    },
    {
      title: "Approved",
      value: reviews.filter((r) => r.status === "approved").length,
      icon: CheckCircle,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100",
      trend: { value: "+18%", isPositive: true, period: "this month" },
    },
  ];

  const filteredReviews = reviews.filter((review) => {
    const matchesFilter = filter === "all" || review.status === filter;
    const matchesSearch =
      review.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.astrologer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "flagged":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const handleApprove = (id: number) => console.log("Approve review:", id);
  const handleFlag = (id: number) => console.log("Flag review:", id);
  const handleDelete = (id: number) => console.log("Delete review:", id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Reviews Moderation</h2>
          <p className="text-gray-600 mt-1">Manage and moderate user reviews</p>
        </div>

        {/* ✅ Using SearchInput Component */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search reviews..."
          className="w-full md:w-80"
          size="md"
        />
      </div>

      {/* Stats Cards */}
      <StatsCards stats={statsConfig} columns={4} />

      {/* ✅ Filter Buttons - Using Button Component */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "all" ? "primary" : "outline"}
          size="md"
          onClick={() => setFilter("all")}
        >
          All Reviews
        </Button>
        <Button
          variant={filter === "pending" ? "warning" : "outline"}
          size="md"
          onClick={() => setFilter("pending")}
        >
          Pending ({reviews.filter((r) => r.status === "pending").length})
        </Button>
        <Button
          variant={filter === "flagged" ? "danger" : "outline"}
          size="md"
          onClick={() => setFilter("flagged")}
        >
          Flagged ({reviews.filter((r) => r.status === "flagged").length})
        </Button>
        <Button
          variant={filter === "approved" ? "success" : "outline"}
          size="md"
          onClick={() => setFilter("approved")}
        >
          Approved ({reviews.filter((r) => r.status === "approved").length})
        </Button>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No reviews found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            filteredReviews.map((review, index) => (
              <div
                key={review.id}
                className={`pb-4 ${
                  index !== filteredReviews.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex gap-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {review.avatar}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h6 className="font-semibold text-gray-800">{review.user}</h6>
                        <span className="text-gray-500 text-sm">reviewed</span>
                        <span className="font-medium text-orange-600">
                          {review.astrologer}
                        </span>
                      </div>

                      <div className="mb-2">{renderStars(review.rating)}</div>
                      <p className="text-gray-700 mb-2 leading-relaxed">{review.comment}</p>

                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(review.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex flex-col items-start lg:items-end gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                        review.status
                      )}`}
                    >
                      {review.status.toUpperCase()}
                    </span>

                    {/* ✅ Action Buttons - Using Button Component */}
                    <div className="flex flex-wrap lg:flex-col gap-2">
                      {review.status !== "approved" && (
                        <Button
                          variant="success"
                          size="sm"
                          icon={CheckCircle}
                          onClick={() => handleApprove(review.id)}
                        >
                          Approve
                        </Button>
                      )}
                      {review.status !== "flagged" && (
                        <Button
                          variant="warning"
                          size="sm"
                          icon={Flag}
                          onClick={() => handleFlag(review.id)}
                        >
                          Flag
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(review.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
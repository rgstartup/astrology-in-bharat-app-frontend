"use client";
import React, { useEffect, useState } from "react";
import { Users, CalendarCheck, Clock, Wallet } from "lucide-react";
import { StatsCards } from "../../../../shared/components/StatsCard";
import { RecentActivity } from "@/components/dashboard/ActivityFeed";
import { UpcomingAppointments } from "@/components/dashboard/UserTable";
import { ManageConsultaions } from "@/components/dashboard/ManageConsultaions";
// import { MyConsultations } from "@/components/MyConsulation";
import { ConsultationRatings } from "@/components/dashboard/ConsulationRating";
import { ReviewsList } from "@/components/dashboard/ReviewsList";
import { ReviewsModal } from "@/components/dashboard/ReviewsModal";
import { useAuth } from "@/context/AuthContext";
import { getExpertReviewStats, getExpertReviews, Review, ReviewStats } from "@/lib/reviews";

const Page = () => {
  const { user } = useAuth();
  const [ratingStats, setRatingStats] = useState<ReviewStats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.profileId) {
        try {
          const [stats, reviewsData] = await Promise.all([
            getExpertReviewStats(user.profileId),
            getExpertReviews(user.profileId, 1, 4) // Fetch 4 recent reviews
          ]);
          setRatingStats(stats);
          setReviews(reviewsData.data || []);
        } catch (error) {
          console.error("Error fetching ratings/reviews:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user?.profileId]);

  const statsData = [
    {
      title: "Total Consultations",
      value: "12.5k",
      trend: { value: "2.3%", isPositive: true, period: "last week" },
      icon: CalendarCheck,
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Upcoming Sessions",
      value: "9.1k",
      trend: { value: "9.1%", isPositive: true, period: "last week" },
      icon: Clock,
      iconBgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Total Clients",
      value: "3.2k",
      trend: { value: "19%", isPositive: false, period: "last week" },
      icon: Users,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Earnings This Month",
      value: "945",
      trend: { value: "12%", isPositive: true, period: "last week" },
      icon: Wallet,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  // Logic for distribution fallback
  const distribution = [
    { stars: 5, count: Math.round((ratingStats?.totalReviews || 0) * 0.7) },
    { stars: 4, count: Math.round((ratingStats?.totalReviews || 0) * 0.2) },
    { stars: 3, count: Math.round((ratingStats?.totalReviews || 0) * 0.05) },
    { stars: 2, count: Math.round((ratingStats?.totalReviews || 0) * 0.03) },
    { stars: 1, count: Math.round((ratingStats?.totalReviews || 0) * 0.02) },
  ];

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name || "Expert"}!
          </h2>
          <p className="text-gray-500">
            Here's what's happening with your consultations today.
          </p>
        </div>
      </div>

      <section>
        <StatsCards stats={statsData} columns={4} />
      </section>

      <section>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <RecentActivity />
          <div className="lg:col-span-2">
            <UpcomingAppointments />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <ConsultationRatings
            averageRating={ratingStats?.rating || 0}
            totalRatings={ratingStats?.totalReviews || 0}
            distribution={distribution}
            loading={loading}
            onViewAllClick={() => setIsModalOpen(true)}
          />
          {!loading && reviews.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <ReviewsList reviews={reviews} />
            </div>
          )}
        </div>
        <ManageConsultaions />
      </section>

      {user?.profileId && (
        <ReviewsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          expertId={user.profileId}
        />
      )}
    </main>
  );
};

export default Page;

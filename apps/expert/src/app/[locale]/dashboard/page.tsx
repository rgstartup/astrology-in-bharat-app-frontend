"use client";
import React, { useEffect, useState } from "react";
import {
  CalendarCheck,
  CheckCircle,
  Wallet,
  Coins,
} from "lucide-react";
import { StatsCards } from "@repo/ui";
import { RecentActivity } from "@/components/dashboard/ActivityFeed";
import { UpcomingAppointments } from "@/components/dashboard/UserTable";
import { ManageConsultations } from "@/components/dashboard/ManageConsultations";
import { ConsultationRatings } from "@/components/dashboard/ConsultationRating";
import { ReviewsList } from "@/components/dashboard/ReviewsList";
import { ReviewsModal } from "@/components/dashboard/ReviewsModal";
import { useAuthStore } from "@/store/useAuthStore";
import { getReviewStats, getReviews, Review } from "@/lib/reviews";
import { getDashboardStats, DashboardStats } from "@/lib/dashboard";
import { ReviewStats } from "@/types/expert";
import {
  StatsSkeleton,
  ActivitySkeleton,
  TableSkeleton,
} from "@/components/dashboard/DashboardSkeletons";
const Page = () => {
  const { user } = useAuthStore();
  const [ratingStats, setRatingStats] = useState<ReviewStats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log({ user });

      // Use profileId if available, fallback to user.id
      const expertId = user?.profileId || user?.id;
      if (!expertId) {
        console.warn(
          "[Dashboard] No expertId found on user object:",
          JSON.stringify(user),
        );
        setLoading(false);
        return;
      }

      console.log(
        "[Dashboard] Fetching data for expertId:",
        expertId,
        "| profileId:",
        user?.profileId,
        "| id:",
        user?.id,
      );

      const [
        [stats, statsErr],
        [reviewsData, reviewsErr],
        [dStats, dStatsErr],
      ] = await Promise.all([
        getReviewStats(expertId),
        getReviews(expertId, 1, 10),
        getDashboardStats("total"),
      ]);

      if (statsErr)
        console.error("[Dashboard] Review stats fetch failed:", statsErr);
      if (reviewsErr)
        console.error("[Dashboard] Reviews fetch failed:", reviewsErr);
      if (dStatsErr)
        console.error("[Dashboard] Dashboard stats fetch failed:", dStatsErr);

      if (stats) {
        console.log(
          "[Dashboard] Rating stats received:",
          JSON.stringify(stats),
        );
        setRatingStats(stats);
      }
      if (reviewsData) {
        setReviews(reviewsData.reviews || []);
        setReviewsTotal(reviewsData.total || 0);
      }
      if (dStats) setDashboardStats(dStats);

      setLoading(false);
    };

    fetchData();
  }, [user?.profileId, user?.id]);

  const statsData = [
    {
      title: "Total Sessions",
      value: (dashboardStats?.totalChatSessions || 0).toString(),
      trend: {
        value: dashboardStats?.trends?.sessions || "All Time",
        isPositive: true,
        period: "total",
      },
      icon: CalendarCheck,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Reviews",
      value: (reviewsTotal || dashboardStats?.totalReviews || 0).toString(),
      trend: { value: "Feedback", isPositive: true, period: "total" },
      icon: CheckCircle,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Wallet Balance",
      value: `₹${(dashboardStats?.walletBalance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: { value: "Withdrawable", isPositive: true, period: "current" },
      icon: Wallet,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Total Earnings",
      value: `₹${(dashboardStats?.totalEarnings || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: {
        value: dashboardStats?.trends?.earnings || "Lifetime",
        isPositive: true,
        period: "all time",
      },
      icon: Coins,
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  // Use real distribution from stats if available, otherwise fallback to zeros
  // Use real distribution from backend stats
  const distribution = [
    { stars: 5, count: ratingStats?.counts?.[5] || 0 },
    { stars: 4, count: ratingStats?.counts?.[4] || 0 },
    { stars: 3, count: ratingStats?.counts?.[3] || 0 },
    { stars: 2, count: ratingStats?.counts?.[2] || 0 },
    { stars: 1, count: ratingStats?.counts?.[1] || 0 },
  ];

  return (
    <main className="space-y-8 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between min-w-0">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name || "Expert"}!
          </h2>
          <p className="text-gray-700 mt-1">
            Here's what's happening with your consultations today.
          </p>
        </div>
      </div>

      <section>
        {loading ? (
          <StatsSkeleton />
        ) : (
          <StatsCards stats={statsData} columns={4} />
        )}
      </section>

      <section>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {loading ? (
            <>
              <ActivitySkeleton />
              <div className="lg:col-span-2">
                <TableSkeleton />
              </div>
            </>
          ) : (
            <>
              <RecentActivity />
              <div className="lg:col-span-2">
                <UpcomingAppointments />
              </div>
            </>
          )}
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
          {!loading && reviews.length > 0 && user?.profileId && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-500">
              <ReviewsList
                expertId={user.profileId}
                initialReviews={reviews}
                initialTotal={reviewsTotal}
              />
            </div>
          )}
        </div>
        <ManageConsultations />
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

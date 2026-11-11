"use client";
import React, { useEffect } from "react";
import {
  CalendarCheck,
  CheckCircle,
  Wallet,
  Coins,
} from "@repo/design/lucide";
import { StatsCards } from "@repo/ui";
import { RecentActivity } from "@/components/dashboard/ActivityFeed";
import { UpcomingAppointments } from "@/components/dashboard/UserTable";
import { ManageConsultations } from "@/components/dashboard/ManageConsultations";
import { ConsultationRatings } from "@/components/dashboard/ConsultationRating";
import { ReviewsList } from "@/components/dashboard/ReviewsList";
import { ReviewsModal } from "@/components/dashboard/ReviewsModal";
import { useAuthStore } from "@/store/useAuthStore";
import { useDashboardStore } from "@/store/dashboard.store";
import {
  StatsSkeleton,
  ActivitySkeleton,
  TableSkeleton,
} from "@/components/dashboard/DashboardSkeletons";

const Page = () => {
  const { user } = useAuthStore();
  const {
    ratingStats,
    reviews,
    reviewsTotal,
    dashboardStats,
    loading,
    isModalOpen,
    fetchDashboardData,
    setIsModalOpen,
  } = useDashboardStore();

  useEffect(() => {
    const expertId = user?.profileId || user?.id;
    if (expertId) {
      fetchDashboardData(expertId);
    } else {
      console.warn(
        "[Dashboard] No expertId found on user object:",
        JSON.stringify(user),
      );
    }
  }, [user?.profileId, user?.id, fetchDashboardData]);

  const statsData = [
    {
      title: "Total Sessions",
      value: (dashboardStats?.total_chat_sessions || 0).toString(),
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
      value: (reviewsTotal || dashboardStats?.total_reviews || 0).toString(),
      trend: { value: "Feedback", isPositive: true, period: "total" },
      icon: CheckCircle,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Wallet Balance",
      value: `₹${(dashboardStats?.wallet_balance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: { value: "Withdrawable", isPositive: true, period: "current" },
      icon: Wallet,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Total Earnings",
      value: `₹${(dashboardStats?.total_earnings || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
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
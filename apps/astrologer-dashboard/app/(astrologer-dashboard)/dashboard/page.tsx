"use client";
import React, { useEffect, useState } from "react";
import { Users, CalendarCheck, Clock, Wallet, CheckCircle, XCircle } from "lucide-react";
import { StatsCards } from "@repo/ui";
import { RecentActivity } from "@/components/dashboard/ActivityFeed";
import { UpcomingAppointments } from "@/components/dashboard/UserTable";
import { ManageConsultaions } from "@/components/dashboard/ManageConsultaions";
// import { MyConsultations } from "@/components/MyConsulation";
import { ConsultationRatings } from "@/components/dashboard/ConsulationRating";
import { ReviewsList } from "@/components/dashboard/ReviewsList";
import { ReviewsModal } from "@/components/dashboard/ReviewsModal";
import { useAuthStore } from "@/store/useAuthStore";
import { getExpertReviewStats, getExpertReviews, Review, ReviewStats } from "@/lib/reviews";
import { getDashboardStats, DashboardStats } from "@/lib/dashboard";
import apiClient from "@/lib/apiClient";
import { socket } from "@/lib/socket";
import { toast } from "react-toastify";
import { AlertTriangle, Info } from "lucide-react";
import { useRouter } from "next/navigation";
const Page = () => {
  const { user } = useAuthStore();
  const [ratingStats, setRatingStats] = useState<ReviewStats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();


  useEffect(() => {
    console.log("[DashboardDebug] Current User Status Info:", {
      status: user?.status,
      kycStatus: user?.kycStatus,
      kycDetailsStatus: user?.kyc_details?.status,
      rejectionReason: user?.rejectionReason
    });
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.profileId) {
        setLoading(false);
        return;
      }
      try {
        const [stats, reviewsData, dStats] = await Promise.all([
          getExpertReviewStats(user.profileId),
          getExpertReviews(user.profileId, 1, 4), // Fetch 4 recent reviews
          getDashboardStats('total').catch(err => {
            console.error("[Dashboard] Total stats fetch failed:", err);
            return null;
          })
        ]);
        setRatingStats(stats);
        setReviews(reviewsData.data || []);
        setDashboardStats(dStats);
      } catch (error) {
        console.error("Error fetching ratings/reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.profileId]);

  const statsData = [
    {
      title: "Total Appointment",
      value: (dashboardStats?.total_appointments ?? dashboardStats?.today_appointments ?? 0).toString(),
      trend: { value: "All Time", isPositive: true, period: "total" },
      icon: CalendarCheck,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Complete",
      value: (dashboardStats?.total_completed ?? dashboardStats?.completed_today ?? 0).toString(),
      trend: { value: "Success", isPositive: true, period: "total" },
      icon: CheckCircle,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Total Expired",
      value: (dashboardStats?.total_expired ?? dashboardStats?.expired_today ?? 0).toString(),
      trend: { value: "Missed", isPositive: false, period: "total" },
      icon: XCircle,
      iconBgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Total Earnings",
      value: `₹${(dashboardStats?.total_earnings || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: { value: "Lifetime", isPositive: true, period: "all time" },
      icon: Wallet,
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
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

      {/* KYC Rejection Alert */}
      {(() => {
        const kycStatus = (user?.kycStatus || "").toLowerCase();
        const reason = user?.rejectionReason;

        // Backend logic: Status remains 'pending' but rejectionReason is filled when rejected
        const isRejected = kycStatus === 'rejected' || (kycStatus === 'pending' && !!reason);

        if (!isRejected) return null;

        const displayReason = reason || "Please verify your documents and profile information and try again.";

        return (
          <div className="bg-rose-50 border-2 border-rose-100 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 animate-in slide-in-from-top-4 duration-500 shadow-sm mb-8 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1 flex flex-col items-center sm:items-start">
              <h4 className="text-lg font-black text-rose-900 mb-1">Expert Profile Rejected</h4>
              <p className="text-sm font-bold text-rose-700/80 leading-relaxed mb-3 italic">
                " {displayReason} "
              </p>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-rose-500 bg-white/50 w-fit px-3 py-1 rounded-full border border-rose-100">
                <Info className="w-3 h-3 shrink-0" />
                <span className="text-left">Fix these issues to re-apply for verification</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard/profilemanagement')}
              className="mt-4 sm:mt-0 px-6 py-3 rounded-2xl bg-white border border-rose-200 text-rose-600 font-bold text-xs uppercase tracking-widest hover:bg-rose-100 transition-all shadow-sm whitespace-nowrap"
            >
              Edit Profile
            </button>
          </div>
        );
      })()}

      {/* Account Approved Success Banner */}
      {(() => {
        const kycStatus = (user?.kycStatus || "").toLowerCase();
        const isApproved = kycStatus === 'active' || kycStatus === 'approved';

        if (!isApproved) return null;

        return (
          <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 animate-in slide-in-from-top-4 duration-500 shadow-sm mb-8 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="flex-1 flex flex-col items-center sm:items-start">
              <h4 className="text-lg font-black text-emerald-900 mb-1">Account Fully Verified!</h4>
              <p className="text-sm font-bold text-emerald-700/80 leading-relaxed mb-3">
                Congratulations {user?.name}! Your expert profile is now active and visible to all users. You can now start receiving consultation requests.
              </p>
              <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-emerald-500 bg-white/50 w-fit px-3 py-1 rounded-full border border-emerald-100">
                <CheckCircle className="w-3 h-3 shrink-0" />
                <span className="text-left">Live & Visible to Users</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard/profilemanagement')}
              className="mt-4 sm:mt-0 px-6 py-3 rounded-2xl bg-white border border-emerald-200 text-emerald-600 font-bold text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all shadow-sm whitespace-nowrap"
            >
              View Profile
            </button>
          </div>
        );
      })()}

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



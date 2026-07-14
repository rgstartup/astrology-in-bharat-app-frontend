"use client";
import React, { useEffect, useState } from "react";
import { Users, CalendarCheck, Clock, Wallet, CheckCircle, XCircle, X, Coins } from "lucide-react";
import { StatsCards } from "@repo/ui";
import { RecentActivity } from "@/components/dashboard/ActivityFeed";
import { UpcomingAppointments } from "@/components/dashboard/UserTable";
import { ManageConsultations } from "@/components/dashboard/ManageConsultations";
// import { MyConsultations } from "@/components/MyConsulation";
import { ConsultationRatings } from "@/components/dashboard/ConsultationRating";
import { ReviewsList } from "@/components/dashboard/ReviewsList";
import { ReviewsModal } from "@/components/dashboard/ReviewsModal";
import { useAuthStore } from "@/store/useAuthStore";
import { getReviewStats, getReviews, Review } from "@/lib/reviews";
import { getDashboardStats, DashboardStats } from "@/lib/dashboard";
import { ReviewStats } from "@/types/expert";
import { socket } from "@/lib/socket";
import { toast } from "react-toastify";
import { AlertTriangle, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { StatsSkeleton, ActivitySkeleton, TableSkeleton } from "@/components/dashboard/DashboardSkeletons";
const Page = () => {
  const { user } = useAuthStore();
  const [ratingStats, setRatingStats] = useState<ReviewStats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dismissedBanners, setDismissedBanners] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('dismissed-dashboard-banners');
    if (saved) {
      setDismissedBanners(JSON.parse(saved));
    }
  }, []);

  const handleDismissBanner = (status: string) => {
    const newDismissed = [...dismissedBanners, status.toLowerCase()];
    setDismissedBanners(newDismissed);
    localStorage.setItem('dismissed-dashboard-banners', JSON.stringify(newDismissed));
  };




  useEffect(() => {
    const fetchData = async () => {
      // Use profileId if available, fallback to user.id
      const expertId = user?.profileId || user?.id;
      if (!expertId) {
        console.warn('[Dashboard] No expertId found on user object:', JSON.stringify(user));
        setLoading(false);
        return;
      }

      console.log('[Dashboard] Fetching data for expertId:', expertId, '| profileId:', user?.profileId, '| id:', user?.id);

      const [
        [stats, statsErr],
        [reviewsData, reviewsErr],
        [dStats, dStatsErr]
      ] = await Promise.all([
        getReviewStats(expertId),
        getReviews(expertId, 1, 10),
        getDashboardStats('total')
      ]);

      if (statsErr) console.error("[Dashboard] Review stats fetch failed:", statsErr);
      if (reviewsErr) console.error("[Dashboard] Reviews fetch failed:", reviewsErr);
      if (dStatsErr) console.error("[Dashboard] Dashboard stats fetch failed:", dStatsErr);

      if (stats) {
        console.log('[Dashboard] Rating stats received:', JSON.stringify(stats));
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
      trend: { value: dashboardStats?.trends?.sessions || "All Time", isPositive: true, period: "total" },
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
      value: `₹${(dashboardStats?.walletBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: { value: "Withdrawable", isPositive: true, period: "current" },
      icon: Wallet,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Total Earnings",
      value: `₹${(dashboardStats?.totalEarnings || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: { value: dashboardStats?.trends?.earnings || "Lifetime", isPositive: true, period: "all time" },
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
          <p className="text-gray-500 mt-1">
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

        if (!isRejected || dismissedBanners.includes(kycStatus)) return null;

        const displayReason = reason || "Please verify your documents and profile information and try again.";

        return (
          <div className="bg-rose-50 border-2 border-rose-100 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 animate-in slide-in-from-top-4 duration-500 shadow-sm mb-8 text-center sm:text-left relative group">
            <button
              onClick={() => handleDismissBanner(kycStatus)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-rose-100 text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
            >
              <X size={20} />
            </button>
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

        if (!isApproved || dismissedBanners.includes(kycStatus)) return null;

        return (
          <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 animate-in slide-in-from-top-4 duration-500 shadow-sm mb-8 text-center sm:text-left relative group">
            <button
              onClick={() => handleDismissBanner(kycStatus)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-emerald-100 text-emerald-400 opacity-0 group-hover:opacity-100 transition-all"
            >
              <X size={20} />
            </button>
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



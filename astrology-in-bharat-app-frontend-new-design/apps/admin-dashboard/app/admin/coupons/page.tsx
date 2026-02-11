"use client";
import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { Plus, Search, Tag, Loader2 } from "lucide-react";
import { StatsCards } from "../../../../shared/components/StatsCard";
import { CouponCard } from "@/app/components/coupons/CouponCard";
import { Button } from "../../../../shared/components/Button";
import { getCoupons, getCouponStats } from "@/src/services/admin.service";
import { toast } from "react-toastify";

const CreateCoupon = lazy(() => import("@/app/components/coupons/CreateCoupon"));

const SearchIcon = Search as any;
const LoaderIcon = Loader2 as any;
const TagIcon = Tag as any;

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [realStats, setRealStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateCoupon, setShowCreateCoupon] = useState(false);

  const fetchStats = async () => {
    try {
      const stats = await getCouponStats();
      setRealStats(stats);
    } catch (error) {
      console.error("Failed to fetch coupon stats:", error);
    }
  };

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const [couponsData] = await Promise.all([
        getCoupons(),
        fetchStats()
      ]);
      setCoupons(Array.isArray(couponsData) ? couponsData : (couponsData.data || []));
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
      // Keep empty array on error
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const statsConfig = useMemo(() => {
    return [
      { title: "Total Coupons", value: (realStats?.totalCoupons || 0).toString(), icon: Tag as any, iconColor: "text-blue-600", iconBgColor: "bg-blue-50" },
      { title: "Active Offers", value: (realStats?.activeCoupons || 0).toString(), icon: Tag as any, iconColor: "text-green-600", iconBgColor: "bg-green-50" },
      { title: "Redemptions", value: (realStats?.totalRedemptions || 0).toString(), icon: Tag as any, iconColor: "text-purple-600", iconBgColor: "bg-purple-50" },
      { title: "Used Today", value: (realStats?.usedToday || 0).toString(), icon: Tag as any, iconColor: "text-orange-600", iconBgColor: "bg-orange-50" },
    ];
  }, [realStats]);

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch =
        (coupon.code || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (coupon.description || "").toLowerCase().includes(searchQuery.toLowerCase());

      const cStatus = (coupon.status || 'active').toLowerCase();
      const matchesStatus = statusFilter === "all" || cStatus === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [coupons, searchQuery, statusFilter]);

  const filterButtons = [
    { value: "all", label: "All", variant: "primary" },
    { value: "active", label: "Active", variant: "success" },
    { value: "inactive", label: "Inactive", variant: "secondary" },
    { value: "expired", label: "Expired", variant: "danger" },
  ];

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied!`);
  };

  // Delete Dialog/Logic
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await import("@/src/services/admin.service").then(m => m.deleteCoupon(id));
      toast.success("Coupon deleted successfully");
      fetchCoupons();
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
  };

  const handleToggleStatus = async (id: number, coupon: any) => {
    try {
      // Use isActive as source of truth if available, otherwise check status
      const currentlyActive = typeof coupon.isActive === 'boolean' ? coupon.isActive : (coupon.status?.toLowerCase() === 'active' || !coupon.status);
      const nextActive = !currentlyActive;
      const nextStatus = nextActive ? "active" : "inactive";

      await import("@/src/services/admin.service").then(m => m.updateCoupon(id.toString(), {
        status: nextStatus,
        isActive: nextActive
      }));

      toast.success(`Coupon ${nextActive ? 'activated' : 'deactivated'} successfully`);
      fetchCoupons();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  const handleEdit = (coupon: any) => {
    setEditingCoupon(coupon);
  };

  return (
    <main className="space-y-6 px-4 sm:px-6 lg:px-0">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800 tracking-tight">Coupons & Offers</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Manage platform-wide and private discount codes</p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={() => setShowCreateCoupon(true)}>
          Create Coupon
        </Button>
      </header>

      <StatsCards stats={statsConfig} columns={4} />

      <div className="flex flex-col gap-4 md:flex-row md:items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search coupon code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
          />
        </div>

        <div className="flex gap-2">
          {filterButtons.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${statusFilter === value
                ? "bg-orange-500 text-white shadow-md"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <LoaderIcon className="animate-spin text-orange-500" size={40} />
          <p className="text-gray-400 font-medium">Loading coupons...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCoupons.length === 0 ? (
            <div className="col-span-2 text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <TagIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-bold">No coupons found</p>
              <p className="text-gray-400 text-sm mt-1">Try a different search term or create a new one</p>
            </div>
          ) : (
            filteredCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                {...coupon}
                onCopy={handleCopyCoupon}
                onDelete={() => handleDelete(coupon.id)}
                onToggleStatus={() => handleToggleStatus(coupon.id, coupon)}
                onEdit={() => handleEdit(coupon)}
              />
            ))
          )}
        </div>
      )}

      {showCreateCoupon && (
        <Suspense fallback={null}>
          <CreateCoupon
            onClose={() => setShowCreateCoupon(false)}
            onSuccess={fetchCoupons}
          />
        </Suspense>
      )}

      {editingCoupon && (
        <Suspense fallback={null}>
          <CreateCoupon
            onClose={() => setEditingCoupon(null)}
            onSuccess={fetchCoupons}
            initialData={editingCoupon}
          />
        </Suspense>
      )}
    </main>
  );
}
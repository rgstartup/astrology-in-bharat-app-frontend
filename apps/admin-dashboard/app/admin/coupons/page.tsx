"use client";
import React, { useState, useMemo ,lazy, Suspense } from "react";

// Icons
import { Plus, Search, Tag } from "lucide-react";

// Components
import { StatsCards } from "@/app/components/admin/StatsCard";
import { CouponCard } from "@/app/components/coupons/CouponCard";
import { Button } from "@/app/components/admin/Button";
const CreateCoupon = lazy(() => import("@/app/components/coupons/CreateCoupon"));


// Data config
import { couponsData, getStatsConfig } from "@/app/components/coupons/couponsConfig";

export default function CouponsPage() {
  // Search query state
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter state (all, active, inactive, expired)
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Create modal state
  const [showCreateCoupon, setShowCreateCoupon] = useState(false);

  // Get stats config (memoized)
  const statsConfig = useMemo(() => getStatsConfig(couponsData), []);

  
  // Filter coupons based on search and status
  const filteredCoupons = useMemo(() => {
    return couponsData.filter((coupon) => {
      const matchesSearch =
        coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || coupon.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Filter button configs
  const filterButtons = [
    { value: "all", label: "All", variant: "primary" },
    { value: "active", label: "Active", variant: "success" },
    { value: "inactive", label: "Inactive", variant: "secondary" },
    { value: "expired", label: "Expired", variant: "danger" },
  ];

  // Copy coupon code to clipboard
  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon code "${code}" copied!`);
  };

  // Action handlers
  const handleEdit = (id: number) => console.log("Edit:", id);
  const handleDelete = (id: number) => console.log("Delete:", id);
  const handleToggleStatus = (id: number) => console.log("Toggle:", id);

  return (
    <main className="space-y-6 px-4 sm:px-6 lg:px-0">

      {/* Header with title and create button */}
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
         <h1 className="text-xl sm:text-3xl font-bold text-gray-800 truncate">Coupons & Offers</h1>
           <p className="text-sm sm:text-base text-gray-600 mt-1">Manage discount coupons and offers</p>
        </div>
        <Button variant="primary" size="md" icon={Plus}  onClick={() => {
    
    setShowCreateCoupon(true);
  }}
>
          Create Coupon
        </Button>
      </header>

      {/* Stats cards - Total, Active, Redemptions, Avg Discount */}
      <StatsCards stats={statsConfig} columns={4} />

     {/* Search and filter section */}
<div className="flex flex-col gap-4 md:flex-row md:items-center">
  {/* Search input */}
  <div className="relative flex-1 min-w-0">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      type="text"
      placeholder="Search coupons..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
    />
  </div>

  {/* Status filter buttons */}
  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
    {filterButtons.map(({ value, label, variant }) => (
      <Button
        key={value}
        variant={statusFilter === value ? (variant as any) : "outline"}
        size="md"
        onClick={() => setStatusFilter(value)}
        className="w-full sm:w-auto"
      >
        {label}
      </Button>
    ))}
  </div>
</div>


      {/* Coupons grid or empty state */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCoupons.length === 0 ? (
          // Empty state
          <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-gray-200">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No coupons found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          // Coupon cards
          filteredCoupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              {...coupon}
              onCopy={handleCopyCoupon}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))
        )}
      </div>


    <Suspense
  fallback={
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white px-6 py-3 rounded-lg shadow">
        Loading...
      </div>
    </div>
  }
>
  
  {showCreateCoupon && (
    <CreateCoupon onClose={() => setShowCreateCoupon(false)} />
  )}
</Suspense>
    </main>
  );
}
"use client";
import React, { useState } from "react";
import { Tag, TrendingUp, Users, Percent, Plus, Search } from "lucide-react";
import { StatsCards } from "@/app/components/admin/StatsCard";
import { CouponCard } from "@/app/components/admin/CouponCard";
import { Button } from "@/app/components/admin/Button";

export default function CouponsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const coupons = [
    {
      id: 1,
      code: "ASTRO50",
      description: "50% off on first consultation",
      discountType: "percentage" as const,
      discountValue: 50,
      minOrderValue: 500,
      maxDiscount: 250,
      usageLimit: 100,
      usedCount: 45,
      validFrom: "2024-01-01",
      validUntil: "2024-12-31",
      status: "active" as const,
      createdBy: "Admin",
    },
    {
      id: 2,
      code: "NEWYEAR2024",
      description: "New Year special - ₹300 off",
      discountType: "fixed" as const,
      discountValue: 300,
      minOrderValue: 1000,
      maxDiscount: 300,
      usageLimit: 200,
      usedCount: 187,
      validFrom: "2024-01-01",
      validUntil: "2024-01-31",
      status: "active" as const,
      createdBy: "Admin",
    },
    {
      id: 3,
      code: "WELCOME100",
      description: "Welcome offer for new users",
      discountType: "percentage" as const,
      discountValue: 100,
      minOrderValue: 0,
      maxDiscount: 500,
      usageLimit: 500,
      usedCount: 342,
      validFrom: "2024-01-01",
      validUntil: "2024-06-30",
      status: "active" as const,
      createdBy: "Admin",
    },
    {
      id: 4,
      code: "DIWALI2023",
      description: "Diwali festival offer",
      discountType: "percentage" as const,
      discountValue: 30,
      minOrderValue: 800,
      maxDiscount: 400,
      usageLimit: 150,
      usedCount: 150,
      validFrom: "2023-10-01",
      validUntil: "2023-11-15",
      status: "expired" as const,
      createdBy: "Admin",
    },
    {
      id: 5,
      code: "FLASH20",
      description: "Flash sale - 20% off",
      discountType: "percentage" as const,
      discountValue: 20,
      minOrderValue: 300,
      maxDiscount: 200,
      usageLimit: 50,
      usedCount: 12,
      validFrom: "2024-02-01",
      validUntil: "2024-02-05",
      status: "inactive" as const,
      createdBy: "Admin",
    },
  ];

  // Stats configuration
  const statsConfig = [
    {
      title: "Total Coupons",
      value: coupons.length,
      icon: Tag,
      iconColor: "text-orange-600",
      iconBgColor: "bg-orange-100",
      trend: { value: "+3", isPositive: true, period: "this month" },
    },
    {
      title: "Active Coupons",
      value: coupons.filter((c) => c.status === "active").length,
      icon: TrendingUp,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100",
      trend: { value: "67%", isPositive: true, period: "of total" },
    },
    {
      title: "Total Redemptions",
      value: coupons.reduce((sum, c) => sum + c.usedCount, 0),
      icon: Users,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100",
      trend: { value: "+24%", isPositive: true, period: "this week" },
    },
    {
      title: "Avg Discount",
      value: "₹285",
      icon: Percent,
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-100",
      trend: { value: "+5%", isPositive: true, period: "vs last month" },
    },
  ];

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || coupon.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon code "${code}" copied to clipboard!`);
  };

  const handleEdit = (id: number) => console.log("Edit coupon:", id);
  const handleDelete = (id: number) => console.log("Delete coupon:", id);
  const handleToggleStatus = (id: number) => console.log("Toggle status:", id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Coupons & Offers</h2>
          <p className="text-gray-600 mt-1">
            Manage discount coupons and promotional offers
          </p>
        </div>

        {/* Using Button Component */}
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setShowCreateModal(true)}
        >
          Create New Coupon
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={statsConfig} columns={4} />

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search coupons by code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Status Filter - Using Button Component */}
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "primary" : "outline"}
            size="md"
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "active" ? "success" : "outline"}
            size="md"
            onClick={() => setStatusFilter("active")}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === "inactive" ? "secondary" : "outline"}
            size="md"
            onClick={() => setStatusFilter("inactive")}
          >
            Inactive
          </Button>
          <Button
            variant={statusFilter === "expired" ? "danger" : "outline"}
            size="md"
            onClick={() => setStatusFilter("expired")}
          >
            Expired
          </Button>
        </div>
      </div>

      {/* Coupons Grid - Using CouponCard Component */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCoupons.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-gray-200">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No coupons found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
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
    </div>
  );
}
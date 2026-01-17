"use client";
import React, { useState, useMemo } from "react";
import { mockKYCData, ExpertKYC } from "@/app/components/kyc/kycMockData";
import KYCHeader from "@/app/components/kyc/KYCHeader";
import KYCStatsCards from "@/app/components/kyc/KYCStatsCards";
import KYCFilters from "@/app/components/kyc/KYCFilters";
import KYCTable from "@/app/components/kyc/KYCTable";
import KYCDetailsModal from "@/app/components/kyc/KYCDetailsModal";

export default function KYCPage() {
  const [kycData, setKYCData] = useState<ExpertKYC[]>(mockKYCData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedKYC, setSelectedKYC] = useState<ExpertKYC | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate stats
  const stats = useMemo(
    () => ({
      totalSubmissions: kycData.length,
      pendingReview: kycData.filter(
        (k) => k.status === "pending" || k.status === "under_review"
      ).length,
      approved: kycData.filter((k) => k.status === "approved").length,
      rejected: kycData.filter((k) => k.status === "rejected").length,
    }),
    [kycData]
  );

  // Filter KYC data
  const filteredKYC = useMemo(() => {
    return kycData.filter((kyc) => {
      const matchesSearch =
        kyc.expertName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kyc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kyc.expertId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || kyc.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [kycData, searchTerm, statusFilter]);

  // Handle actions
  const handleApprove = (id: string) => {
    setKYCData((prev) =>
      prev.map((k) =>
        k.id === id
          ? {
            ...k,
            status: "approved" as const,
            reviewedAt: new Date().toISOString().split("T")[0],
            reviewedBy: "Current Admin",
          }
          : k
      )
    );
  };

  const handleReject = (id: string, reason: string) => {
    setKYCData((prev) =>
      prev.map((k) =>
        k.id === id
          ? {
            ...k,
            status: "rejected" as const,
            reviewedAt: new Date().toISOString().split("T")[0],
            reviewedBy: "Current Admin",
            rejectionReason: reason,
          }
          : k
      )
    );
  };

  const handleMarkUnderReview = (id: string) => {
    setKYCData((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: "under_review" as const } : k))
    );
  };

  const handleViewDetails = (kyc: ExpertKYC) => {
    setSelectedKYC(kyc);
    setIsModalOpen(true);
  };

  const handleExport = () => {

    alert("Export functionality coming soon!");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <KYCHeader onExport={handleExport} />

      {/* Stats Cards */}
      <KYCStatsCards
        totalSubmissions={stats.totalSubmissions}
        pendingReview={stats.pendingReview}
        approved={stats.approved}
        rejected={stats.rejected}
      />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <KYCFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </div>

      {/* KYC Table */}
      <KYCTable
        data={filteredKYC}
        onView={handleViewDetails}
        onApprove={handleApprove}
        onReject={handleReject}
        onMarkUnderReview={handleMarkUnderReview}
      />

      {/* KYC Details Modal */}
      {selectedKYC && (
        <KYCDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          kyc={selectedKYC}
          onApprove={handleApprove}
          onReject={handleReject}
          onMarkUnderReview={handleMarkUnderReview}
        />
      )}
    </div>
  );
}
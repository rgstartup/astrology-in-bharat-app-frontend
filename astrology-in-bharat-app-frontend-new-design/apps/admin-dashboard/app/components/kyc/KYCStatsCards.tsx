import React from "react";
import { StatsCards } from "../../../../shared/components/StatsCard";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

interface KYCStatsCardsProps {
  totalSubmissions: number;
  pendingReview: number;
  approved: number;
  rejected: number;
}

export default function KYCStatsCards({
  totalSubmissions,
  pendingReview,
  approved,
  rejected,
}: KYCStatsCardsProps) {
  return (
    <StatsCards
      stats={[
        {
          title: "Total Submissions",
          value: totalSubmissions.toString(),
          icon: FileText,
          iconColor: "text-orange-600",
          iconBgColor: "bg-orange-100",
        },
        {
          title: "Pending Review",
          value: pendingReview.toString(),
          icon: Clock,
          iconColor: "text-yellow-600",
          iconBgColor: "bg-yellow-100",
        },
        {
          title: "Approved",
          value: approved.toString(),
          icon: CheckCircle,
          iconColor: "text-green-600",
          iconBgColor: "bg-green-100",
        },
        {
          title: "Rejected",
          value: rejected.toString(),
          icon: XCircle,
          iconColor: "text-red-600",
          iconBgColor: "bg-red-100",
        },
      ]}
    />
  );
}
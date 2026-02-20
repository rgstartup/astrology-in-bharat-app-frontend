import { UserCheck, Clock } from "lucide-react";
import type { Expert } from "@/app/components/expert/expert";

import sampleData from "@/public/data/sample_data.json";

export const expertsData: Expert[] = sampleData.experts as any;

// Define types
export interface ExpertStats {
  totalExperts: number;
  activeExperts: number;
  pendingExperts: number;
  totalRevenue?: number;
}

export const getStatsConfig = (data: Expert[] | ExpertStats) => {
  let stats: ExpertStats;

  // Handle array input (legacy or client-side calculation)
  if (Array.isArray(data)) {
    stats = {
      totalExperts: data.length,
      activeExperts: data.filter((e) => e.emailVerified).length,
      pendingExperts: data.filter((e) => !e.emailVerified).length,
      totalRevenue: data.reduce((acc, curr) => acc + (curr.profile_expert?.totalEarnings || 0), 0),
    };
  } else {
    // Handle object input (pre-calculated from API)
    stats = {
      totalExperts: data.totalExperts || 0,
      activeExperts: data.activeExperts || 0,
      pendingExperts: data.pendingExperts || 0,
    };
  }

  return [
    {
      title: "Total Experts",
      value: stats.totalExperts,
      icon: UserCheck,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100",
    },
    {
      title: "Active Experts",
      value: stats.activeExperts,
      icon: UserCheck,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100",
      valueColor: "text-green-600",
    },
    {
      title: "Pending Approval",
      value: stats.pendingExperts,
      icon: Clock,
      iconColor: "text-yellow-600",
      iconBgColor: "bg-yellow-100",
      valueColor: "text-yellow-600",
    },
  ];
};

export const getColumns = () => [
  {
    key: "expert",
    label: "Expert",
    render: (expert: Expert) => (
      <div className="flex items-center space-x-3">
        {expert.avatar ? (
          <img
            src={expert.avatar}
            alt={expert.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
            {expert.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-gray-900">{expert.name}</p>
          <p className="text-xs text-gray-500">{expert.profile_expert?.specialization || "General"}</p>
        </div>
      </div>
    ),
  },
  {
    key: "contact",
    label: "Contact",
    render: (expert: Expert) => (
      <div>
        <p className="text-sm text-gray-600">{expert.email}</p>
        {expert.phone && <p className="text-xs text-gray-500">{expert.phone}</p>}
      </div>
    ),
  },
  {
    key: "rating",
    label: "Rating",
    render: (expert: Expert) => (
      <div className="flex items-center space-x-1">
        <span className="text-sm font-semibold text-gray-900">{expert.profile_expert?.rating || 0}</span>
        <span className="text-xs text-yellow-500">★</span>
      </div>
    ),
  },
  {
    key: "consultations",
    label: "Consultations",
    render: (expert: Expert) => (
      <p className="text-sm text-gray-900 font-medium">{expert.profile_expert?.totalConsultations || 0}</p>
    ),
  },
  {
    key: "kycStatus",
    label: "KYC Status",
    render: (expert: Expert) => {
      const status = expert.status || "pending";
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${status === "approved"
            ? "bg-green-100 text-green-700"
            : status === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
            }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    render: (expert: Expert) => (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${expert.emailVerified
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
          }`}
      >
        {expert.emailVerified ? "Verified" : "Pending"}
      </span>
    ),
  },
];




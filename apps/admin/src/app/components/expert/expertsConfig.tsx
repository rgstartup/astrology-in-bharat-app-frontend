import { UserCheck, Clock, UserPlus, UserX } from "lucide-react";
import type { Expert } from "@/app/components/expert/expert";

import sampleData from "../../../../public/data/sample_data.json";

export const expertsData: Expert[] = sampleData.experts as any;

// Define types
export interface ExpertStats {
  totalExperts: number;
  activeExperts: number;
  pendingExperts: number;
  rejectedExperts: number;
  recentExperts: number;
  blockedExperts: number;
  totalRevenue?: number;
}

export const getStatsConfig = (data: Expert[] | ExpertStats) => {
  let stats: ExpertStats;

  // Handle array input (legacy or client-side calculation)
  if (Array.isArray(data)) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    stats = {
      totalExperts: data.length,
      activeExperts: data.filter((e) => e.profile_expert?.kyc_status === 'approved').length,
      pendingExperts: data.filter((e) => e.profile_expert?.kyc_status === 'pending').length,
      recentExperts: data.filter((e) => e.created_at && new Date(e.created_at) >= today).length,
      blockedExperts: data.filter((e) => e.is_blocked).length,
      totalRevenue: data.reduce((acc, curr) => acc + (curr.profile_expert?.total_earnings || (curr as any).totalEarnings || 0), 0),
    };
  } else {
    stats = {
      totalExperts: (data as any).totalExperts || 0,
      activeExperts: (data as any).activeExperts || 0,
      pendingExperts: (data as any).pendingExperts || 0,
      rejectedExperts: (data as any).rejectedExperts || 0,
      recentExperts: (data as any).recentExperts || 0,
      blockedExperts: (data as any).blockedExperts || 0,
    };
  }

  const baseStats = [
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
    {
      title: "Rejected Experts",
      value: stats.rejectedExperts,
      icon: UserX,
      iconColor: "text-red-600",
      iconBgColor: "bg-red-100",
      valueColor: "text-red-600",
    },
    {
      title: "Blocked Experts",
      value: stats.blockedExperts,
      icon: UserX,
      iconColor: "text-gray-600",
      iconBgColor: "bg-gray-100",
      valueColor: "text-gray-600",
    }
  ];

  return baseStats;
};

export const getColumns = (
  onToggleBlock?: (expert: Expert) => void
) => [
  {
    key: "expert",
    label: "Expert",
    render: (expert: Expert) => {
      let specialization = expert.specialization || expert.profile_expert?.specialization || "General";
      if (Array.isArray(specialization)) {
        specialization = specialization.join(' • ');
      }
      return (
        <div className="flex items-center space-x-3 max-w-[240px]">
          <div className="shrink-0">
            {expert.avatar ? (
              <img
                src={expert.avatar}
                alt={expert.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                {expert.name ? expert.name.charAt(0).toUpperCase() : "E"}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">{expert.name || "N/A"}</p>
            <p className="text-xs font-medium text-gray-700 truncate" title={typeof specialization === 'string' ? specialization : ''}>
              {specialization}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    key: "contact",
    label: "Contact",
    render: (expert: Expert) => (
      <div>
        <p className="text-sm font-medium text-gray-900">{expert.email}</p>
        {(expert.phone_number || expert.profile_expert?.phone_number) && (
          <p className="text-xs font-medium text-gray-700">{expert.phone_number || expert.profile_expert?.phone_number}</p>
        )}
      </div>
    ),
  },
  {
    key: "rating",
    label: "Rating",
    render: (expert: Expert) => (
      <div className="flex items-center space-x-1">
        <span className="text-sm font-semibold text-gray-900">
          {expert.rating || expert.profile_expert?.rating || 0}
        </span>
        <span className="text-xs text-yellow-500">★</span>
      </div>
    ),
  },
  {
    key: "consultations",
    label: "Consultations",
    render: (expert: Expert) => (
      <p className="text-sm text-gray-900 font-medium">{expert.profile_expert?.consultation_count || expert.totalConsultations || 0}</p>
    ),
  },
  {
    key: "kyc_status",
    label: "KYC Status",
    render: (expert: Expert) => {
      const status = expert.profile_expert?.kyc_status || expert.status || "pending";
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
        className={`px-3 py-1 rounded-full text-xs font-semibold ${expert.email_verified_at || (expert as any).emailVerified
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
          }`}
      >
        {expert.email_verified_at || (expert as any).emailVerified ? "Verified" : "Pending"}
      </span>
    ),
  },
  {
    key: "is_blocked",
    label: "Admin Actions",
    render: (expert: Expert) => (
      <span
        onClick={(e) => {
          e.stopPropagation();
          onToggleBlock?.(expert);
        }}
        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors hover:opacity-80 ${expert.is_blocked
            ? "bg-red-100 text-red-700"
            : "bg-gray-800 text-white"
          }`}
      >
        {expert.is_blocked ? "Unblock" : "Block"}
      </span>
    ),
  },
];




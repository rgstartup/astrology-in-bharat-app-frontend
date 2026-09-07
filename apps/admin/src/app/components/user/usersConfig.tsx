import { User as UserIcon, Gift } from "lucide-react";
import type { User } from "@/app/components/user/user";

import sampleData from "../../../../public/data/sample_data.json";

export const usersData: User[] = sampleData.users as any;

// Define types
export interface UserStats {
  totalUsers: number;
  recentUsers: number;
  blockedUsers: number;
}

export const getStatsConfig = (data: User[] | UserStats) => {
  let stats: UserStats;

  // Handle array input (legacy or client-side calculation)
  if (Array.isArray(data)) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    stats = {
      totalUsers: data.length,
      recentUsers: data.filter((u) => u.created_at && new Date(u.created_at) >= sevenDaysAgo).length,
      blockedUsers: data.filter((u) => u.is_blocked).length,
    };
  } else {
    // Handle object input (pre-calculated from API)
    stats = {
      totalUsers: data.totalUsers || 0,
      recentUsers: data.recentUsers || 0,
      blockedUsers: data.blockedUsers || 0,
    };
  }

  return [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: UserIcon,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100",
    },
    {
      title: "Recent Users",
      value: stats.recentUsers,
      icon: UserIcon,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100",
      valueColor: "text-green-600",
    },
    {
      title: "Blocked Users",
      value: stats.blockedUsers,
      icon: UserIcon,
      iconColor: "text-red-600",
      iconBgColor: "bg-red-100",
      valueColor: "text-red-600",
    },
  ];
};

export const getColumns = (
  onToggleBlock?: (user: User) => void,
  onAssignCoupon?: (user: User) => void
) => [
    {
      key: "name",
      label: "User",
      render: (user: User) => {
        const avatarUrl = user.avatar || user.profile_client?.profile_picture || user.profile_client?.avatar || user.profile_expert?.avatar;
        return (
          <div className="flex items-center space-x-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                {user.name ? user.name.charAt(0) : "U"}
              </div>
            )}
          <div>
            <p className="text-sm font-semibold text-gray-900">{user.name || "N/A"}</p>
            <p className="text-xs font-medium text-gray-700">{user.email}</p>
          </div>
        </div>
        );
      },
    },
    {
      key: "contact",
      label: "Contact",
      render: (user: User) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{user.email}</p>
          {(user.phone || user.profile_client?.phone_number) && (
            <p className="text-xs font-medium text-gray-700">{user.phone || user.profile_client?.phone_number}</p>
          )}
        </div>
      ),
    },
    {
      key: "joinDate",
      label: "Join Date",
      render: (user: User) => (
        <span className="text-sm font-medium text-gray-900">
          {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      key: "rewards",
      label: "Rewards",
      render: (user: User) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAssignCoupon?.(user);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors border border-amber-100"
        >
          <Gift size={14} className="text-amber-500" />
          <span className="text-xs font-bold">Assign</span>
        </button>
      )
    },
    {
      key: "is_blocked",
      label: "Admin Actions",
      render: (user: User) => (
        <div className="flex flex-col gap-1">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onToggleBlock?.(user);
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors hover:opacity-80 w-fit ${user.is_blocked
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
              }`}
          >
            {user.is_blocked ? "Unblock" : "Block"}
          </span>

          {/* Agar user block hai to kisne aur kab block kiya show karo */}
          {user.is_blocked && user.blocked_by_name && (
            <div className="text-[10px] text-gray-600 leading-tight">
              <span className="font-bold text-gray-800">By:</span> {user.blocked_by_name}
              {user.blocked_at && (
                <span className="block">
                  {new Date(user.blocked_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          )}
        </div>
      ),
    },
  ];





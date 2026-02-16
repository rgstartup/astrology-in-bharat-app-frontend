import { User as UserIcon, Gift } from "lucide-react";
import type { User } from "@/app/components/user/user";

export const usersData: User[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    status: "Active",
    joinDate: "2024-01-15",
    address: "123 MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    totalConsultations: 12,
    totalSpent: 5400,
    lastActive: "2 hours ago",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 2,
    name: "Priya Singh",
    email: "priya@example.com",
    phone: "+91 98765 43211",
    status: "Active",
    joinDate: "2024-01-14",
    address: "456 Park Street",
    city: "Kolkata",
    state: "West Bengal",
    dateOfBirth: "1992-08-20",
    gender: "Female",
    totalConsultations: 8,
    totalSpent: 3200,
    lastActive: "1 day ago",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit@example.com",
    phone: "+91 98765 43212",
    status: "Inactive",
    joinDate: "2024-01-13",
    address: "789 Nehru Place",
    city: "Delhi",
    state: "Delhi",
    dateOfBirth: "1988-03-10",
    gender: "Male",
    totalConsultations: 3,
    totalSpent: 1500,
    lastActive: "2 weeks ago",
    avatar: "https://i.pravatar.cc/150?img=33",
  },
  {
    id: 4,
    name: "Sneha Patel",
    email: "sneha@example.com",
    phone: "+91 98765 43213",
    status: "Active",
    joinDate: "2024-01-12",
    address: "321 Ring Road",
    city: "Ahmedabad",
    state: "Gujarat",
    dateOfBirth: "1995-12-05",
    gender: "Female",
    totalConsultations: 15,
    totalSpent: 7500,
    lastActive: "5 hours ago",
    avatar: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram@example.com",
    phone: "+91 98765 43214",
    status: "Active",
    joinDate: "2024-01-11",
    address: "654 Mall Road",
    city: "Jaipur",
    state: "Rajasthan",
    dateOfBirth: "1987-07-22",
    gender: "Male",
    totalConsultations: 20,
    totalSpent: 10000,
    lastActive: "3 hours ago",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
];

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
      recentUsers: data.filter((u) => u.createdAt && new Date(u.createdAt) >= sevenDaysAgo).length,
      blockedUsers: data.filter((u) => u.isBlocked).length,
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
      render: (user: User) => (
        <div className="flex items-center space-x-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
              {user.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      render: (user: User) => (
        <div>
          <p className="text-sm text-gray-600">{user.email}</p>
          {user.phone && <p className="text-xs text-gray-500">{user.phone}</p>}
        </div>
      ),
    },
    {
      key: "joinDate",
      label: "Join Date",
      render: (user: User) => (
        <span className="text-sm text-gray-600">
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
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
      key: "isBlocked",
      label: "Admin Actions",
      render: (user: User) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onToggleBlock?.(user);
          }}
          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors hover:opacity-80 ${user.isBlocked
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
            }`}
        >
          {user.isBlocked ? "Unblock" : "Block"}
        </span>
      ),
    },
  ];





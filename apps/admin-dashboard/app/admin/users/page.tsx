"use client";
import React, { useState, lazy, Suspense } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  User as UserIcon,
} from "lucide-react";
import { DataTable } from "@/app/components/admin/DataTable";
import { StatsCards } from "@/app/components/admin/StatsCard";

// ✅ Lazy load ProfileModal 
const ProfileModal = lazy(() => 
  import("@/app/components/admin/ProfileModal").then(module => ({
    default: module.ProfileModal
  }))
);

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  joinDate: string;
  address?: string;
  city?: string;
  state?: string;
  dateOfBirth?: string;
  gender?: "Male" | "Female" | "Other";
  totalConsultations?: number;
  totalSpent?: number;
  lastActive?: string;
  avatar?: string;
}

const ALL_USERS: User[] = [
  { id: 1, name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 98765 43210", status: "Active", joinDate: "2024-01-15", address: "123 MG Road", city: "Mumbai", state: "Maharashtra", dateOfBirth: "1990-05-15", gender: "Male", totalConsultations: 12, totalSpent: 5400, lastActive: "2 hours ago", avatar: "https://i.pravatar.cc/150?img=12" },
  { id: 2, name: "Priya Singh", email: "priya@example.com", phone: "+91 98765 43211", status: "Active", joinDate: "2024-01-14", address: "456 Park Street", city: "Kolkata", state: "West Bengal", dateOfBirth: "1992-08-20", gender: "Female", totalConsultations: 8, totalSpent: 3200, lastActive: "1 day ago", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: 3, name: "Amit Kumar", email: "amit@example.com", phone: "+91 98765 43212", status: "Inactive", joinDate: "2024-01-13", address: "789 Nehru Place", city: "Delhi", state: "Delhi", dateOfBirth: "1988-03-10", gender: "Male", totalConsultations: 3, totalSpent: 1500, lastActive: "2 weeks ago", avatar: "https://i.pravatar.cc/150?img=33" },
  { id: 4, name: "Sneha Patel", email: "sneha@example.com", phone: "+91 98765 43213", status: "Active", joinDate: "2024-01-12", address: "321 Ring Road", city: "Ahmedabad", state: "Gujarat", dateOfBirth: "1995-12-05", gender: "Female", totalConsultations: 15, totalSpent: 7500, lastActive: "5 hours ago", avatar: "https://i.pravatar.cc/150?img=9" },
  { id: 5, name: "Vikram Singh", email: "vikram@example.com", phone: "+91 98765 43214", status: "Active", joinDate: "2024-01-11", address: "654 Mall Road", city: "Jaipur", state: "Rajasthan", dateOfBirth: "1987-07-22", gender: "Male", totalConsultations: 20, totalSpent: 10000, lastActive: "3 hours ago", avatar: "https://i.pravatar.cc/150?img=15" },
];

// ✅ Loading fallback component
function ModalLoadingFallback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  const activeUsers = ALL_USERS.filter((u) => u.status === "Active").length;
  const inactiveUsers = ALL_USERS.filter((u) => u.status === "Inactive").length;

  const userStats = [
    {
      title: "Total Users",
      value: ALL_USERS.length,
      icon: UserIcon,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: UserIcon,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100",
      valueColor: "text-green-600",
    },
    {
      title: "Inactive Users",
      value: inactiveUsers,
      icon: UserIcon,
      iconColor: "text-red-600",
      iconBgColor: "bg-red-100",
      valueColor: "text-red-600",
    },
  ];

  const columns = [
    {
      key: "name",
      label: "User",
      render: (user: User) => (
        <div className="flex items-center space-x-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Contact",
      render: (user: User) => <p className="text-sm text-gray-600">{user.phone}</p>,
    },
    {
      key: "location",
      label: "Location",
      render: (user: User) => (
        <p className="text-sm text-gray-600">
          {user.city && user.state ? `${user.city}, ${user.state}` : "-"}
        </p>
      ),
    },
    {
      key: "joinDate",
      label: "Join Date",
    },
    {
      key: "status",
      label: "Status",
      render: (user: User) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            user.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.status}
        </span>
      ),
    },
  ];

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
    <>
      <DataTable
        data={ALL_USERS}
        columns={columns}
        searchKeys={["name", "email"]}
        title="User Management"
        onViewDetails={handleViewProfile}
        statsCards={<StatsCards stats={userStats} columns={3} />}
      />

      {/* ✅ Suspense wrapper with loading fallback */}
      {showModal && selectedUser && (
        <Suspense fallback={<ModalLoadingFallback />}>
          <ProfileModal
            isOpen={showModal}
            onClose={closeModal}
            avatar={selectedUser.avatar}
            name={selectedUser.name}
            badges={[
              {
                label: selectedUser.status,
                color:
                  selectedUser.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700",
              },
            ]}
            details={[
              { icon: Mail, label: "Email", value: selectedUser.email },
              { icon: Phone, label: "Phone", value: selectedUser.phone },
              {
                icon: MapPin,
                label: "Location",
                value:
                  selectedUser.city && selectedUser.state
                    ? `${selectedUser.city}, ${selectedUser.state}`
                    : "Not provided",
              },
              { icon: Calendar, label: "Join Date", value: selectedUser.joinDate },
              {
                icon: DollarSign,
                label: "Total Spent",
                value: `₹${selectedUser.totalSpent?.toLocaleString() || 0}`,
              },
              {
                icon: Clock,
                label: "Last Active",
                value: selectedUser.lastActive || "N/A",
              },
            ]}
            extraInfo={{
              label: "Total Consultations",
              value: String(selectedUser.totalConsultations || 0),
            }}
          />
        </Suspense>
      )}
    </>
  );
}
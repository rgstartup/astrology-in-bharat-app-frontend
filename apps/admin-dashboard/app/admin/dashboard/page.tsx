"use client";
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Wallet,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Search,
} from "lucide-react";

export default function DashboardPage() {
  // Stats data
  const stats = [
    {
      title: "Total Consultations",
      value: "12.5k",
      change: "+2.3%",
      period: "last week",
      isPositive: true,
      icon: Calendar,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Astrologers",
      value: "9.1k",
      change: "+9.1%",
      period: "last week",
      isPositive: true,
      icon: Clock,
      color: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Total Users",
      value: "3.2k",
      change: "-19%",
      period: "last week",
      isPositive: false,
      icon: Users,
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Earnings This Month",
      value: "₹945k",
      change: "+12%",
      period: "last week",
      isPositive: true,
      icon: Wallet,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  // Recent activities
  const activities = [
    {
      name: "Avni Pandit",
      action: "Booked a consultation",
      time: "2h ago",
      avatar: "A",
      color: "bg-yellow-600",
    },
    {
      name: "Mahesh Joshi",
      action: "Completed a session",
      time: "5h ago",
      avatar: "M",
      color: "bg-yellow-600",
    },
    {
      name: "Vijay Sharma",
      action: "Rescheduled consultation",
      time: "6h ago",
      avatar: "V",
      color: "bg-yellow-600",
    },
  ];

  // Upcoming appointments
  const appointments = [
    {
      name: "Avni Pandit",
      email: "avni@gluxaan.com",
      date: "Aug 20, 2025",
      status: "Ongoing",
      statusColor: "bg-blue-100 text-blue-700",
    },
    {
      name: "Mahesh Joshi",
      email: "mahesh@joshi.com",
      date: "Aug 18, 2025",
      status: "Completed",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      name: "Vijay Sharma",
      email: "vijay@aug.com",
      date: "Aug 15, 2025",
      status: "Cancelled",
      statusColor: "bg-red-100 text-red-700",
    },
    {
      name: "Yash Bhagat",
      email: "yash@bhagat.com",
      date: "Aug 12, 2025",
      status: "Completed",
      statusColor: "bg-green-100 text-green-700",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  {stat.value}
                </h3>
                <div className="flex items-center space-x-1">
                  {stat.isPositive ? (
                    <ArrowUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      stat.isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500">{stat.period}</span>
                </div>
              </div>
              <div
                className={`${stat.color} p-3 rounded-lg flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h5 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h5>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`${activity.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0`}
                  >
                    {activity.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.name}</span>{" "}
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h5 className="text-lg font-semibold text-gray-900">
                Upcoming Appointments
              </h5>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent w-64"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appointments
                    .filter(
                      (apt) =>
                        apt.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        apt.email
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    )
                    .map((appointment, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            {appointment.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {appointment.email}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {appointment.date}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${appointment.statusColor}`}
                          >
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
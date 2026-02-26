'use client'
import React, { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/utils/cn";


export const UpcomingAppointments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const users = [
    { name: "Avni Pandit", email: "avni@gluxaan.com", date: "Aug 20, 2025", status: "Ongoing" },
    { name: "Mahesh Joshi", email: "mahesh@ioshi.com", date: "Aug 18, 2025", status: "Completed" },
    { name: "Vijay Sharma", email: "vijay@taug.com", date: "Aug 15, 2025", status: "Cancelled" },
    { name: "Yash Bhagat", email: "yash@bhagat.com", date: "Aug 12, 2025", status: "Completed" },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
        <div className="flex items-center space-x-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none w-64 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Registration Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              {/* <th className="text-right py-3 px-4 font-medium text-gray-700">Action</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50 text-sm">
                  <td className="py-4 px-4 font-medium text-gray-900">{user.name}</td>
                  <td className="py-4 px-4 text-gray-600">{user.email}</td>
                  <td className="py-4 px-4 text-gray-600">{user.date}</td>
                  <td className="py-4 px-4">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-xl text-xs font-medium",
                        user.status === "Ongoing" && "bg-blue-100 text-blue-800",
                        user.status === "Completed" && "bg-green-100 text-green-800",
                        user.status === "Cancelled" && "bg-red-100 text-red-800"
                      )}
                    >
                      {user.status}
                    </span>
                  </td>
                  {/* <td className="py-4 px-4 text-right">
                    <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 transition-colors">
                      View Details
                    </button>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500 text-sm">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};



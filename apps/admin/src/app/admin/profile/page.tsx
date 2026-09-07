"use client";

import React from "react";
import { User, Mail, Shield, Calendar } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const UserComp = User as any;
const MailComp = Mail as any;
const ShieldComp = Shield as any;
const CalendarComp = Calendar as any;

export default function AdminProfilePage() {
    const { user } = useAuthStore();

    // Determine the highest role to display
    const roles = user?.roles || [];
    let displayRole = "Admin";
    if (roles.includes("super_admin") || user?.role === "super_admin") displayRole = "Super Admin";
    else if (roles.includes("sub_admin") || user?.role === "sub_admin") displayRole = "Sub Admin";

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Profile Management</h1>
                <p className="text-sm sm:text-base font-medium text-gray-700">View your admin account details</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserComp className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600" />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{user?.name || "Administrator"}</h2>
                        <p className="text-sm sm:text-base font-medium text-gray-700">{displayRole}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Email */}
                    <div className="flex items-center space-x-3 sm:space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <MailComp className="w-5 h-5 text-gray-700 flex-shrink-0" />
                        <div className="overflow-hidden">
                            <p className="text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider mb-0.5">Email Address</p>
                            <p className="text-sm sm:text-base font-medium text-gray-800 truncate">{user?.email || "—"}</p>
                        </div>
                    </div>

                    {/* Role */}
                    <div className="flex items-center space-x-3 sm:space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <ShieldComp className="w-5 h-5 text-gray-700 flex-shrink-0" />
                        <div>
                            <p className="text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider mb-0.5">Role</p>
                            <p className="text-sm sm:text-base font-medium text-gray-800">{displayRole}</p>
                        </div>
                    </div>

                    {/* Joined Date */}
                    <div className="flex items-center space-x-3 sm:space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <CalendarComp className="w-5 h-5 text-gray-700 flex-shrink-0" />
                        <div>
                            <p className="text-xs sm:text-sm font-black text-gray-700 uppercase tracking-wider mb-0.5">Member Since</p>
                            <p className="text-sm sm:text-base font-medium text-gray-800">
                                {user?.created_at
                                    ? new Date(user.created_at).toLocaleDateString("en-US", {
                                          month: "long",
                                          year: "numeric",
                                      })
                                    : "Account created recently"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}





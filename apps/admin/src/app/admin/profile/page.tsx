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
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Profile Management</h1>
                    <p className="text-gray-600">View your admin account details</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                            <UserComp className="w-10 h-10 text-yellow-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">{user?.name || "Administrator"}</h2>
                            <p className="text-gray-600">{displayRole}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Email */}
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            <MailComp className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-600">Email Address</p>
                                <p className="font-medium text-gray-800">{user?.email || "—"}</p>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            <ShieldComp className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-600">Role</p>
                                <p className="font-medium text-gray-800">{displayRole}</p>
                            </div>
                        </div>

                        {/* Joined Date */}
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            <CalendarComp className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-600">Member Since</p>
                                <p className="font-medium text-gray-800">
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
        </div>
    );
}





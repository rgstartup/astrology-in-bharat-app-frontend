"use client";

import React from "react";
import { User, Mail, Shield, Calendar } from "lucide-react";
import { Button } from "@repo/ui";

const UserComp = User as any;
const MailComp = Mail as any;
const ShieldComp = Shield as any;
const CalendarComp = Calendar as any;

export default function AdminProfilePage() {
    // Mock admin data - replace with actual API call
    const adminData = {
        name: "Admin User",
        email: "admin@astrologyinbharat.com",
        role: "Super Admin",
        joinedDate: "January 2024",
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Profile Management</h1>
                    <p className="text-gray-600">Manage your admin account settings</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                            <UserComp className="w-10 h-10 text-yellow-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">{adminData.name}</h2>
                            <p className="text-gray-600">{adminData.role}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Email */}
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            <MailComp className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-600">Email Address</p>
                                <p className="font-medium text-gray-800">{adminData.email}</p>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            <ShieldComp className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-600">Role</p>
                                <p className="font-medium text-gray-800">{adminData.role}</p>
                            </div>
                        </div>

                        {/* Joined Date */}
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            <CalendarComp className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-600">Member Since</p>
                                <p className="font-medium text-gray-800">{adminData.joinedDate}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex space-x-4">
                        <Button variant="primary">
                            Edit Profile
                        </Button>
                        <Button variant="outline">
                            Change Password
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}





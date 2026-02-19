"use client";
import React from "react";
import { useAgentAuthStore } from "@/src/store/useAgentAuthStore";
import { Avatar, Button } from "@repo/ui";
import { Phone, Mail, BadgeCheck, User, CreditCard } from "lucide-react";
import { toast } from "react-toastify";

import { useEffect, useState } from "react";
import { getAgentProfile, updateAgentProfile } from "@/src/services/agent.service";
import { Loading } from "@repo/ui";

export default function ProfilePage() {
    const { agent, setAgent } = useAgentAuthStore() as any;
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getAgentProfile();
                setProfileData(data);
                if (setAgent) setAgent(data); // Sync store if possible
            } catch (error) {
                console.error("Failed to fetch profile", error);
                toast.error("Failed to load profile details");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [setAgent]);

    const INFO = [
        { label: "Agent ID", value: profileData?.agent_id ?? agent?.agent_id ?? "—", icon: BadgeCheck, color: "text-primary-hover" },
        { label: "Email", value: profileData?.email ?? agent?.email ?? "—", icon: Mail, color: "text-blue-600" },
        { label: "Phone", value: profileData?.phone ?? agent?.phone ?? "—", icon: Phone, color: "text-green-600" },
        { label: "Status", value: profileData?.status ?? agent?.status ?? "—", icon: User, color: "text-purple-600" },
    ];

    const COMMISSION_RATES = [
        { label: "Astrologer Referral", rate: "10%", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
        { label: "Mandir Listing", rate: "8%", className: "bg-orange-50 text-orange-700 border-orange-200" },
        { label: "Puja Shop Referral", rate: "12%", className: "bg-purple-50 text-purple-700 border-purple-200" },
    ];

    if (loading) return <Loading fullScreen text="Loading Profile..." />;

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            {/* Profile Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Banner */}
                <div className="h-28 bg-gradient-to-r from-primary to-primary-hover" />
                <div className="px-8 pb-8 -mt-10">
                    <div className="flex items-end justify-between mb-4">
                        {/* @repo/ui Avatar */}
                        <div className="ring-4 ring-white rounded-full shadow-xl">
                            <Avatar
                                src={agent?.avatar ?? null}
                                alt={agent?.name ?? "Agent"}
                                size="xl"
                                className="!w-20 !h-20"
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toast.info("Profile editing coming soon!")}
                        >
                            Edit Profile
                        </Button>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">{agent?.name ?? "Agent"}</h2>
                    <p className="text-sm text-primary-hover font-bold mt-0.5">Field Agent — AstrologyInBharat</p>

                    <div className="mt-6 grid sm:grid-cols-2 gap-4">
                        {INFO.map(({ label, value, icon: Icon, color }) => (
                            <div key={label} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <div className={`w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0 ${color}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                                    <p className="text-sm font-bold text-gray-800 capitalize">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Commission Rates */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-5">Your Commission Rates</h3>
                <div className="space-y-3">
                    {COMMISSION_RATES.map(({ label, rate, className }) => (
                        <div key={label} className={`flex items-center justify-between p-4 rounded-xl border ${className}`}>
                            <div className="flex items-center gap-3">
                                <CreditCard className="w-4 h-4" />
                                <span className="text-sm font-semibold">{label}</span>
                            </div>
                            <span className="text-lg font-black">{rate}</span>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-gray-400 mt-4 font-medium">
                    * Commission rates are set by Admin and may change periodically.
                </p>
            </div>

            {/* Bank Details */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Bank / Payout Details</h3>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info("Bank details editing coming soon!")}
                    >
                        Edit
                    </Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    {[
                        { label: "Bank Name", value: "State Bank of India" },
                        { label: "Account No.", value: "XXXX1234" },
                        { label: "IFSC Code", value: "SBIN0001234" },
                        { label: "UPI ID", value: "agent@upi" },
                    ].map(({ label, value }) => (
                        <div key={label} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                            <p className="text-sm font-bold text-gray-800 mt-0.5 font-mono">{value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

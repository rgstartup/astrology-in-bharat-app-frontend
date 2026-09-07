"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useAgentAuthStore } from "@/store/useAgentAuthStore";
import { Avatar, Button } from "@repo/ui";
import { ProfileSkeleton } from "../../components/Skeleton";
import { Phone, Mail, BadgeCheck, User, CreditCard, Landmark, PiggyBank, Hash, UserCircle2, Save, X } from "lucide-react";
import { toast } from "react-toastify";
import { getAgentProfile, updateAgentProfile } from "@/services/agent.service";
import { BankDetailsCard } from "./components/BankDetailsCard";
import { getErrorMessage } from "@repo/lib/utils/error";

export default function ProfilePage() {
    const { agent, setAgent } = useAgentAuthStore() as any;
    const [loading, setLoading] = useState(!agent);
    const [isEditingBank, setIsEditingBank] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        bank_name: agent?.bank_name || "",
        account_number: agent?.account_number || "",
        ifsc_code: agent?.ifsc_code || "",
        account_holder: agent?.account_holder || "",
    });

    const fetchProfile = async () => {
        if (!agent) setLoading(true);
        try {
            const [data, error] = await getAgentProfile();
            if (error) {
                toast.error(getErrorMessage(error) || "Failed to load profile details");
                return;
            }
            if (data) {
                if (setAgent) setAgent(data);
                setFormData({
                    bank_name: data.bank_name || "",
                    account_number: data.account_number || "",
                    ifsc_code: data.ifsc_code || "",
                    account_holder: data.account_holder || "",
                });
            }
        } catch (error) {
            console.error("Failed to fetch profile", getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSaveBankDetails = async (e: any) => {
        if (e && e.preventDefault) e.preventDefault();
        setSaving(true);
        try {
            // Check if we have bulk bank accounts data from the new UI
            const dataToSave = e?.target?.bank_accounts
                ? { ...formData, bank_accounts: e.target.bank_accounts }
                : formData;

            const [res, err] = await updateAgentProfile(dataToSave as any);
            if (err) {
                toast.error(getErrorMessage(err) || "Failed to update bank details");
            } else {
                toast.success("Bank details updated successfully");
                setIsEditingBank(false);
                if (setAgent && agent) {
                    setAgent({ ...agent, ...dataToSave });
                }
            }
        } catch (error) {
            toast.error(getErrorMessage(error) || "An error occurred while saving");
        } finally {
            setSaving(false);
        }
    };

    const INFO = useMemo(() => [
        { label: "Agent ID", value: agent?.uid ?? agent?.id ?? "—", icon: BadgeCheck, color: "text-primary-hover" },
        { label: "Email", value: agent?.user?.email ?? agent?.email ?? "—", icon: Mail, color: "text-blue-600" },
        { label: "Phone", value: agent?.phone ?? agent?.user?.phone ?? "—", icon: Phone, color: "text-green-600" },
        { label: "Status", value: agent?.status ?? "Active", icon: User, color: "text-purple-600" },
    ], [agent]);

    const COMMISSION_RATES = [
        { label: "Expert Referral", rate: "3%", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
        { label: "User Wallet Usage", rate: "3%", className: "bg-blue-50 text-blue-700 border-blue-200" },
        { label: "Puja Shop Referral", rate: "3%", className: "bg-purple-50 text-purple-700 border-purple-200" },
    ];

    if (loading) return <ProfileSkeleton />;

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Profile Header */}
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary via-primary-hover to-primary" />
                <div className="px-10 pb-10 -mt-12">
                    <div className="flex items-end justify-between mb-6">
                        <div className="ring-8 ring-white rounded-full shadow-2xl overflow-hidden bg-white">
                            <Avatar
                                src={agent?.avatar ?? agent?.user?.avatar ?? null}
                                alt={agent?.user?.name ?? "Agent"}
                                size="xl"
                                className="!w-24 !h-24 object-cover"
                            />
                        </div>
                        <Button
                            variant="primary"
                            size="md"
                            className="rounded-2xl shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px]"
                            onClick={() => toast.info("General info editing restricted. Contact Admin.")}
                        >
                            Account Settings
                        </Button>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">{agent?.user?.name ?? "Agent"}</h2>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Field Agent</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-gray-1000 uppercase tracking-widest">Verified Partner</span>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {INFO.map(({ label, value, icon: Icon, color }) => (
                            <div key={label} className="group p-5 rounded-3xl bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-orange-200/50 transition-all duration-300 relative overflow-hidden border-2 border-[#F25E0A] hover:border-[#F25E0A]">
                                <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <p className="text-[10px] font-black text-gray-1000 uppercase tracking-widest mb-1">{label}</p>
                                <p className="text-sm font-bold text-gray-800 break-all">{value}</p>

                                {/* Orange Bottom Bar - Shows only on hover */}
                                <div className="absolute bottom-0 left-0 h-1.5 w-full bg-[#F25E0A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Bank Details Section */}
                <div className="lg:col-span-3">
                    <BankDetailsCard
                        agent={agent}
                        isEditing={isEditingBank}
                        setIsEditing={setIsEditingBank}
                        formData={formData}
                        setFormData={setFormData}
                        onSave={handleSaveBankDetails}
                        saving={saving}
                    />
                </div>

                {/* Commission Rates Card */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden h-full">
                        <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Earnings Structure</h3>
                            <p className="text-[10px] font-bold text-gray-1000 uppercase tracking-widest">Commission Percentages</p>
                        </div>
                        <div className="p-8 space-y-4">
                            {COMMISSION_RATES.map(({ label, rate, className }) => (
                                <div key={label} className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${className}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-xl bg-white/50">
                                            <CreditCard className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-tight">{label}</span>
                                    </div>
                                    <span className="text-2xl font-black">{rate}</span>
                                </div>
                            ))}

                            <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                <p className="text-[10px] text-blue-700 font-bold leading-relaxed">
                                    ℹ️ Commissions are credited to your wallet in real-time as soon as the session or order is completed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

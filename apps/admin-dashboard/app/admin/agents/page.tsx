"use client";
import React, { useState, useMemo, lazy, Suspense, useEffect, useCallback } from "react";
import {
    Plus, BookOpen, Star, ShoppingBag, Building2, X,
    User, Phone, Mail, Handshake, MapPin, CreditCard, FileText, Upload, Camera
} from "lucide-react";

import { DataTable } from "@/app/components/admin/DataTable";
import { StatsCards, Loading, Button } from "@repo/ui";
import { getStatsConfig, getColumns } from "@/app/components/agent/agentsConfig";
import { getAgentProfileModalProps } from "@/app/components/agent/agentsModalConfig";
import type { Agent, AgentStats, AgentListing } from "@/app/components/agent/agent";
import { getAgents, getAgentStats, getAllListings, createAgent, sendAgentOtp, verifyAgentOtp } from "@/src/services/agent.service";
import { toast } from "react-toastify";

const ProfileModal = lazy(() =>
    import("@/app/components/admin/ProfileModal").then((m) => ({ default: m.ProfileModal }))
);

// ── Listing table columns ─────────────────────────────────────
const TYPE_LABEL: Record<string, { label: string; className: string }> = {
    astrologer: { label: "Astrologer", className: "bg-yellow-100 text-yellow-700" },
    mandir: { label: "Mandir", className: "bg-orange-100 text-orange-700" },
    puja_shop: { label: "Puja Shop", className: "bg-purple-100 text-purple-700" },
};
const STATUS_CLASS: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-600",
    pending: "bg-yellow-100 text-yellow-700",
};
const LISTING_COLUMNS = [
    {
        key: "listing_name", label: "Listing Name", render: (l: AgentListing) => (
            <div>
                <p className="text-sm font-semibold text-gray-900">{l.listing_name}</p>
                <p className="text-xs text-gray-500">{l.listing_location || "—"}</p>
            </div>
        )
    },
    {
        key: "type", label: "Type", render: (l: AgentListing) => {
            const t = TYPE_LABEL[l.listing_type];
            return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${t.className}`}>{t.label}</span>;
        }
    },
    {
        key: "agent", label: "Agent ID", render: (l: AgentListing) => (
            <span className="text-xs font-mono text-gray-600">{l.agent_id}</span>
        )
    },
    {
        key: "contact", label: "Contact", render: (l: AgentListing) => (
            <p className="text-sm text-gray-700">{l.listing_contact || "—"}</p>
        )
    },
    {
        key: "status", label: "Status", render: (l: AgentListing) => (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_CLASS[l.status]}`}>{l.status}</span>
        )
    },
    {
        key: "date", label: "Listed On", render: (l: AgentListing) => (
            <p className="text-sm text-gray-500">
                {new Date(l.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
        )
    },
];


// ── Add Agent Modal ───────────────────────────────────────────
const EMPTY_FORM = {
    name: "", email: "", phone: "", avatar: "",
    address: "", city: "", state: "",
    aadhaar_no: "", pan_no: "", commission_rate: "",
    aadhaar_doc: null as File | null,
    pan_doc: null as File | null,
    profile_pic: null as File | null,
};

function AddAgentModal({ isOpen, onClose, onSuccess }: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(false);

    // OTP State
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setForm(EMPTY_FORM);
            setIsOtpSent(false);
            setIsOtpVerified(false);
            setOtp("");
        }
    }, [isOpen]);

    const handleSendOtp = async () => {
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        setOtpLoading(true);
        try {
            await sendAgentOtp(form.email);
            setIsOtpSent(true);
            toast.info("OTP sent to email");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length < 4) {
            toast.error("Please enter a valid OTP");
            return;
        }
        setOtpLoading(true);
        try {
            await verifyAgentOtp(form.email, otp);
            setIsOtpVerified(true);
            toast.success("Email Verified Successfully!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Invalid OTP");
        } finally {
            setOtpLoading(false);
        }
    };

    const set = (key: keyof typeof EMPTY_FORM) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setForm(f => ({ ...f, [key]: e.target.value }));

    const setFile = (key: "aadhaar_doc" | "pan_doc" | "profile_pic") =>
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setForm(f => ({ ...f, [key]: e.target.files?.[0] ?? null }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim()) {
            toast.error("Please fill required fields (Name/Email)");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("email", form.email);
            formData.append("phone", form.phone);
            formData.append("address", form.address);
            formData.append("city", form.city);
            formData.append("state", form.state);
            formData.append("aadhaar_no", form.aadhaar_no);
            formData.append("pan_no", form.pan_no);

            if (form.profile_pic) formData.append("profile_pic", form.profile_pic);
            if (form.aadhaar_doc) formData.append("aadhaar_doc", form.aadhaar_doc);
            if (form.pan_doc) formData.append("pan_doc", form.pan_doc);

            await createAgent(formData);
            toast.success("Agent created successfully!");
            setForm(EMPTY_FORM);
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Agent creation failed", error);
            toast.error(error.response?.data?.message || "Failed to create agent");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const inputCls = "w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all placeholder-gray-400";
    const labelCls = "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5";
    const sectionCls = "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 pb-2 border-b border-gray-100";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10 max-h-[90vh] flex flex-col">

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
                            <Handshake className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">Add New Agent</h3>
                            <p className="text-xs text-gray-400">Agent ID will be auto-generated after creation</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* ── Scrollable body ── */}
                <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6">
                    <form id="add-agent-form" onSubmit={handleSubmit}>
                        <div className="space-y-6">

                            {/* ── Section 1: Basic Details ── */}
                            <div>
                                <p className={sectionCls}><User className="w-3 h-3" /> Basic Details</p>

                                {/* Profile Picture Upload */}
                                <div className="flex flex-col items-center mb-6">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                            {form.profile_pic ? (
                                                <img src={URL.createObjectURL(form.profile_pic)} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-8 h-8 text-gray-300" />
                                            )}
                                        </div>
                                        <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-primary-hover transition-all transform hover:scale-105">
                                            <Camera className="w-3.5 h-3.5" />
                                            <input type="file" accept="image/*" className="hidden" onChange={setFile("profile_pic")} />
                                        </label>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-wide">Profile Photo</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Name */}
                                    <div>
                                        <label className={labelCls}>Full Name *</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input required placeholder="e.g. Ramesh Kumar"
                                                value={form.name} // Bind to form state
                                                onChange={set("name")}
                                                className={inputCls}
                                            />
                                        </div>
                                    </div>

                                    {/* Email & OTP Verification */}
                                    <div className="sm:col-span-2 space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <label className={labelCls}>Email Verification *</label>
                                        <div className="flex gap-2 items-center">
                                            <div className="relative flex-1">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="agent@example.com"
                                                    value={form.email}
                                                    onChange={set("email")}
                                                    className={`${inputCls} ${isOtpVerified ? "bg-green-50 border-green-200 text-green-700" : "bg-white"}`}
                                                    readOnly={isOtpSent || isOtpVerified}
                                                />
                                                {isOtpVerified && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 font-bold text-xs bg-green-100 px-2 py-1 rounded">Verified</span>}
                                            </div>
                                            {!isOtpVerified && (
                                                <Button
                                                    type="button"
                                                    disabled={otpLoading || isOtpSent || !form.email}
                                                    onClick={handleSendOtp} // Correctly calling send func
                                                    variant="primary"
                                                    size="sm"
                                                >
                                                    {otpLoading && !isOtpSent ? "Sending..." : isOtpSent ? "OTP Sent" : "Send OTP"}
                                                </Button>
                                            )}
                                        </div>

                                        {isOtpSent && !isOtpVerified && (
                                            <div className="flex gap-2 items-center animate-in fade-in slide-in-from-top-2 duration-300">
                                                <input
                                                    type="text"
                                                    placeholder="Enter 6-digit OTP"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                                    maxLength={6}
                                                />
                                                <Button
                                                    type="button"
                                                    disabled={otpLoading}
                                                    onClick={handleVerifyOtp} // Correctly calling verify func
                                                    variant="secondary"
                                                    size="sm"
                                                    className="whitespace-nowrap"
                                                >
                                                    {otpLoading ? "Verifying..." : "Verify OTP"}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    {/* Phone */}
                                    <div>
                                        <label className={labelCls}>Phone Number *</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input required placeholder="10-digit mobile"
                                                value={form.phone} // Bind to form state
                                                onChange={set("phone")}
                                                className={inputCls}
                                                pattern="[0-9]{10}"
                                                maxLength={10}
                                            />
                                        </div>
                                    </div>
                                    {/* State */}
                                    <div>
                                        <label className={labelCls}>State</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <select value={form.state} onChange={set("state")}
                                                className={inputCls + " appearance-none"}>
                                                <option value="">Select State</option>
                                                {["Uttar Pradesh", "Rajasthan", "Maharashtra", "Madhya Pradesh", "Gujarat", "Delhi", "Bihar", "West Bengal", "Karnataka", "Tamil Nadu", "Andhra Pradesh", "Telangana", "Odisha", "Punjab", "Haryana", "Jharkhand", "Uttarakhand", "Himachal Pradesh", "Chhattisgarh", "Assam"].sort().map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {/* City */}
                                    <div>
                                        <label className={labelCls}>City</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input placeholder="e.g. Varanasi" value={form.city}
                                                onChange={set("city")} className={inputCls} />
                                        </div>
                                    </div>
                                    {/* Address — full width */}
                                    <div className="sm:col-span-2">
                                        <label className={labelCls}>Full Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <textarea placeholder="House no., Street, Area..." value={form.address}
                                                onChange={set("address")} rows={2}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all placeholder-gray-400 resize-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Section 2: KYC / Identity ── */}
                            <div>
                                <p className={sectionCls}><CreditCard className="w-3 h-3" /> KYC / Identity</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Aadhaar No */}
                                    <div>
                                        <label className={labelCls}>Aadhaar Number</label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input placeholder="XXXX XXXX XXXX" value={form.aadhaar_no}
                                                onChange={set("aadhaar_no")} className={inputCls}
                                                maxLength={14} pattern="\d{4}\s?\d{4}\s?\d{4}" />
                                        </div>
                                    </div>
                                    {/* PAN No */}
                                    <div>
                                        <label className={labelCls}>PAN Number</label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input placeholder="ABCDE1234F" value={form.pan_no}
                                                onChange={set("pan_no")} className={inputCls}
                                                maxLength={10} style={{ textTransform: "uppercase" }} />
                                        </div>
                                    </div>
                                    {/* Commission Rate */}
                                    <div>
                                        <label className={labelCls}>Commission Rate (%)</label>
                                        <div className="relative">
                                            <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input type="number" placeholder="e.g. 10" value={form.commission_rate}
                                                onChange={set("commission_rate")} className={inputCls} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Section 3: Documents ── */}
                            <div>
                                <p className={sectionCls}><Upload className="w-3 h-3" /> Document Uploads</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Aadhaar Doc */}
                                    <div>
                                        <label className={labelCls}>Aadhaar Card (PDF/IMG)</label>
                                        <label className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 cursor-pointer hover:border-gray-900 hover:text-gray-700 transition-all">
                                            <Upload className="w-4 h-4 flex-shrink-0" />
                                            <span className="truncate">
                                                {form.aadhaar_doc ? form.aadhaar_doc.name : "Click to upload Aadhaar"}
                                            </span>
                                            <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                                                onChange={setFile("aadhaar_doc")} />
                                        </label>
                                    </div>
                                    {/* PAN Doc */}
                                    <div>
                                        <label className={labelCls}>PAN Card (PDF/IMG)</label>
                                        <label className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 cursor-pointer hover:border-gray-900 hover:text-gray-700 transition-all">
                                            <Upload className="w-4 h-4 flex-shrink-0" />
                                            <span className="truncate">
                                                {form.pan_doc ? form.pan_doc.name : "Click to upload PAN Card"}
                                            </span>
                                            <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                                                onChange={setFile("pan_doc")} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* ── Footer with buttons ── */}
                <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0 bg-gray-50 rounded-b-2xl">
                    <Button type="submit" form="add-agent-form" variant="primary" fullWidth loading={loading} icon={Plus} disabled={!isOtpVerified}>
                        Create Agent
                    </Button>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ── Listing Stats ─────────────────────────────────────────────
const getListingStats = (data: AgentListing[]) => [
    { title: "Total Listings", value: data.length, icon: BookOpen, iconColor: "text-blue-600", iconBgColor: "bg-blue-100" },
    { title: "Astrologers", value: data.filter(l => l.listing_type === "astrologer").length, icon: Star, iconColor: "text-yellow-600", iconBgColor: "bg-yellow-100" },
    { title: "Mandirs", value: data.filter(l => l.listing_type === "mandir").length, icon: Building2, iconColor: "text-orange-600", iconBgColor: "bg-orange-100" },
    { title: "Puja Shops", value: data.filter(l => l.listing_type === "puja_shop").length, icon: ShoppingBag, iconColor: "text-purple-600", iconBgColor: "bg-purple-100" },
];

// ── Main Page ─────────────────────────────────────────────────
type TabType = "agents" | "listings";

export default function AgentsPage() {
    const [tab, setTab] = useState<TabType>("agents");

    // Agents state
    const [agents, setAgents] = useState<Agent[]>([]);
    const [stats, setStats] = useState<AgentStats>({ totalAgents: 0, activeAgents: 0, totalListings: 0, pendingPayouts: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Listings state
    const [listings, setListings] = useState<AgentListing[]>([]);
    const [listLoading, setListLoading] = useState(false);
    const [typeFilter, setTypeFilter] = useState("");
    const [listSearch, setListSearch] = useState("");
    const [allListings, setAllListings] = useState<AgentListing[]>([]);

    const fetchStats = useCallback(async () => {
        try {
            const res = await getAgentStats();
            setStats(res);
        } catch (error) {
            console.error("Failed to fetch agent stats", error);
        }
    }, []);

    const fetchAgents = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await getAgents({
                search: searchQuery,
                page,
                limit: 10,
                status: statusFilter
            });
            setAgents(res.data || []);
            setTotal(res.total || 0);
        } catch (error) {
            console.error("Failed to fetch agents", error);
            setAgents([]);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, page, statusFilter]);

    const fetchListings = useCallback(async () => {
        try {
            setListLoading(true);
            const res = await getAllListings({
                type: typeFilter,
                search: listSearch
            });
            setListings(res.data || []);
        } catch (error) {
            console.error("Failed to fetch listings", error);
        } finally {
            setListLoading(false);
        }
    }, [typeFilter, listSearch]);

    useEffect(() => { fetchStats(); }, [fetchStats]);
    useEffect(() => {
        const t = setTimeout(fetchAgents, 400);
        return () => clearTimeout(t);
    }, [fetchAgents]);

    useEffect(() => {
        getAllListings({})
            .then(r => setAllListings(r.data || []))
            .catch(() => { });
    }, []);

    useEffect(() => {
        const t = setTimeout(fetchListings, 400);
        return () => clearTimeout(t);
    }, [fetchListings]);

    const handleRefresh = useCallback(() => {
        fetchStats();
        fetchAgents();
    }, [fetchStats, fetchAgents]);

    const statsConfig = useMemo(() => getStatsConfig(stats), [stats]);
    const columns = useMemo(() => getColumns(), []);
    const listingStats = useMemo(() => getListingStats(allListings), [allListings]);

    return (
        <>
            {/* Tab Switcher */}
            <div className="flex items-center gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
                {(["agents", "listings"] as TabType[]).map((t) => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}>
                        {t === "agents" ? "👤 Agent Management" : "📋 Agent Listings"}
                    </button>
                ))}
            </div>

            {/* ── AGENTS TAB ── */}
            {tab === "agents" && (
                <>
                    <DataTable
                        data={agents}
                        columns={columns}
                        searchKeys={["name", "email", "agent_id"]}
                        title="Agent Management"
                        onViewDetails={(agent) => setSelectedAgent(agent)}
                        statsCards={<StatsCards stats={statsConfig} columns={4} />}
                        onSearch={(q) => { setSearchQuery(q); setPage(1); }}
                        isLoading={isLoading}
                        manualPagination
                        totalItems={total}
                        onPageChange={setPage}
                        headerAction={
                            <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowAddModal(true)}>
                                Add Agent
                            </Button>
                        }
                        filterElement={
                            <select value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                className="w-36 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 font-medium">
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        }
                    />
                    {selectedAgent && (
                        <Suspense fallback={<Loading fullScreen size="lg" text="Loading..." />}>
                            <ProfileModal {...getAgentProfileModalProps(selectedAgent)} isOpen
                                onClose={() => setSelectedAgent(null)} action2Label="Close" />
                        </Suspense>
                    )}
                    <AddAgentModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={handleRefresh} />
                </>
            )}

            {/* ── LISTINGS TAB ── */}
            {tab === "listings" && (
                <DataTable
                    data={listings}
                    columns={LISTING_COLUMNS as any}
                    searchKeys={["listing_name", "agent_id"] as any}
                    title="Agent Listings"
                    statsCards={<StatsCards stats={listingStats} columns={4} />}
                    onSearch={(q) => setListSearch(q)}
                    isLoading={listLoading}
                    filterElement={
                        <select value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-40 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 font-medium">
                            <option value="">All Types</option>
                            <option value="astrologer">Astrologer</option>
                            <option value="mandir">Mandir</option>
                            <option value="puja_shop">Puja Shop</option>
                        </select>
                    }
                />
            )}
        </>
    );
}

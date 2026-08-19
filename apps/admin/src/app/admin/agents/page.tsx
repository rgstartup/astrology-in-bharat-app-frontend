"use client";
import React, { useState, useMemo, lazy, Suspense, useEffect, useCallback } from "react";
import {
    Plus, BookOpen, Star, ShoppingBag, Building2, X,
    User, Phone, Mail, Handshake, MapPin, CreditCard, FileText, Upload, Camera, Settings, Save, Loader2
} from "lucide-react";
import { getCommissionSettings, updateCommissionSettings } from "@/services/admin.service";
import { fetchStates, fetchDistricts, State, District } from "@/lib/api-locations";

import { DataTable } from "@/app/components/admin/DataTable";
import { StatsCards, Loading, Button } from "@repo/ui";
import { getStatsConfig, getColumns } from "@/app/components/agent/agentsConfig";
import { getAgentProfileModalProps } from "@/app/components/agent/agentsModalConfig";
import type { Agent, AgentStats, AgentListing } from "@/app/components/agent/agent";
import { getAgents, getAgentStats, getAllListings, createAgent, sendAgentOtp, verifyAgentOtp } from "@/services/agent.service";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib/utils/error";

const ProfileModal = lazy(() =>
    import("@/app/components/admin/ProfileModal").then((m) => ({ default: m.ProfileModal }))
);

// ── Listing table columns ─────────────────────────────────────
const TYPE_LABEL: Record<string, { label: string; className: string }> = {
    expert: { label: "Expert", className: "bg-yellow-100 text-yellow-700" },
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
            <p className="text-sm text-gray-700">{l.phone || "—"}</p>
        )
    },
    {
        key: "status", label: "Status", render: (l: AgentListing) => (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_CLASS[l.status]}`}>{l.status}</span>
        )
    },
    {
        key: "date", label: "Listed On", render: (l: AgentListing) => (
            <p className="text-sm text-gray-500" suppressHydrationWarning>
                {new Date(l.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
        )
    },
];


// ── Add Agent Modal ───────────────────────────────────────────
const EMPTY_FORM = {
    name: "", email: "", phone: "", password: "",
    address: "", district: "", state: "",
    aadhaar_no: "", pan_no: "",
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
    const [showPassword, setShowPassword] = useState(false);

    // Location data
    const [statesList, setStatesList] = useState<State[]>([]);
    const [districtsList, setDistrictsList] = useState<District[]>([]);
    const [loadingDistricts, setLoadingDistricts] = useState(false);

    // Fetch states on mount
    useEffect(() => {
        fetchStates().then(res => setStatesList(res));
    }, []);

    // Fetch districts when state changes
    useEffect(() => {
        if (!form.state) {
            setDistrictsList([]);
            setForm(f => ({ ...f, district: "" }));
            return;
        }
        const selectedState = statesList.find(s => s.name === form.state);
        if (selectedState) {
            setLoadingDistricts(true);
            fetchDistricts(selectedState.id)
                .then(res => setDistrictsList(res))
                .finally(() => setLoadingDistricts(false));
        }
    }, [form.state, statesList]);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setForm(EMPTY_FORM);
            setShowPassword(false);
            setDistrictsList([]);
        }
    }, [isOpen]);

    const set = (key: keyof typeof EMPTY_FORM) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setForm(f => ({ ...f, [key]: e.target.value }));

    const setFile = (key: "aadhaar_doc" | "pan_doc" | "profile_pic") =>
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setForm(f => ({ ...f, [key]: e.target.files?.[0] ?? null }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
            toast.error("Please fill required fields (Name/Email/Password)");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("email", form.email);
            formData.append("phone", form.phone);
            formData.append("password", form.password);
            formData.append("address", form.address);
            formData.append("district", form.district);
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
            console.error("Agent creation failed", getErrorMessage(error));
            toast.error(getErrorMessage(error) || "Failed to create agent");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const inputCls = "w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all placeholder-gray-600";
    const labelCls = "block text-xs font-bold text-gray-700 mb-1.5";
    const sectionCls = "text-xs font-bold text-gray-700 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100";

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
                            <p className="text-xs text-gray-400">Agent credentials will be used for login</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* ── Scrollable body ── */}
                <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6">
                    <form id="add-agent-form" onSubmit={handleSubmit} autoComplete="off">
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
                                    <p className="text-xs text-gray-700 font-bold mt-2">Profile Photo</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Name */}
                                    <div className="sm:col-span-2">
                                        <label className={labelCls}>Full Name<span className="text-red-500 ml-0.5">*</span></label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input required placeholder="e.g. Ramesh Kumar"
                                                value={form.name}
                                                onChange={set("name")}
                                                className={inputCls}
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className={labelCls}>Email Address<span className="text-red-500 ml-0.5">*</span></label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                required
                                                type="email"
                                                placeholder="agent@example.com"
                                                value={form.email}
                                                onChange={set("email")}
                                                className={inputCls}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className={labelCls}>Login Password<span className="text-red-500 ml-0.5">*</span></label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                required
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={form.password}
                                                onChange={set("password")}
                                                className={inputCls}
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded text-gray-400"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className={labelCls}>Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input placeholder="10-digit mobile"
                                                value={form.phone}
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

                                    {/* District */}
                                    <div>
                                        <label className={labelCls}>District</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <select
                                                value={form.district}
                                                onChange={set("district")}
                                                disabled={!form.state || loadingDistricts}
                                                className={inputCls + " appearance-none" + (!form.state ? " opacity-50 cursor-not-allowed" : "")}
                                            >
                                                <option value="">
                                                    {loadingDistricts ? "Loading..." : !form.state ? "Select State first" : "Select District"}
                                                </option>
                                                {districtsList.map(d => (
                                                    <option key={d.id} value={d.name}>{d.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Address — full width */}
                                    <div className="sm:col-span-2">
                                        <label className={labelCls}>Full Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <textarea placeholder="House no., Street, Area..." value={form.address}
                                                onChange={set("address")} rows={2}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all placeholder-gray-600 resize-none" />
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
                    <Button type="submit" form="add-agent-form" variant="primary" fullWidth loading={loading} icon={Plus}>
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

const Lock = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);
const Eye = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" /><circle cx="12" cy="12" r="3" /></svg>
);
const EyeOff = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
);

// ── Listing Stats ─────────────────────────────────────────────
const getListingStats = (totals: { experts: number, mandirs: number, puja_shops: number, total: number }) => [
    { title: "Total Listings", value: totals.total, icon: BookOpen, iconColor: "text-blue-600", iconBgColor: "bg-blue-100" },
    { title: "Experts", value: totals.experts, icon: Star, iconColor: "text-yellow-600", iconBgColor: "bg-yellow-100" },
    { title: "Mandirs", value: totals.mandirs, icon: Building2, iconColor: "text-orange-600", iconBgColor: "bg-orange-100" },
    { title: "Puja Shops", value: totals.puja_shops, icon: ShoppingBag, iconColor: "text-purple-600", iconBgColor: "bg-purple-100" },
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
    const [listingTotals, setListingTotals] = useState({ experts: 0, mandirs: 0, puja_shops: 0, total: 0 });
    const [listPage, setListPage] = useState(1);
    const [listTotal, setListTotal] = useState(0);

    // Commission Settings State
    const [settings, setSettings] = useState<Record<string, string>>({
        COMMISION_FROM_ASTROLOGER: "3",
        COMMISION_FROM_CLIENT: "3",
        COMMISION_FROM_PUJA_SHOP: "3",
        GST_PERCENTAGE: "18"
    });
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [isFetchingSettings, setIsFetchingSettings] = useState(true);

    const fetchStats = useCallback(async () => {
        try {
            const res = await getAgentStats();
            setStats(res);
        } catch (error) {
            console.error("Failed to fetch agent stats", error);
        }
    }, []);

    const fetchSettings = useCallback(async () => {
        setIsFetchingSettings(true);
        const [data, error] = await getCommissionSettings();
        if (!error && data) {
            setSettings(data);
        }
        setIsFetchingSettings(false);
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
            setAgents(res?.data || []);
            setTotal(res?.total || 0);
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
            const res = (await getAllListings({
                type: typeFilter,
                search: listSearch,
                page: listPage,
                limit: 10
            })) as any;
            setListings(res?.data || []);
            setListTotal(res?.total || 0);
            if (res?.stats) {
                setListingTotals(res.stats);
            }
        } catch (error) {
            console.error("Failed to fetch listings", error);
        } finally {
            setListLoading(false);
        }
    }, [typeFilter, listSearch, listPage]);

    useEffect(() => { fetchStats(); fetchSettings(); }, [fetchStats, fetchSettings]);
    useEffect(() => {
        const t = setTimeout(fetchAgents, 400);
        return () => clearTimeout(t);
    }, [fetchAgents]);

    useEffect(() => {
        getAllListings({})
            .then((r: any) => {
                setAllListings(r?.data || []);
                if (r?.stats) setListingTotals(r.stats);
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        const t = setTimeout(fetchListings, 400);
        return () => clearTimeout(t);
    }, [fetchListings]);

    const handleRefresh = useCallback(() => {
        fetchStats();
        fetchAgents();
        fetchSettings();
    }, [fetchStats, fetchAgents, fetchSettings]);

    const handleSaveSettings = async () => {
        setIsSavingSettings(true);
        const [_, error] = await updateCommissionSettings(settings);
        if (error) {
            toast.error(getErrorMessage(error) || "Failed to update commission settings");
        } else {
            toast.success("Commission settings updated successfully");
        }
        setIsSavingSettings(false);
    };

    const statsConfig = useMemo(() => getStatsConfig(stats), [stats]);
    const columns = useMemo(() => getColumns(), []);
    const listingStats = useMemo(() => getListingStats(listingTotals), [listingTotals]);

    return (
        <>
            {/* Tab Switcher */}
            <div className="flex items-center gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
                {(["agents", "listings"] as TabType[]).map((t) => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-700 hover:text-gray-900"
                            }`}>
                        {t === "agents" ? "👤 Agent and Commission" : "📋 Agent Listings"}
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

                    {/* Commission Configuration Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-12">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                    <Settings size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Commission Configuration</h3>
                                    <p className="text-sm text-gray-700">Manage global agent commission percentages</p>
                                </div>
                            </div>
                            <Button
                                onClick={handleSaveSettings}
                                disabled={isSavingSettings || isFetchingSettings}
                                className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
                            >
                                {isSavingSettings ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                {isSavingSettings ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                            <div className="space-y-2 w-full">
                                <label className="text-sm font-bold text-gray-900">Agent Commission (for Expert) (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={settings.COMMISION_FROM_ASTROLOGER}
                                        onChange={(e) => setSettings(prev => ({ ...prev, COMMISION_FROM_ASTROLOGER: e.target.value }))}
                                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold text-gray-900"
                                        placeholder="3"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 font-bold">%</span>
                                </div>
                            </div>

                            <div className="space-y-2 w-full">
                                <label className="text-sm font-bold text-gray-900">Platform Fee (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={settings.COMMISION_FROM_CLIENT}
                                        onChange={(e) => setSettings(prev => ({ ...prev, COMMISION_FROM_CLIENT: e.target.value }))}
                                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold text-gray-900"
                                        placeholder="3"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 font-bold">%</span>
                                </div>
                            </div>

                            <div className="space-y-2 w-full">
                                <label className="text-sm font-bold text-gray-900">Agent Commission (Puja Shop) (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={settings.COMMISION_FROM_PUJA_SHOP}
                                        onChange={(e) => setSettings(prev => ({ ...prev, COMMISION_FROM_PUJA_SHOP: e.target.value }))}
                                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold text-gray-900"
                                        placeholder="3"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 font-bold">%</span>
                                </div>
                            </div>

                            <div className="space-y-2 w-full">
                                <label className="text-sm font-bold text-gray-900">GST (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={settings.GST_PERCENTAGE}
                                        onChange={(e) => setSettings(prev => ({ ...prev, GST_PERCENTAGE: e.target.value }))}
                                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold text-gray-900"
                                        placeholder="18"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 font-bold">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
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
                    onSearch={(q) => { setListSearch(q); setListPage(1); }}
                    isLoading={listLoading}
                    manualPagination
                    totalItems={listTotal}
                    onPageChange={setListPage}
                    filterElement={
                        <select value={typeFilter}
                            onChange={(e) => { setTypeFilter(e.target.value); setListPage(1); }}
                            className="w-40 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 font-medium">
                            <option value="">All Types</option>
                            <option value="expert">Expert</option>
                            <option value="mandir">Mandir</option>
                            <option value="puja_shop">Puja Shop</option>
                        </select>
                    }
                />
            )}
        </>
    );
}

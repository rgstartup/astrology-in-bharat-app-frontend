"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    Star, Users, Building2, ShoppingBag, LayoutList,
    Mail, Phone, Calendar, Search, X, UserCheck, UserX,
    MapPin, Flame, Clock, RefreshCw, CheckCircle, AlertCircle,
    BadgeIndianRupee
} from "lucide-react";
import { getReferredUsers, getAgentDashboardStats, type ReferredUser } from "@/services/agent.service";
import { toast } from "react-toastify";
import { StatsCards } from "@repo/ui";
import { ListingsSkeleton } from "../../components/Skeleton";

// ── Tab config ───────────────────────────────────────────────────────────────

type TabId = "all" | "expert" | "client" | "mandir" | "puja_shop";

interface Tab {
    id: TabId;
    label: string;
    icon: React.ElementType;
    color: string;
    activeBg: string;
    activeText: string;
    badgeBg: string;
}

const TABS: Tab[] = [
    {
        id: "all",
        label: "All",
        icon: LayoutList,
        color: "text-gray-1000",
        activeBg: "bg-primary",
        activeText: "text-white",
        badgeBg: "bg-gray-100 text-gray-700",
    },
    {
        id: "expert",
        label: "Expert",
        icon: Star,
        color: "text-yellow-600",
        activeBg: "bg-yellow-700",
        activeText: "text-white",
        badgeBg: "bg-yellow-100 text-yellow-700",
    },
    {
        id: "mandir",
        label: "Mandirs",
        icon: Building2,
        color: "text-orange-600",
        activeBg: "bg-orange-700",
        activeText: "text-white",
        badgeBg: "bg-orange-100 text-orange-700",
    },
    {
        id: "puja_shop",
        label: "Puja Shop",
        icon: ShoppingBag,
        color: "text-purple-600",
        activeBg: "bg-purple-800",
        activeText: "text-white",
        badgeBg: "bg-purple-100 text-purple-700",
    },
];

// ── Avatar helper ────────────────────────────────────────────────────────────
function ListingAvatar({ item }: { item: ReferredUser }) {
    const initials = (item.name ?? "?")
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    if (item.avatar) {
        return (
            <img
                src={item.avatar}
                alt={item.name}
                className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
            />
        );
    }

    const gradientMap: Record<string, string> = {
        expert: "bg-gradient-to-br from-yellow-500 to-amber-700",
        client: "bg-gradient-to-br from-blue-500 to-indigo-700",
        mandir: "bg-gradient-to-br from-orange-500 to-red-700",
        puja_shop: "bg-gradient-to-br from-purple-500 to-pink-700",
    };

    return (
        <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-sm ${
                gradientMap[item.type] ?? "bg-gradient-to-br from-gray-400 to-gray-600"
            }`}
        >
            {initials}
        </div>
    );
}

// ── Type Badge ───────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: ReferredUser["type"] }) {
    const config: Record<string, { bg: string; text: string; border: string; icon: React.ElementType; label: string }> = {
        expert: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", icon: Star, label: "Expert" },
        client: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", icon: Users, label: "Client" },
        mandir: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", icon: Building2, label: "Mandir" },
        puja_shop: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200", icon: ShoppingBag, label: "Puja Shop" },
        merchant: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200", icon: ShoppingBag, label: "Puja Shop" },
    };

    const c = config[type] ?? config.client;
    const Icon = c.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${c.bg} ${c.text} border ${c.border}`}>
            <Icon className="w-2.5 h-2.5" />
            {c.label}
        </span>
    );
}

// ── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
    if (status === "approved" || status === "active") {
        return (
            <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide">Active</span>
            </div>
        );
    }
    if (status === "rejected") {
        return (
            <div className="flex items-center gap-1.5 flex-shrink-0">
                <AlertCircle className="w-3 h-3 text-red-400" />
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">Rejected</span>
            </div>
        );
    }
    // pending
    return (
        <div className="flex items-center gap-1.5 flex-shrink-0">
            <Clock className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">Pending</span>
        </div>
    );
}

// ── Listing Card (handles all types) ─────────────────────────────────────────
function ListingCard({ item }: { item: ReferredUser }) {
    const joined = item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "—";

    const isPlace = item.type === "mandir" || item.type === "puja_shop";

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 p-5 flex flex-col gap-4">
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                    <ListingAvatar item={item} />
                    <div className="min-w-0">
                        <p className="font-black text-gray-900 text-sm truncate leading-tight">
                            {item.name ?? "Unknown"}
                        </p>
                        <div className="mt-1">
                            <TypeBadge type={item.type} />
                        </div>
                    </div>
                </div>
                <StatusBadge status={item.status} />
            </div>

            {/* Details */}
            <div className="space-y-2">
                {/* Email (users only) */}
                {item.email && (
                    <div className="flex items-center gap-2 text-xs text-gray-1000">
                        <Mail className="w-3.5 h-3.5 flex-shrink-0 text-gray-1000" />
                        <span className="truncate">{item.email}</span>
                    </div>
                )}
                {/* Phone */}
                {item.phone && (
                    <div className="flex items-center gap-2 text-xs text-gray-1000">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0 text-gray-1000" />
                        <span>{item.phone}</span>
                    </div>
                )}
                {/* Location (mandir / puja_shop) */}
                {isPlace && item.location && (
                    <div className="flex items-center gap-2 text-xs text-gray-1000">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-1000" />
                        <span className="truncate">{item.location}</span>
                    </div>
                )}
                {/* Deity (mandir / puja_shop) */}
                {isPlace && item.deity && (
                    <div className="flex items-center gap-2 text-xs text-gray-1000">
                        <Flame className="w-3.5 h-3.5 flex-shrink-0 text-gray-1000" />
                        <span className="truncate">{item.deity}</span>
                    </div>
                )}
                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-gray-1000">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{isPlace ? "Submitted" : "Joined"} {joined}</span>
                </div>

                {/* Commission Section */}
                {!isPlace && (item.commission !== undefined) && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                        {/* Expert Earnings (Gross Revenue) */}
                        {item.type === 'expert' && (
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-1000 uppercase tracking-wider">
                                    Expert Earnings
                                </span>
                                <span className="text-xs font-bold text-gray-700">
                                    ₹{(item.totalRevenue || 0).toLocaleString("en-IN")}
                                </span>
                            </div>
                        )}
                        
                        {/* Agent Commission */}
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-primary uppercase tracking-wider">
                                    Your Commission ({item.commissionPercent}%)
                                </span>
                            </div>
                            <span className="text-sm font-black text-primary">
                                ₹{item.commission?.toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ search, onClear }: { search: string; onClear: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <UserX className="w-8 h-8 text-gray-1000" />
            </div>
            <p className="font-black text-gray-700 mb-1">No listings found</p>
            <p className="text-sm text-gray-1000 mb-4">
                {search ? `No results for "${search}"` : "You haven't registered anyone yet."}
            </p>
            {search && (
                <button
                    onClick={onClear}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors"
                >
                    <X className="w-4 h-4" /> Clear Search
                </button>
            )}
        </div>
    );
}

let cachedListingsData: any = null;

export default function ListingsPage() {
    const [activeTab, setActiveTab] = useState<TabId>(cachedListingsData?.activeTab || "all");
    const [search, setSearch] = useState(cachedListingsData?.search || "");
    const [debouncedSearch, setDebouncedSearch] = useState(cachedListingsData?.search || "");
    const [data, setData] = useState<ReferredUser[]>(cachedListingsData?.data || []);
    const [total, setTotal] = useState(cachedListingsData?.total || 0);
    const [loading, setLoading] = useState(!cachedListingsData);
    const [refreshKey, setRefreshKey] = useState(0);
    const [statsData, setStatsData] = useState<any>(cachedListingsData?.statsData || null);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    const currentTab = TABS.find((t) => t.id === activeTab)!;

    // Fetch listings
    const fetchData = useCallback(async () => {
        if (!cachedListingsData || activeTab !== cachedListingsData?.activeTab || debouncedSearch !== cachedListingsData?.search) {
            setLoading(true);
        }
        const params: { type?: 'expert' | 'client' | 'mandir' | 'puja_shop'; search?: string } = {};
        if (activeTab !== "all") {
            params.type = activeTab;
        }
        if (debouncedSearch.trim()) {
            params.search = debouncedSearch.trim();
        }
        
        const [res, error] = await getReferredUsers(params);
        
        if (error) {
            toast.error("Failed to load listings");
        } else {
            setData(res?.data ?? []);
            setTotal(res?.total ?? 0);

            cachedListingsData = {
                activeTab,
                search: debouncedSearch,
                data: res?.data ?? [],
                total: res?.total ?? 0,
                statsData: statsData
            };
        }
        setLoading(false);
    }, [activeTab, debouncedSearch, refreshKey, statsData]);

    useEffect(() => {
        const fetchStats = async () => {
            const [stats, error] = await getAgentDashboardStats();
            if (!error) {
                setStatsData(stats);
                if (cachedListingsData) {
                    cachedListingsData.statsData = stats;
                } else {
                    cachedListingsData = { statsData: stats };
                }
            }
        };
        fetchStats();
    }, [refreshKey]); // Fetch stats only once or when manual refresh is triggered

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Per-tab counts from live data (when tab = all)
    const expertCount = useMemo(() => data.filter((u) => u.type === "expert").length, [data]);
    const mandirCount = useMemo(() => data.filter((u) => u.type === "mandir").length, [data]);
    const pujaShopCount = useMemo(() => data.filter((u) => u.type === "puja_shop").length, [data]);

    // Badge counts per tab button
    const getTabCount = (tab: Tab): number | null => {
        if (tab.id === "all") return total;
        if (activeTab === "all") {
            if (tab.id === "expert") return expertCount;
            if (tab.id === "mandir") return mandirCount;
            if (tab.id === "puja_shop") return pujaShopCount;
        }
        if (tab.id === activeTab) return total;
        return null;
    };

    const stats: any[] = useMemo(() => [
        {
            title: "Expert Earnings",
            value: loading ? "..." : `₹${(statsData?.expertEarnings || 0).toLocaleString("en-IN")}`,
            icon: Star,
            iconColor: "text-yellow-600",
            iconBgColor: "bg-yellow-100",
        },
        {
            title: "Mandir Earnings",
            value: loading ? "..." : `₹${(statsData?.mandirEarnings || 0).toLocaleString("en-IN")}`,
            icon: Building2,
            iconColor: "text-orange-600",
            iconBgColor: "bg-orange-100",
        },
        {
            title: "Shop Earnings",
            value: loading ? "..." : `₹${(statsData?.shopEarnings || 0).toLocaleString("en-IN")}`,
            icon: ShoppingBag,
            iconColor: "text-purple-600",
            iconBgColor: "bg-purple-100",
        },
        {
            title: "Total Listings Earned",
            value: loading ? "..." : `₹${(statsData?.totalListingsEarnings || 0).toLocaleString("en-IN")}`,
            icon: BadgeIndianRupee,
            iconColor: "text-green-600",
            iconBgColor: "bg-green-100",
            valueColor: "text-green-700",
        },
    ], [statsData, loading]);

    return (
        <div className="space-y-6">
            {/* Stats Cards Section - Always visible to prevent jumping */}
            <div className="mb-8"><StatsCards stats={stats} columns={4} /></div>

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-gray-900">Listings</h2>
                    <p className="text-sm text-gray-1000 mt-0.5">
                        All registrations made by you
                    </p>
                </div>
                <button
                    onClick={() => setRefreshKey((k) => k + 1)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-1000 hover:bg-gray-50 hover:text-primary transition-colors text-xs font-bold shadow-sm"
                    title="Refresh listings"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* 5 Filter Buttons */}
            <div className="flex flex-wrap gap-2">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const count = getTabCount(tab);
                    return (
                        <button
                            key={tab.id}
                            id={`listing-tab-${tab.id}`}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setSearch("");
                            }}
                            className={`
                                relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
                                border transition-all duration-200 shadow-sm focus:outline-none
                                focus:ring-2 focus:ring-offset-1 focus:ring-primary/40
                                ${
                                    isActive
                                        ? `${tab.activeBg} ${tab.activeText} border-transparent shadow-md scale-[1.03]`
                                        : "bg-white text-gray-1000 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }
                            `}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? "text-white" : tab.color}`} />
                            <span>{tab.label}</span>
                            {count !== null && (
                                <span
                                    className={`
                                        ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5
                                        rounded-full text-[10px] font-black
                                        ${isActive ? "bg-white/20 text-white" : tab.badgeBg}
                                    `}
                                >
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Search bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-1000 pointer-events-none" />
                <input
                    id="listings-search"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, email, or location…"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 shadow-sm transition-all"
                />
                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-1000 hover:text-gray-1000 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Summary strip */}
            {!loading && data.length > 0 && (
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-4 py-2 shadow-sm">
                        <UserCheck className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-bold text-gray-700">
                            {total} total
                        </span>
                    </div>
                    {activeTab === "all" && (
                        <>
                            {expertCount > 0 && (
                                <div className="flex items-center gap-2 bg-yellow-50 rounded-xl border border-yellow-200 px-4 py-2 shadow-sm">
                                    <Star className="w-4 h-4 text-yellow-600" />
                                    <span className="text-xs font-bold text-yellow-700">
                                        {expertCount} experts
                                    </span>
                                </div>
                            )}
                            {mandirCount > 0 && (
                                <div className="flex items-center gap-2 bg-orange-50 rounded-xl border border-orange-200 px-4 py-2 shadow-sm">
                                    <Building2 className="w-4 h-4 text-orange-600" />
                                    <span className="text-xs font-bold text-orange-700">
                                        {mandirCount} mandirs
                                    </span>
                                </div>
                            )}
                            {pujaShopCount > 0 && (
                                <div className="flex items-center gap-2 bg-purple-50 rounded-xl border border-purple-200 px-4 py-2 shadow-sm">
                                    <ShoppingBag className="w-4 h-4 text-purple-600" />
                                    <span className="text-xs font-bold text-purple-700">
                                        {pujaShopCount} puja shops
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Grid */}
            {loading ? (
                <ListingsSkeleton />
            ) : data.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <EmptyState search={search} onClear={() => setSearch("")} />
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {data.map((item) => (
                        <ListingCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
}

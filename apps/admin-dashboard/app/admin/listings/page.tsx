"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { BookOpen, Star, ShoppingBag, Building2 } from "lucide-react";

import { DataTable } from "@/app/components/admin/DataTable";
import { StatsCards } from "@repo/ui";
import { getAllListings } from "@/src/services/agent.service";
import type { AgentListing } from "@/app/components/agent/agent";

// ── Static listing stats ──────────────────────────────────────
const getListingStats = (data: AgentListing[]) => [
    {
        title: "Total Listings",
        value: data.length,
        icon: BookOpen,
        iconColor: "text-blue-600",
        iconBgColor: "bg-blue-100",
    },
    {
        title: "Astrologers",
        value: data.filter((l) => l.listing_type === "astrologer").length,
        icon: Star,
        iconColor: "text-yellow-600",
        iconBgColor: "bg-yellow-100",
    },
    {
        title: "Mandirs",
        value: data.filter((l) => l.listing_type === "mandir").length,
        icon: Building2,
        iconColor: "text-orange-600",
        iconBgColor: "bg-orange-100",
    },
    {
        title: "Puja Shops",
        value: data.filter((l) => l.listing_type === "puja_shop").length,
        icon: ShoppingBag,
        iconColor: "text-purple-600",
        iconBgColor: "bg-purple-100",
    },
];

// ── Listing type badge ────────────────────────────────────────
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

const COLUMNS = [
    {
        key: "listing_name",
        label: "Listing Name",
        render: (l: AgentListing) => (
            <div>
                <p className="text-sm font-semibold text-gray-900">{l.listing_name}</p>
                <p className="text-xs text-gray-500">{l.listing_location || "—"}</p>
            </div>
        ),
    },
    {
        key: "type",
        label: "Type",
        render: (l: AgentListing) => {
            const t = TYPE_LABEL[l.listing_type];
            return (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${t.className}`}>
                    {t.label}
                </span>
            );
        },
    },
    {
        key: "agent",
        label: "Agent ID",
        render: (l: AgentListing) => (
            <span className="text-xs font-mono text-gray-600">{l.agent_id}</span>
        ),
    },
    {
        key: "contact",
        label: "Contact",
        render: (l: AgentListing) => (
            <p className="text-sm text-gray-700">{l.listing_contact || "—"}</p>
        ),
    },
    {
        key: "status",
        label: "Status",
        render: (l: AgentListing) => (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_CLASS[l.status]}`}>
                {l.status}
            </span>
        ),
    },
    {
        key: "date",
        label: "Listed On",
        render: (l: AgentListing) => (
            <p className="text-sm text-gray-500">
                {new Date(l.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
        ),
    },
];

export default function ListingsPage() {
    const [listings, setListings] = useState<AgentListing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [allData, setAllData] = useState<AgentListing[]>([]);   // for stats

    const fetchListings = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await getAllListings({ type: typeFilter || undefined, search: searchQuery });
            setListings(res.data);
            setTotal(res.total);
        } catch (err) {
            console.error("Failed to fetch listings:", err);
        } finally {
            setIsLoading(false);
        }
    }, [typeFilter, searchQuery]);

    // Fetch all once for stats
    useEffect(() => {
        getAllListings({}).then((res) => setAllData(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        const t = setTimeout(fetchListings, 400);
        return () => clearTimeout(t);
    }, [fetchListings]);

    const statsConfig = useMemo(() => getListingStats(allData), [allData]);

    return (
        <DataTable
            data={listings}
            columns={COLUMNS}
            searchKeys={["listing_name", "agent_id"]}
            title="Agent Listings"
            statsCards={<StatsCards stats={statsConfig} columns={4} />}
            onSearch={(q) => { setSearchQuery(q); setPage(1); }}
            isLoading={isLoading}
            manualPagination
            totalItems={total}
            onPageChange={setPage}
            filterElement={
                <select
                    value={typeFilter}
                    onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                    className="w-40 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all font-medium"
                >
                    <option value="">All Types</option>
                    <option value="astrologer">Astrologer</option>
                    <option value="mandir">Mandir</option>
                    <option value="puja_shop">Puja Shop</option>
                </select>
            }
        />
    );
}

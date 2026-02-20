"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ShoppingBag, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";

import { DataTable } from "@/app/components/admin/DataTable";
import { StatsCards, Button } from "@repo/ui";
import { getAllListings, updateListingStatus } from "@/src/services/agent.service";
import type { AgentListing } from "@/app/components/agent/agent";

const STATUS_CLASS: Record<string, string> = {
    approved: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-600",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
};

export default function AdminPujaShopsPage() {
    const [listings, setListings] = useState<AgentListing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchListings = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await getAllListings({ type: "puja_shop", search: searchQuery });
            const data = res.data || res;
            setListings(Array.isArray(data) ? data : []);
            setTotal(res.total || (Array.isArray(data) ? data.length : 0));
        } catch (err) {
            console.error("Failed to fetch puja shops:", err);
            toast.error("Failed to load puja shops");
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        const t = setTimeout(fetchListings, 400);
        return () => clearTimeout(t);
    }, [fetchListings]);

    const handleStatusUpdate = async (id: string | number, status: "approved" | "rejected") => {
        try {
            await updateListingStatus(id, status);
            toast.success(`Listing ${status === 'approved' ? 'Approved' : 'Rejected'}`);

            // ✅ Update local state instead of full refresh
            setListings(prev => prev.map(l =>
                (l.id === id || (l as any)._id === id) ? { ...l, status } : l
            ));
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const COLUMNS = [
        {
            key: "name",
            label: "Shop Name",
            render: (l: any) => (
                <div>
                    <p className="text-sm font-semibold text-gray-900">{l.name || l.listing_name || "Untitled"}</p>
                    <p className="text-xs text-gray-500">{l.location || l.listing_location || "—"}</p>
                </div>
            ),
        },
        {
            key: "items",
            label: "Items Sold",
            render: (l: any) => (
                <p className="text-xs text-gray-600 line-clamp-1">{l.items || "—"}</p>
            ),
        },
        {
            key: "agent",
            label: "AGENT INFO",
            render: (l: any) => (
                <div className="min-w-[110px] py-1">
                    <p className="text-sm font-bold text-gray-900 leading-tight">
                        {l.agent_name || l.agentName || l.agent?.name || "—"}
                    </p>
                    <p className="text-[10px] font-mono text-purple-600 mt-0.5 font-bold">
                        {l.agent_id || l.agent_code || l.agentCode || l.agent?.agent_id || "—"}
                    </p>
                </div>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (l: any) => (
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_CLASS[l.status] || STATUS_CLASS.pending}`}>
                    {l.status}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (l: any) => (
                <div className="flex items-center gap-1">
                    {l.status === "pending" && (
                        <>
                            <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleStatusUpdate(l.id || l._id, "approved")}
                                className="bg-purple-600 hover:bg-purple-700 border-none px-1.5 h-7 text-[10px] font-black text-white"
                            >
                                <CheckCircle className="w-3 h-3 mr-0.5" /> APPROVE
                            </Button>
                            <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleStatusUpdate(l.id || l._id, "rejected")}
                                className="px-1.5 h-7 text-[10px] font-black"
                            >
                                <XCircle className="w-3 h-3 mr-0.5" /> REJECT
                            </Button>
                        </>
                    )}
                    {(l.status === "approved" || l.status === "rejected") && (
                        <Button
                            size="sm"
                            variant={l.status === "approved" ? "danger" : "primary"}
                            onClick={() => handleStatusUpdate(l.id || l._id, l.status === "approved" ? "rejected" : "approved")}
                            className={`px-1.5 h-7 text-[10px] font-black ${l.status === 'rejected' ? 'bg-purple-600 hover:bg-purple-700 border-none text-white' : ''}`}
                        >
                            {l.status === "approved" ? "REJECT" : "APPROVE"}
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const statsConfig = useMemo(() => [
        {
            title: "Total Shops",
            value: listings.length,
            icon: ShoppingBag,
            iconColor: "text-purple-600",
            iconBgColor: "bg-purple-100",
        },
        {
            title: "Pending Approval",
            value: listings.filter(l => l.status === "pending").length,
            icon: ShoppingBag,
            iconColor: "text-yellow-600",
            iconBgColor: "bg-yellow-100",
        },
    ], [listings]);

    return (
        <DataTable
            data={listings}
            columns={COLUMNS}
            searchKeys={["name", "listing_name", "agent_id", "agent_name"]}
            title="Puja Shop Approvals"
            statsCards={<StatsCards stats={statsConfig} columns={3} />}
            onSearch={setSearchQuery}
            isLoading={isLoading}
            manualPagination
            totalItems={total}
            onPageChange={setPage}
        />
    );
}

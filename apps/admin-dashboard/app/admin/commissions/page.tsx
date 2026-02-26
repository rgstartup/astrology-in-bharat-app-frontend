"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { IndianRupee, CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "react-toastify";

import { DataTable } from "@/app/components/admin/DataTable";
import { StatsCards } from "@repo/ui";
import { getCommissions, markCommissionPaid } from "@/src/services/agent.service";
import type { Commission } from "@/app/components/agent/agent";

// ── Stats ─────────────────────────────────────────────────────
const getCommissionStats = (data: Commission[]) => {
    const paid = data.filter((c) => c.status === "paid");
    const pending = data.filter((c) => c.status === "pending");

    return [
        {
            title: "Total Commissions",
            value: `₹${data.reduce((s, c) => s + c.amount, 0).toLocaleString("en-IN")}`,
            icon: IndianRupee,
            iconColor: "text-blue-600",
            iconBgColor: "bg-blue-100",
        },
        {
            title: "Paid",
            value: `₹${paid.reduce((s, c) => s + c.amount, 0).toLocaleString("en-IN")}`,
            icon: CheckCircle,
            iconColor: "text-green-600",
            iconBgColor: "bg-green-100",
            valueColor: "text-green-600",
        },
        {
            title: "Pending",
            value: `₹${pending.reduce((s, c) => s + c.amount, 0).toLocaleString("en-IN")}`,
            icon: Clock,
            iconColor: "text-orange-600",
            iconBgColor: "bg-orange-100",
            valueColor: "text-orange-600",
        },
        {
            title: "Transactions",
            value: data.length,
            icon: XCircle,
            iconColor: "text-purple-600",
            iconBgColor: "bg-purple-100",
        },
    ];
};

// ── Type badge ────────────────────────────────────────────────
const TYPE_LABEL: Record<string, { label: string; className: string }> = {
    astrologer: { label: "Astrologer", className: "bg-yellow-100 text-yellow-700" },
    mandir: { label: "Mandir", className: "bg-orange-100 text-orange-700" },
    puja_shop: { label: "Puja Shop", className: "bg-purple-100 text-purple-700" },
};

export default function CommissionsPage() {
    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [allData, setAllData] = useState<Commission[]>([]);
    const [payingId, setPayingId] = useState<number | null>(null);

    const fetchCommissions = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await getCommissions({ status: statusFilter || undefined });
            setCommissions(res.data);
        } catch (err) {
            console.error("Failed to fetch commissions:", err);
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        getCommissions({}).then((r) => setAllData(r.data)).catch(console.error);
    }, []);

    useEffect(() => { fetchCommissions(); }, [fetchCommissions]);

    const handlePay = async (commission: Commission) => {
        if (commission.status === "paid") return;
        try {
            setPayingId(commission.id);
            await markCommissionPaid(commission.id);
            toast.success(`Commission ₹${commission.amount} marked as paid!`);
            fetchCommissions();
            getCommissions({}).then((r) => setAllData(r.data)).catch(console.error);
        } catch {
            toast.error("Failed to update commission status.");
        } finally {
            setPayingId(null);
        }
    };

    const statsConfig = useMemo(() => getCommissionStats(allData), [allData]);

    const columns = useMemo(() => [
        {
            key: "agent",
            label: "Agent",
            render: (c: Commission) => (
                <div>
                    <p className="text-sm font-semibold text-gray-900">{c.agent_name}</p>
                    <p className="text-xs font-mono text-gray-500">{c.agent_id}</p>
                </div>
            ),
        },
        {
            key: "listing",
            label: "Listing",
            render: (c: Commission) => (
                <div>
                    <p className="text-sm text-gray-800">{c.listing_name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TYPE_LABEL[c.listing_type].className}`}>
                        {TYPE_LABEL[c.listing_type].label}
                    </span>
                </div>
            ),
        },
        {
            key: "amount",
            label: "Amount",
            render: (c: Commission) => (
                <p className="text-sm font-bold text-gray-900">
                    ₹{c.amount.toLocaleString("en-IN")}
                </p>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (c: Commission) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : c.status === "pending"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-600"
                    }`}>
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                </span>
            ),
        },
        {
            key: "date",
            label: "Date",
            render: (c: Commission) => (
                <p className="text-sm text-gray-500">
                    {new Date(c.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
            ),
        },
        {
            key: "action",
            label: "Action",
            render: (c: Commission) =>
                c.status === "pending" ? (
                    <button
                        onClick={() => handlePay(c)}
                        disabled={payingId === c.id}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                        {payingId === c.id ? "Paying…" : "Mark Paid"}
                    </button>
                ) : (
                    <span className="text-xs text-gray-400">—</span>
                ),
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [payingId]);

    return (
        <DataTable
            data={commissions}
            columns={columns}
            searchKeys={["agent_name", "agent_id", "listing_name"]}
            title="Commission Management"
            statsCards={<StatsCards stats={statsConfig} columns={4} />}
            isLoading={isLoading}
            filterElement={
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-36 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all font-medium"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                </select>
            }
        />
    );
}

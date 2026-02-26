import { Users, UserCheck, BookOpen, IndianRupee } from "lucide-react";
import type { Agent, AgentStats } from "./agent";

// ── Stats Cards config ────────────────────────────────────────
export const getStatsConfig = (data: Agent[] | AgentStats) => {
    let stats: AgentStats;

    if (Array.isArray(data)) {
        stats = {
            totalAgents: data.length,
            activeAgents: data.filter((a) => a.status === "active").length,
            totalListings: data.reduce((acc, a) => acc + a.total_listings, 0),
            pendingPayouts: data.reduce((acc, a) => acc + a.pending_payout, 0),
        };
    } else {
        stats = data;
    }

    return [
        {
            title: "Total Agents",
            value: stats.totalAgents,
            icon: Users,
            iconColor: "text-blue-600",
            iconBgColor: "bg-blue-100",
        },
        {
            title: "Active Agents",
            value: stats.activeAgents,
            icon: UserCheck,
            iconColor: "text-green-600",
            iconBgColor: "bg-green-100",
            valueColor: "text-green-600",
        },
        {
            title: "Total Listings",
            value: stats.totalListings,
            icon: BookOpen,
            iconColor: "text-purple-600",
            iconBgColor: "bg-purple-100",
        },
        {
            title: "Pending Payouts",
            value: `₹${stats.pendingPayouts.toLocaleString("en-IN")}`,
            icon: IndianRupee,
            iconColor: "text-orange-600",
            iconBgColor: "bg-orange-100",
            valueColor: "text-orange-600",
        },
    ];
};

// ── Table Columns ─────────────────────────────────────────────
export const getColumns = () => [
    {
        key: "agent",
        label: "Agent",
        render: (agent: Agent) => (
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {agent.name.charAt(0)}
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-900">{agent.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{agent.agent_id}</p>
                </div>
            </div>
        ),
    },
    {
        key: "contact",
        label: "Contact",
        render: (agent: Agent) => (
            <div>
                <p className="text-sm text-gray-700">{agent.email}</p>
                <p className="text-xs text-gray-500">{agent.phone}</p>
            </div>
        ),
    },
    {
        key: "location",
        label: "Location",
        render: (agent: Agent) => (
            <p className="text-sm text-gray-700">
                {agent.city ? `${agent.city}, ${agent.state}` : "—"}
            </p>
        ),
    },
    {
        key: "listings",
        label: "Listings",
        render: (agent: Agent) => (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                {agent.total_listings}
            </span>
        ),
    },
    {
        key: "earned",
        label: "Total Earned",
        render: (agent: Agent) => (
            <p className="text-sm font-semibold text-gray-900">
                ₹{agent.total_earned.toLocaleString("en-IN")}
            </p>
        ),
    },
    {
        key: "pending",
        label: "Pending Payout",
        render: (agent: Agent) => (
            <p className={`text-sm font-semibold ${agent.pending_payout > 0 ? "text-orange-600" : "text-gray-400"}`}>
                ₹{agent.pending_payout.toLocaleString("en-IN")}
            </p>
        ),
    },
    {
        key: "status",
        label: "Status",
        render: (agent: Agent) => {
            const map: Record<string, string> = {
                active: "bg-green-100 text-green-700",
                inactive: "bg-gray-100 text-gray-600",
                suspended: "bg-red-100 text-red-700",
            };
            return (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${map[agent.status]}`}>
                    {agent.status}
                </span>
            );
        },
    },
];

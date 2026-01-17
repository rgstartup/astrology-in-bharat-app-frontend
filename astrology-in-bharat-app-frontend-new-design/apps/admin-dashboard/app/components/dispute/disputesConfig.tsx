import {
  AlertCircle,
  Clock,
  MessageSquare,
  TrendingUp,
  User,
  UserCheck,
  Calendar,
  IndianRupee,
} from "lucide-react";
import type { Dispute } from "@/app/components/dispute/dispute";

export const disputesData: Dispute[] = [
  {
    id: 1,
    disputeId: "DSP-001",
    user: "Rahul Sharma",
    expert: "Priya Joshi",
    subject: "Payment not received",
    description: "Completed consultation but payment not reflected in wallet",
    amount: 999,
    category: "Payment",
    status: "pending",
    priority: "high",
    createdAt: "2024-01-15T10:30:00",
    resolvedAt: null,
    raisedBy: "expert",
  },
  {
    id: 2,
    disputeId: "DSP-002",
    user: "Sneha Patel",
    expert: "Amit Kumar",
    subject: "Poor service quality",
    description: "Expert was unprofessional during consultation",
    amount: 1499,
    category: "Service Quality",
    status: "under_review",
    priority: "medium",
    createdAt: "2024-01-14T14:20:00",
    resolvedAt: null,
    raisedBy: "user",
  },
  {
    id: 3,
    disputeId: "DSP-003",
    user: "Vikram Singh",
    expert: "Rajesh Sharma",
    subject: "Refund request",
    description: "Session cancelled but refund not initiated",
    amount: 799,
    category: "Refund",
    status: "resolved",
    priority: "low",
    createdAt: "2024-01-13T09:15:00",
    resolvedAt: "2024-01-14T16:00:00",
    raisedBy: "user",
  },
  {
    id: 4,
    disputeId: "DSP-004",
    user: "Anjali Verma",
    expert: "Priya Joshi",
    subject: "Technical issues",
    description: "Video call disconnected multiple times",
    amount: 1299,
    category: "Technical",
    status: "pending",
    priority: "urgent",
    createdAt: "2024-01-15T16:45:00",
    resolvedAt: null,
    raisedBy: "user",
  },
];

export const getStatsConfig = (disputes: Dispute[]) => [
  {
    title: "Total Disputes",
    value: disputes.length,
    icon: AlertCircle,
    iconColor: "text-orange-600",
    iconBgColor: "bg-orange-100",
    trend: { value: "+3", isPositive: false, period: "this week" },
  },
  {
    title: "Pending",
    value: disputes.filter((d) => d.status === "pending").length,
    icon: Clock,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-100",
    trend: { value: "2 urgent", isPositive: false, period: "need attention" },
  },
  {
    title: "Under Review",
    value: disputes.filter((d) => d.status === "under_review").length,
    icon: MessageSquare,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-100",
    trend: { value: "+1", isPositive: false, period: "today" },
  },
 
  {
    title: "Resolved",
    value: disputes.filter((d) => d.status === "resolved").length,
    icon: TrendingUp,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-100",
    trend: { value: "+5", isPositive: true, period: "this month" },
  },
];

const getBadge = (status: string) => {
  const badges = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    under_review: "bg-blue-100 text-blue-700 border-blue-200",
    resolved: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    low: "bg-gray-100 text-gray-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };
  return badges[status as keyof typeof badges] || "";
};

export const getColumns = () => [
  {
    key: "disputeId",
    label: "ID",
    render: (d: Dispute) => <span className="font-semibold">{d.disputeId}</span>,
  },
  {
    key: "user",
    label: "User",
    render: (d: Dispute) => (
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-gray-400" />
        <span className="text-sm">{d.user}</span>
      </div>
    ),
  },
  {
    key: "expert",
    label: "Expert",
    render: (d: Dispute) => (
      <div className="flex items-center gap-2">
        <UserCheck className="w-4 h-4 text-gray-400" />
        <span className="text-sm">{d.expert}</span>
      </div>
    ),
  },
  {
    key: "subject",
    label: "Subject",
    render: (d: Dispute) => (
      <div className="max-w-xs">
        <p className="text-sm font-medium truncate">{d.subject}</p>
        <p className="text-xs text-gray-600">{d.category}</p>
      </div>
    ),
  },
  {
    key: "amount",
    label: "Amount",
    render: (d: Dispute) => (
      <div className="flex items-center gap-1 font-semibold">
        <IndianRupee className="w-3 h-3" />
        {d.amount.toLocaleString()}
      </div>
    ),
  },
  {
    key: "priority",
    label: "Priority",
    render: (d: Dispute) => (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getBadge(d.priority)}`}>
        {d.priority.toUpperCase()}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (d: Dispute) => (
      <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getBadge(d.status)}`}>
        {d.status.replace("_", " ").toUpperCase()}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Created",
    render: (d: Dispute) => (
      <div className="flex items-center gap-1 text-xs text-gray-600">
        <Calendar className="w-3 h-3" />
        {new Date(d.createdAt).toLocaleDateString("en-IN")}
      </div>
    ),
  },
];
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

export const getStatsConfig = (disputes: Dispute[], stats?: any) => [
  {
    title: "Total Disputes",
    value: stats?.total || disputes.length,
    icon: AlertCircle,
    iconColor: "text-orange-600",
    iconBgColor: "bg-orange-100",
    trend: { value: `${disputes.length}`, isPositive: false, period: "total" },
  },
  {
    title: "Pending",
    value: stats?.pending || disputes.filter((d) => d.status === "pending").length,
    icon: Clock,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-100",
    trend: { value: "Need attention", isPositive: false, period: "urgent" },
  },
  {
    title: "Under Review",
    value: stats?.underReview || disputes.filter((d) => d.status === "under_review").length,
    icon: MessageSquare,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-100",
    trend: { value: "In progress", isPositive: false, period: "active" },
  },

  {
    title: "Resolved",
    value: stats?.resolved || disputes.filter((d) => d.status === "resolved").length,
    icon: TrendingUp,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-100",
    trend: { value: "Completed", isPositive: true, period: "success" },
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
    render: (d: Dispute) => <span className="font-semibold">{d.disputeId || d.id || 'N/A'}</span>,
  },
  {
    key: "user",
    label: "User",
    render: (d: Dispute) => {
      const userName = typeof d.user === 'string' ? d.user : (d.user as any)?.name || (d.user as any)?.email || 'Unknown';
      return (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{userName}</span>
        </div>
      );
    },
  },
  {
    key: "expert",
    label: "Expert",
    render: (d: Dispute) => {
      const expertName = typeof d.expert === 'string' ? d.expert : (d.expert as any)?.name || (d.expert as any)?.email || 'N/A';
      return (
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{expertName}</span>
        </div>
      );
    },
  },
  {
    key: "subject",
    label: "Subject",
    render: (d: Dispute) => (
      <div className="max-w-xs">
        <p className="text-sm font-medium truncate">{d.subject || d.category || 'No subject'}</p>
        <p className="text-xs text-gray-600">{d.category || 'General'}</p>
      </div>
    ),
  },
  {
    key: "amount",
    label: "Amount",
    render: (d: Dispute) => (
      <div className="flex items-center gap-1 font-semibold">
        <IndianRupee className="w-3 h-3" />
        {d.amount ? d.amount.toLocaleString() : 'N/A'}
      </div>
    ),
  },
  {
    key: "priority",
    label: "Priority",
    render: (d: Dispute) => (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getBadge(d.priority || 'medium')}`}>
        {(d.priority || 'MEDIUM').toUpperCase()}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (d: Dispute) => (
      <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getBadge(d.status || 'pending')}`}>
        {(d.status || 'pending').replace("_", " ").toUpperCase()}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Created",
    render: (d: Dispute) => (
      <div className="flex items-center gap-1 text-xs text-gray-600">
        <Calendar className="w-3 h-3" />
        {d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-IN") : 'N/A'}
      </div>
    ),
  },
];
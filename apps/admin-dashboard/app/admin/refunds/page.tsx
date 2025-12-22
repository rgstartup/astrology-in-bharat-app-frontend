"use client";
import React, { useState } from "react";
import { StatsCards } from "@/app/components/admin/StatsCard";
import { DataTable } from "@/app/components/admin/DataTable";
import RefundDetailsModal from "@/app/components/refunds/RefundDetailsModal";
import RefundHeader from "@/app/components/refunds/RefundHeader";
import RefundFilters from "@/app/components/refunds/RefundFilters";
import RefundQuickStats from "@/app/components/refunds/RefundQuickStats";
import StatusBadge from "@/app/components/refunds/StatusBadge";
import RefundActionButtons from "@/app/components/refunds/RefundActionButtons";
import { BarChart3, Clock, CheckCircle2, IndianRupee } from "lucide-react";
interface RefundRequest {
  id: string;
  orderId: string;
  userName: string;
  userEmail: string;
  serviceName: string;
  amount: number;
  requestDate: string;
  status: "pending" | "approved" | "rejected" | "processing";
  reason: string;
  paymentMethod: string;
  transactionId: string;
  
}

interface StatConfig {
  title: string;
  value: string;
  icon: string;
  color?: string; // optional property
}
const mockRefunds: RefundRequest[] = [
  {
    id: "REF001",
    orderId: "ORD12345",
    userName: "Rajesh Kumar",
    userEmail: "rajesh@example.com",
    serviceName: "Birth Chart Analysis",
    amount: 1500,
    requestDate: "2025-12-15",
    status: "pending",
    reason: "Service not satisfactory",
    paymentMethod: "UPI",
    transactionId: "TXN789456123",
  },
  {
    id: "REF002",
    orderId: "ORD12346",
    userName: "Priya Sharma",
    userEmail: "priya@example.com",
    serviceName: "Kundli Matching",
    amount: 2000,
    requestDate: "2025-12-14",
    status: "approved",
    reason: "Expert unavailable",
    paymentMethod: "Credit Card",
    transactionId: "TXN789456124",
  },
  {
    id: "REF003",
    orderId: "ORD12347",
    userName: "Amit Patel",
    userEmail: "amit@example.com",
    serviceName: "Career Consultation",
    amount: 1200,
    requestDate: "2025-12-13",
    status: "rejected",
    reason: "Invalid request",
    paymentMethod: "Debit Card",
    transactionId: "TXN789456125",
  },
  {
    id: "REF004",
    orderId: "ORD12348",
    userName: "Sneha Reddy",
    userEmail: "sneha@example.com",
    serviceName: "Marriage Prediction",
    amount: 3000,
    requestDate: "2025-12-12",
    status: "processing",
    reason: "Delayed service",
    paymentMethod: "Net Banking",
    transactionId: "TXN789456126",
  },
  {
    id: "REF005",
    orderId: "ORD12349",
    userName: "Vikram Singh",
    userEmail: "vikram@example.com",
    serviceName: "Gemstone Recommendation",
    amount: 2500,
    requestDate: "2025-12-11",
    status: "pending",
    reason: "Wrong gemstone suggested",
    paymentMethod: "UPI",
    transactionId: "TXN789456127",
  },
  {
    id: "REF006",
    orderId: "ORD12350",
    userName: "Anita Desai",
    userEmail: "anita@example.com",
    serviceName: "Vastu Consultation",
    amount: 1800,
    requestDate: "2025-12-10",
    status: "approved",
    reason: "Consultation rescheduled",
    paymentMethod: "PayPal",
    transactionId: "TXN789456128",
  },
];

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<RefundRequest[]>(mockRefunds);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate stats
  const stats = {
    totalRefunds: refunds.length,
    pendingRefunds: refunds.filter((r) => r.status === "pending").length,
    approvedRefunds: refunds.filter((r) => r.status === "approved").length,
    rejectedRefunds: refunds.filter((r) => r.status === "rejected").length,
    pendingAmount: refunds
      .filter((r) => r.status === "pending")
      .reduce((sum, r) => sum + r.amount, 0),
  };

  // Filter refunds
  const filteredRefunds = refunds.filter((refund) => {
    const matchesSearch =
      refund.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.userEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || refund.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle actions
  const handleApprove = (id: string) => {
    setRefunds(refunds.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r)));
  };

  const handleReject = (id: string) => {
    setRefunds(refunds.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r)));
  };

  const handleViewDetails = (refund: RefundRequest) => {
    setSelectedRefund(refund);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    alert("Exporting refund report...");
    // TODO: Implement CSV/PDF export
  };

  // Table configuration
  const columns = [
    { key: "id", label: "Refund ID" },
    { key: "orderId", label: "Order ID" },
    { key: "userName", label: "User Name" },
    { key: "serviceName", label: "Service" },
    { key: "amount", label: "Amount" },
    { key: "requestDate", label: "Request Date" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (refund: RefundRequest, key: string) => {
    switch (key) {
      case "amount":
        return `₹${refund.amount.toLocaleString()}`;
      case "status":
        return <StatusBadge status={refund.status} />;
      case "actions":
        return (
          <RefundActionButtons
            refundId={refund.id}
            status={refund.status}
            onView={() => handleViewDetails(refund)}
            onApprove={() => handleApprove(refund.id)}
            onReject={() => handleReject(refund.id)}
          />
        );
      default:
        return refund[key as keyof RefundRequest];
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <RefundHeader onExport={handleExport} />

      {/* Stats Cards */}
      <StatsCards
  stats={[
    {
      title: "Total Refunds",
      value: stats.totalRefunds,
      icon: "null",
      iconColor: "text-white",
      iconBgColor: "bg-orange-500",
    },
    {
      title: "Pending Requests",
      value: stats.pendingRefunds,
      icon: "null",
      iconColor: "text-white",
      iconBgColor: "bg-yellow-500",
    },
    {
      title: "Approved Refunds",
      value: stats.approvedRefunds,
      icon: "null",
      iconColor: "text-white",
      iconBgColor: "bg-green-500",
    },
    {
      title: "Pending Amount",
      value: `₹${stats.pendingAmount.toLocaleString()}`,
      icon: "null",
      iconColor: "text-white",
      iconBgColor: "bg-blue-500",
    },
  ]}
/>


      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <RefundFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        <RefundQuickStats
          pendingCount={stats.pendingRefunds}
          approvedCount={stats.approvedRefunds}
          rejectedCount={stats.rejectedRefunds}
        />
      </div>

      {/* Refunds Table */}
     <DataTable
  columns={columns}
  data={filteredRefunds}
  searchKeys={["orderId", "userName", "userEmail"]}
  onViewDetails={handleViewDetails}
  itemsPerPage={10}
/>

      {/* Refund Details Modal */}
      {selectedRefund && (
        <RefundDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          refund={selectedRefund}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
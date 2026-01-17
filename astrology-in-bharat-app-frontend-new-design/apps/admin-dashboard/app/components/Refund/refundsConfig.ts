// refund-management/config/refundsConfig.ts
import { RefundRequest } from './types';

export const mockRefunds: RefundRequest[] = [
  {
    id: "REF001",
    user: {
      id: "USER001",
      name: "Rahul Sharma",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
      email: "rahul@example.com"
    },
    astrologer: {
      id: "AST001",
      name: "Pandit Ji",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pandit",
      specialty: "Vedic Astrology"
    },
    consultation: {
      id: "CONS001",
      type: "video",
      duration: 45,
      amount: 1500,
      date: new Date("2024-01-15")
    },
    reason: "Astrologer didn't join the session on time",
    amount: 1500,
    requestedAmount: 1500,
    status: "pending",
    priority: "high",
    requestedAt: new Date("2024-01-16"),
    attachments: ["chat-screenshot.jpg"]
  },
  {
    id: "REF002",
    user: {
      id: "USER002",
      name: "Priya Patel",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      email: "priya@example.com"
    },
    astrologer: {
      id: "AST002",
      name: "Guruji",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guruji",
      specialty: "Numerology"
    },
    consultation: {
      id: "CONS002",
      type: "audio",
      duration: 30,
      amount: 800,
      date: new Date("2024-01-14")
    },
    reason: "Poor audio quality throughout the session",
    amount: 800,
    requestedAmount: 400,
    status: "approved",
    priority: "medium",
    requestedAt: new Date("2024-01-15"),
    reviewedBy: "Admin User",
    reviewedAt: new Date("2024-01-16"),
    notes: "Partial refund approved due to service quality issue"
  },
  // Add more mock data...
];

export const filters = [
  { key: "all", label: "All Refunds" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "processing", label: "Processing" },
  { key: "high", label: "High Priority" }
];

export const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-gray-100 text-gray-800"
};

export const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
};
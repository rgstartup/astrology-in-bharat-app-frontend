export interface Dispute {
  id: number;
  disputeId: string;
  user: string;
  expert: string;
  subject: string;
  description: string;
  amount: number;
  category: "Payment" | "Service Quality" | "Refund" | "Technical" | "Other";
  status: "pending" | "under_review" | "resolved" | "rejected" | "close_requested";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  resolvedAt: string | null;
  raisedBy: "user" | "expert";
}
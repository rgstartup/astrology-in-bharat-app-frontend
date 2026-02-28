export interface Dispute {
  id: number;
  dispute_id?: string; // Some versions might use snake_case
  disputeId?: string;  // Maintain backward compatibility for now
  user: string | any;
  expert: string | any;
  subject?: string;
  description: string;
  amount?: number;
  category: string;
  status: "pending" | "under_review" | "resolved" | "rejected" | "close_requested" | "open" | "in_progress" | "closed";
  priority?: "low" | "medium" | "high" | "urgent";
  createdAt?: string;
  created_at?: string;
  resolvedAt?: string | null;
  resolved_at?: string | null;
  raisedBy?: "user" | "expert";
  raised_by?: "user" | "expert";
}




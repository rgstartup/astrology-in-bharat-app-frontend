// refund-management/types/refund.types.ts
export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface Expert {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
}

export interface Consultation {
  id: string;
  type: string;
  realType: string;
  duration: number;
  amount: number;
  date: Date;
}

export type RefundStatus = 
  | "pending" 
  | "approved" 
  | "rejected" 
  | "processing" 
  | "completed";

export type RefundPriority = "low" | "medium" | "high" | "urgent";

export interface RefundRequest {
  id: string;
  user: User;
  expert: Expert;
  consultation: Consultation;
  reason: string;
  amount: number;
  requestedAmount: number;
  status: RefundStatus;
  priority: RefundPriority;
  requestedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  notes?: string;
  attachments?: string[];
}




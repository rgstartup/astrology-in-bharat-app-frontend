/**
 * types/expert.ts
 * Centralized TypeScript type definitions for Expert domain.
 * Import from here instead of scattered component-level types.
 */

// ─── Auth / User ─────────────────────────────────────────────────────────────

export interface ExpertUser {
  id: string;
  name?: string;
  email?: string;
  roles?: Array<string | { name: string }>;
  is_available?: boolean;
  isAvailable?: boolean;
  // Profile specifics (merged from expert profile)
  profileId?: string;
  userId?: string;
  kycStatus?: string;
  rejectionReason?: string;
  experienceInYears?: number;
  phoneNumber?: string;
  totalReviews?: number;
  totalLikes?: number;
  consultationCount?: number;
  profilePic?: string;
  avatar?: string;
}

// ─── KYC ─────────────────────────────────────────────────────────────────────

export type KycStatus = "pending" | "active" | "approved" | "rejected";

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalChatSessions: number;
  totalEarnings: number;
  averageRating: number;
  totalReviews: number;
  today_appointments?: number;
  completed_today?: number;
  expired_today?: number;
  today_earnings?: number;
  total_appointments?: number;
  total_completed?: number;
  total_expired?: number;
  total_earnings?: number;
  trends: {
    sessions: string;
    earnings: string;
  };
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  user?: {
    name?: string;
    avatar?: string;
  };
}

export interface ReviewStats {
  rating: number;
  totalReviews: number;
  counts: Record<number, number>; // { 1: 3, 2: 5, 3: 10, 4: 20, 5: 50 }
}

// ─── Appointment ─────────────────────────────────────────────────────────────

export type SessionStatus = "pending" | "active" | "completed" | "expired" | "cancelled";

export interface RecentAppointment {
  id: string | string;
  name: string;
  email: string;
  date: string;
  status: SessionStatus;
  terminatedBy?: string;
}

// ─── Layout ──────────────────────────────────────────────────────────────────

export interface LayoutProps {
  children: React.ReactNode;
}

// ─── Notification ────────────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  message?: string; // Legacy field for component compatibility
  createdAt: string;
  created_at?: string; // Legacy field
  read: boolean;
  type?: "info" | "success" | "error" | "warning";
}

/**
 * Expert Dashboard Stats API Response Contracts
 */

import { PaginationMeta } from "../../types/paginated.response";

export interface DashboardStats {
  totalChatSessions: number;
  totalEarnings: number;
  averageRating: number;
  totalReviews: number;
  walletBalance: number;
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

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
  message?: string;
}

export interface GetDashboardStatsParams {
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate?: string;
  endDate?: string;
}
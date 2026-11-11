/**
 * Expert Dashboard Stats API Response Contracts
 */

import { PaginationMeta } from "../../types/paginated.response";

export interface DashboardStats {
  total_chat_sessions: number;
  total_earnings: number;
  average_rating: number;
  total_reviews: number;
  wallet_balance: number;
  today_appointments?: number;
  completed_today?: number;
  expired_today?: number;
  today_earnings?: number;
  total_appointments?: number;
  total_completed?: number;
  total_expired?: number;
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
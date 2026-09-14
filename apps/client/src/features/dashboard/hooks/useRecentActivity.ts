"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { PATHS } from "@repo/routes";
import {
  fetchRecentKundliReports,
  fetchConsultationHistory,
  fetchMyOrders,
} from "../api/dashboard.api";

export interface ActivityItem {
  id: string;
  type: "report" | "consultation" | "order" | "horoscope";
  title: string;
  subtitle: string;
  date: string;
  relativeTime: string;
  link: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

function getRelativeTimeString(dateStr?: string): string {
  if (!dateStr) return "Recently";
  const now = Date.now();
  const target = new Date(dateStr).getTime();
  if (isNaN(target)) return "Recently";

  const diffMs = now - target;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function useRecentActivity() {
  const { isAuthenticated } = useAuthStore();
  const [data, setData] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchActivities = useCallback(async () => {
    if (!isAuthenticated) {
      setData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const activities: ActivityItem[] = [];

    // 1. Fetch recent Kundli reports
    try {
      const [reportsRes] = await fetchRecentKundliReports();
      const reports = Array.isArray(reportsRes?.data) ? reportsRes.data : [];
      reports.slice(0, 2).forEach((rep: any) => {
        activities.push({
          id: `rep-${rep.id}`,
          type: "report",
          title: "Kundli Matching Report",
          subtitle: rep.boy_details?.name
            ? `Generated for ${rep.boy_details.name} & ${rep.girl_details?.name || "Partner"}`
            : "Kundli report generated",
          date: rep.created_at || new Date().toISOString(),
          relativeTime: getRelativeTimeString(rep.created_at),
          link: `${PATHS.DASHBOARD_REPORTS}`,
          icon: "fa-solid fa-scroll",
          iconBg: "bg-purple-50",
          iconColor: "text-purple-600",
        });
      });
    } catch {
      // Silently continue
    }

    // 2. Fetch recent consultations
    try {
      const [consultRes] = await fetchConsultationHistory(3);
      const consultations = Array.isArray(consultRes?.data)
        ? consultRes.data
        : Array.isArray(consultRes)
        ? consultRes
        : [];
      consultations.slice(0, 2).forEach((c: any) => {
        activities.push({
          id: `consult-${c.id}`,
          type: "consultation",
          title: `Consultation with ${c.expert?.user?.name || c.expert_name || "Astrology Expert"}`,
          subtitle: `${c.type || "Chat"} consultation completed`,
          date: c.created_at || c.start_time || new Date().toISOString(),
          relativeTime: getRelativeTimeString(c.created_at || c.start_time),
          link: `${PATHS.DASHBOARD_CONSULTATIONS}`,
          icon: "fa-solid fa-comments",
          iconBg: "bg-emerald-50",
          iconColor: "text-emerald-600",
        });
      });
    } catch {
      // Silently continue
    }

    // 3. Fetch recent orders
    try {
      const [ordersRes] = await fetchMyOrders(2);
      const orders = Array.isArray(ordersRes?.data)
        ? ordersRes.data
        : Array.isArray(ordersRes)
        ? ordersRes
        : [];
      orders.slice(0, 2).forEach((ord: any) => {
        activities.push({
          id: `order-${ord.id}`,
          type: "order",
          title: `Order #${ord.order_number || String(ord.id).slice(0, 8).toUpperCase()}`,
          subtitle: ord.status ? `Status: ${ord.status}` : "Astrological item order",
          date: ord.created_at || new Date().toISOString(),
          relativeTime: getRelativeTimeString(ord.created_at),
          link: `${PATHS.DASHBOARD_ORDERS}`,
          icon: "fa-solid fa-bag-shopping",
          iconBg: "bg-orange-50",
          iconColor: "text-orange-600",
        });
      });
    } catch {
      // Silently continue
    }

    // Sort by date descending
    activities.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setData(activities);
    setIsLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { data, isLoading, refetch: fetchActivities };
}

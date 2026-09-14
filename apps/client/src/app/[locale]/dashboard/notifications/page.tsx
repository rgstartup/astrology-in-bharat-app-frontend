"use client";

import React, { useState } from "react";
import { Card, Button } from "@/features/dashboard";
import { useNotification } from "@/store/useNotificationStore";
import {
  Bell,
  Sparkles,
  MessageSquare,
  ShoppingBag,
  Trash2,
} from "lucide-react";

type NotificationCategory =
  "all" | "consultations" | "astrology" | "orders" | "system";

export default function NotificationsDashboardPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<NotificationCategory>("all");
  const { notifications, isLoading, markNotificationAsRead, reset } =
    useNotification();

  const categories: { id: NotificationCategory; label: string }[] = [
    { id: "all", label: "All" },
    { id: "consultations", label: "Consultations" },
    { id: "astrology", label: "Astrology" },
    { id: "orders", label: "Orders" },
    { id: "system", label: "System" },
  ];

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "consultation":
      case "consultations":
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case "astrology":
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case "order":
      case "orders":
        return <ShoppingBag className="w-4 h-4 text-orange-600" />;
      default:
        return <Bell className="w-4 h-4 text-[#ff6b00]" />;
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (selectedCategory === "all") return true;
    const cat = notif.type?.toLowerCase();
    return cat === selectedCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#301118] font-outfit">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Stay updated with your daily horoscope alerts, consultation starts,
            and order updates
          </p>
        </div>

        {notifications.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            className="border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            <span>Clear All</span>
          </Button>
        )}
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === c.id
                ? "bg-[#ff6b00] text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-orange-50 border border-orange-100"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="p-4 bg-white border-orange-100 h-16 animate-pulse"
            />
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <Card className="p-12 text-center border-orange-100 bg-white">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800 font-outfit mb-1">
            No Notifications Found
          </h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            You are all caught up! You'll receive updates when your horoscope is
            ready or consultations begin.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <Card
              key={notif.id}
              onClick={() => !notif.is_read && markNotificationAsRead(notif.id)}
              className={`p-4 transition-all cursor-pointer border ${
                notif.is_read
                  ? "bg-white border-slate-100"
                  : "bg-orange-50/40 border-orange-200/80 shadow-xs"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-white border border-orange-100 shrink-0">
                  {getCategoryIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {notif.title || notif.message}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                      {notif.created_at
                        ? new Date(notif.created_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )
                        : "Recent"}
                    </span>
                  </div>
                  {notif.title && notif.message && (
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Card, Button } from "@/features/dashboard";
import { Shield, Bell, Globe, Moon, Lock } from "lucide-react";
import { toast } from "react-toastify";

export default function SettingsDashboardPage() {
  const [dailyNotifications, setDailyNotifications] = useState(true);
  const [consultationAlerts, setConsultationAlerts] = useState(true);
  const [language, setLanguage] = useState("en");

  const handleSave = () => {
    toast.success("Preferences updated successfully!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      <div className="border-b border-orange-100 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-[#301118] font-outfit">
          Account Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Customize your astrological notifications, language preferences, and security
        </p>
      </div>

      <div className="space-y-6">
        {/* Notifications Settings */}
        <Card className="p-6 border-orange-100 bg-white">
          <div className="flex items-center gap-2.5 mb-4">
            <Bell className="w-5 h-5 text-[#ff6b00]" />
            <h3 className="text-base font-bold text-slate-900 font-outfit">
              Notification Preferences
            </h3>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <p className="font-semibold text-slate-800">Daily Horoscope Alerts</p>
                <p className="text-xs text-slate-500">
                  Receive personalized planetary transit guidance every morning
                </p>
              </div>
              <input
                type="checkbox"
                checked={dailyNotifications}
                onChange={(e) => setDailyNotifications(e.target.checked)}
                className="w-4 h-4 accent-[#ff6b00] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold text-slate-800">Consultation Reminders</p>
                <p className="text-xs text-slate-500">
                  Get notified 15 minutes before scheduled expert sessions
                </p>
              </div>
              <input
                type="checkbox"
                checked={consultationAlerts}
                onChange={(e) => setConsultationAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#ff6b00] rounded cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* Language & Regional */}
        <Card className="p-6 border-orange-100 bg-white">
          <div className="flex items-center gap-2.5 mb-4">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 font-outfit">
              Language & Regional Settings
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-slate-800">Preferred Language</p>
              <p className="text-xs text-slate-500">
                Choose the display language for charts and forecasts
              </p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-orange-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="font-bold">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}

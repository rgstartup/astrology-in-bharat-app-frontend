"use client";
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DashboardBanners } from "@/components/dashboard/DashboardBanners";
import "react-calendar/dist/Calendar.css";
import { LayoutProps } from "@/types/expert";
import { useAuthStore } from "@/store/useAuthStore";

interface DashboardLayoutProps extends LayoutProps {
  stats: React.ReactNode;
  recentActivity: React.ReactNode;
  recentAppointments: React.ReactNode;
  consultationRatings: React.ReactNode;
  manageServices: React.ReactNode;
}

const Layout: React.FC<DashboardLayoutProps> = ({
  children,
  stats,
  recentActivity,
  recentAppointments,
  consultationRatings,
  manageServices,
}) => {
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/images/back-image.webp')" }}
        suppressHydrationWarning
      >
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Section */}
        <div className="min-w-0 lg:ml-64 flex flex-col min-h-screen">
          {/* Transparent Glass Header */}
          <header className="bg-white/40 backdrop-blur-xl border-b border-white/20 sticky top-0 z-30 shadow-sm">
            <Header toggleSidebar={toggleSidebar} />
          </header>

          <main className="p-4 sm:p-6 text-black flex-1">
            {/* Dashboard Status Banners (KYC/Approval) */}
            <DashboardBanners />

            {/* Welcome header */}
            <div className="flex items-center justify-between min-w-0 mb-8">
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.name || "Expert"}!
                </h2>
                <p className="text-gray-700 mt-1">
                  Here's what's happening with your consultations today.
                </p>
              </div>
            </div>

            {/* Stats */}
            <section>{stats}</section>

            {/* Recent Activity + Recent Appointments */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div>{recentActivity}</div>
              <div className="lg:col-span-2">{recentAppointments}</div>
            </section>

            {/* Consultation Ratings + Manage Services */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-6">{consultationRatings}</div>
              <div>{manageServices}</div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;

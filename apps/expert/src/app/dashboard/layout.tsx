"use client";
import React, { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { ChatNotificationListener } from "@/components/notifications/ChatNotificationListener";
import { CallNotificationListener } from "@/components/notifications/CallNotificationListener";
import { LayoutProps } from "@/types/expert";
import { Loading } from "@repo/ui";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isAuthenticated, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !loading && !isAuthenticated) {
      router.push("/");
    }
  }, [isMounted, loading, isAuthenticated, router]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (!isMounted || loading) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <ChatNotificationListener />
      <CallNotificationListener />
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
          
          <main className="p-4 sm:p-6 text-black flex-1"> {children}</main>
        </div>
      </div>
    </>
  );
};

export default Layout;



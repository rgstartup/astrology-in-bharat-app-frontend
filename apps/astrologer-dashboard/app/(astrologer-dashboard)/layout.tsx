"use client";
import React from "react";
import { Sidebar } from "@/components/common/Sidebar";
import { Header } from "@/components/common/Header";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Section */}
        <div className="flex-1 lg:ml-64">
          <Header toggleSidebar={toggleSidebar} />
          <main className="p-6"> {children}</main>
        </div>
      </div>
    </>
  );
};

export default Layout;

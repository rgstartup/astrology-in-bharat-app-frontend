"use client";

import React, { useState } from "react";
import { Sidebar } from "@/app/components/common/Sidebar";
import { Header } from "@/app/components/common/Header";
import "react-calendar/dist/Calendar.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (





    <main className="p-6">{children}</main>


  );
};

export default Layout;

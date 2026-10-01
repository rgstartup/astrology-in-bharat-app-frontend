"use client";

import React, { useState, useEffect } from "react";
import { CLIENT_API_URL } from "@/lib/config";
import { BrandingSection } from "./BrandingSection";
import { LoginForm } from "./LoginForm";

export const LoginView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalExperts: "0+",
    totalServices: "0+",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${CLIENT_API_URL}/public/stats/expert-hub`);
        const json = await response.json();
        if (json?.success && json?.data) {
          const experts = json.data.total_experts ?? json.data.totalExperts ?? 0;
          const services = json.data.totalServices ?? 0;

          setStats({
            totalExperts: `${experts}+`,
            totalServices: `${services}+`,
          });
        }
      } catch (error) {
        console.error("Failed to fetch expert stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="h-screen bg-[#FFF9F4] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans overflow-hidden">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-[32px] sm:rounded-[40px] shadow-premium bg-white border border-gray-100 max-h-[95vh] overflow-y-auto no-scrollbar">
        <BrandingSection stats={stats} />
        <LoginForm onLoadingChange={setLoading} />
      </div>
    </div>
  );
};

export default LoginView;

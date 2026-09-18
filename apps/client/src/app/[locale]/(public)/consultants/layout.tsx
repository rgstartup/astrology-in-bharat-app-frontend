import React from "react";
import { ConsultantsBreadcrumb } from "@/features/explore-experts/components/ConsultantsBreadcrumb";

export default function ConsultantsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-gray-900 flex flex-col">
      {/* Root Breadcrumb for all Consultants routes */}
      <ConsultantsBreadcrumb />
      
      {/* Route Content (Explore parallel layout or [id] detail page) */}
      <div className="flex-1 w-full">
        {children}
      </div>
    </div>
  );
}

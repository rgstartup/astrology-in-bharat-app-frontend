"use client";

import React from "react";

interface DashboardBannersProps {
  className?: string;
}

export const DashboardBanners: React.FC<DashboardBannersProps> = ({ className = "" }) => {
  // KYC banners deprecated - keeping component for future status banners
  return null;
};

export default DashboardBanners;
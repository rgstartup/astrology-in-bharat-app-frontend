import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expert Login | Astrology in Bharat",
  description: "Astrology in Bharat - Expert Consultation Portal Login",
};

export interface LoginLayoutProps {
  branding: React.ReactNode;
  form: React.ReactNode;
  children?: React.ReactNode;
}

export default function LoginLayout({ branding, form }: LoginLayoutProps) {
  return (
    <div className="h-screen bg-[#FFF9F4] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans overflow-hidden">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-[32px] sm:rounded-[40px] shadow-premium bg-white border border-gray-100 max-h-[95vh] overflow-y-auto no-scrollbar">
        {branding}
        {form}
      </div>
    </div>
  );
}

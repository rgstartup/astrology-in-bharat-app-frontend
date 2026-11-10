import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expert Login | Astrology in Bharat",
  description: "Astrology in Bharat - Expert Portal Login",
};

export interface LoginLayoutProps {
  branding: React.ReactNode;
  form: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * LoginLayout for Expert Portal.
 * Distinct warm canvas with ambient illumination and 2-column grid.
 */
export default function LoginLayout({ branding, form }: LoginLayoutProps) {
  return (
    <section className="relative flex-1 flex items-center justify-center w-full min-h-screen lg:h-screen lg:max-h-screen bg-white font-sans py-4 sm:py-6 lg:py-8 overflow-y-auto lg:overflow-hidden">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 xl:gap-24 2xl:gap-28 items-stretch">
          {/* Left Column: Form & Brand */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between h-full w-full">
            {form}
          </div>

          {/* Right Column: Embedded Showcase Card matching left side height */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-6 w-full justify-end items-stretch h-full">
            {branding}
          </div>
        </div>
      </div>
    </section>
  );
}

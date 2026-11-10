"use client";

import React from "react";
import { AuthHeader, AuthFooter, LoginForm } from "@/features/auth";

export default function LoginFormSlotPage() {
  return (
    <div className="flex flex-col justify-between w-full h-full">
      {/* Top Left: Brand Logo */}
      <div className="w-full flex justify-start mb-8 lg:mb-12">
        <AuthHeader subtitle="EXPERT PORTAL" title="Astrology in Bharat" />
      </div>

      {/* Center: Pure LoginForm */}
      <div className="w-full max-w-[420px] ml-auto mr-0 lg:mr-6 my-auto">
        <LoginForm />
      </div>

      {/* Bottom: AuthFooter */}
      <AuthFooter />
    </div>
  );
}

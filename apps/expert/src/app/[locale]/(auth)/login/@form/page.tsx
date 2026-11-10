"use client";

import React from "react";
import { AuthHeader, AuthFooter, LoginForm } from "@/features/auth";

export default function LoginFormSlotPage() {
  return (
    <div className="flex flex-col justify-between w-full flex-1 h-full min-h-[calc(100dvh-1.25rem)] lg:min-h-0">
      {/* Top Left: Brand Logo */}
      <div className="w-full flex justify-start pt-0.5 sm:pt-2 mb-8 sm:mb-8 lg:mb-10">
        <AuthHeader subtitle="Astrology in Bharat" title="EXPERT PORTAL" />
      </div>

      {/* Center/Upper Third: LoginForm */}
      <div className="w-full max-w-[420px] mx-auto lg:ml-auto lg:mr-6 lg:mx-0 mt-3 sm:mt-6 lg:my-auto mb-auto">
        <LoginForm />
      </div>

      {/* Bottom: AuthFooter */}
      <AuthFooter />
    </div>
  );
}

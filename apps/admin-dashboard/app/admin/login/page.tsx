"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Login components
import { LoginForm } from "@/app/components/Login/LoginForm";
import { LoginHeader } from "@/app/components/Login/LoginHeader";
import { LoginFooter } from "@/app/components/Login/LoginFooter";

export default function AdminLoginPage() {
  const router = useRouter();
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle login form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation - redirect if both fields filled
    if (email && password) {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with logo and title */}
          <LoginHeader />
          
          {/* Login form with email and password */}
          <LoginForm
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleLogin}
          />
          
          {/* Footer with security notice */}
          <LoginFooter />
        </div>
      </div>
    </div>
  );
}
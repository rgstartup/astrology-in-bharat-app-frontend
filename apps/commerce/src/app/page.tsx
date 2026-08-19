"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Login from "@/features/auth/components/Login";

export default function RootPage() {
  const { isAuthenticated, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  // Optionally show a loading state while checking auth
  if (loading && !isAuthenticated) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
         <div className="w-12 h-12 border-4 border-[#fd6410] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Login />
  );
}

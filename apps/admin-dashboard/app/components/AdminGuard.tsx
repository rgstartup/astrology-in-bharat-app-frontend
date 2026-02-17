"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/useAuthStore";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuthStore();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !user) {
        router.replace("/");
        return;
      }

      const isAdmin = user?.roles?.some((r: any) =>
        (typeof r === 'string' ? r : r.name).toUpperCase() === "ADMIN"
      );

      if (!isAdmin) {
        router.replace("/");
      }
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}





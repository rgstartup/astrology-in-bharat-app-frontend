"use client"; // 🔥 mandatory for client hooks

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // 👈 App Router version

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const hasToken = document.cookie.includes("accessToken");

    if (!hasToken) {
      router.replace("/"); // redirect if no token
    }
  }, [router]);

  return <>{children}</>;
}

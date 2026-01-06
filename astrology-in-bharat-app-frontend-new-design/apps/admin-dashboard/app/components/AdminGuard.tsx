"use client"; // 🔥 mandatory for client hooks

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 👈 App Router version

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
      };

      const token = getCookie("accessToken");
      const userCookie = getCookie("user");

      if (!token || !userCookie) {
        router.replace("/");
        return;
      }

      try {
        const user = JSON.parse(decodeURIComponent(userCookie));
        const isAdmin = user?.roles?.some((r: any) => r.name.toUpperCase() === "ADMIN");

        if (!isAdmin) {
          router.replace("/"); // or unauthorized page
        } else {
          setAuthorized(true);
        }
      } catch (e) {
        router.replace("/");
      }
    };

    checkAuth();
  }, [router]);

  if (!authorized) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}

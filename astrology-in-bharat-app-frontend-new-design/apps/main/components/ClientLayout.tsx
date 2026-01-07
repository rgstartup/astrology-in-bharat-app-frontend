"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header, Footer } from "@repo/ui";
import ToastProvider from "./ToastProvider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // Load Bootstrap JS for modal functionality
  useEffect(() => {
    // Dynamically import Bootstrap JS only on client side
    // @ts-ignore - Bootstrap JS doesn't have type declarations
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <>
      <ToastProvider />
      {!isAdminRoute && <Header />}
      <main>{children}</main>
      {!isAdminRoute && <Footer />}
    </>
  );
}

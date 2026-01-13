"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@packages/ui/src/Header";
import Footer from "@packages/ui/src/Footer";
import ToastProvider from "./ToastProvider";
import { useClientAuth } from "@packages/ui/src/context/ClientAuthContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const { isClientAuthenticated, clientUser, clientLogout } = useClientAuth();

  // Load Bootstrap JS for modal functionality
  useEffect(() => {
    // Dynamically import Bootstrap JS only on client side
    // @ts-ignore - Bootstrap JS doesn't have type declarations
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <>
      <ToastProvider />
      {!isAdminRoute && (
        <Header
          authState={isClientAuthenticated}
          userData={clientUser}
          logoutHandler={clientLogout}
        />
      )}
      <main>{children}</main>
      {!isAdminRoute && <Footer />}
    </>
  );
}

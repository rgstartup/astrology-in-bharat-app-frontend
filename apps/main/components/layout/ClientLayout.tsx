"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header, Footer, useClientAuth } from "@repo/ui";
import ToastProvider from "./ToastProvider";
import FloatingChatButton from "../features/chat/FloatingChatButton";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isChatRoom = pathname?.includes("/chat/room");
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
      {!isAdminRoute && !isChatRoom && (
        <Header
          authState={isClientAuthenticated}
          userData={clientUser}
          logoutHandler={clientLogout}
        />
      )}
      <main>{children}</main>
      <script>
        {`console.log("[ClientLayoutDebug] Render conditions - isAdmin:", ${isAdminRoute}, "isChatRoom:", ${isChatRoom});`}
      </script>
      {!isAdminRoute && !isChatRoom && <FloatingChatButton />}
      {!isAdminRoute && !isChatRoom && <Footer />}
    </>
  );
}



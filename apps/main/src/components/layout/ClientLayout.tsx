"use client";

import { useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@repo/ui";
import Header from "../features/header";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import FloatingChatButton from "../features/chat/FloatingChatButton";
import { merchantSocket } from "@/lib/socket";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isChatRoom = pathname?.includes("/chat/room");
  const { user, logout, balance } = useAuthStore();
  const { cartCount } = useCartStore();

  useEffect(() => {
    // setMounted(true);

    console.log({ user });
    console.log(
      "🌊 [Main App] ClientLayout mounted - WebSocket active:",
      merchantSocket.id || "Connecting...",
    );
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header show={!isChatRoom} />

      <main className="flex-1">
        <Suspense fallback={null}>{children}</Suspense>
      </main>
      <FloatingChatButton show={!isChatRoom} />
      {!isChatRoom && <Footer />}
    </div>
  );
}

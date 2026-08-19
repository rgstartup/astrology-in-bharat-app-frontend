"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import { Header, Footer } from "@repo/ui";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import ToastProvider from "./ToastProvider";
import FloatingChatButton from "../features/chat/FloatingChatButton";
import { merchantSocket } from "@/lib/socket";
import PlatformReviewModal from "../features/reviews/PlatformReviewModal";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const isAdminRoute = pathname?.startsWith("/admin");
  const isChatRoom = pathname?.includes("/chat/room");
  const isHomePage = pathname === "/";
  const { isAuthenticated, user, logout, balance } = useAuthStore();
  const { cartCount } = useCartStore();


  useEffect(() => {
    setMounted(true);
    console.log("🌊 [Main App] ClientLayout mounted - WebSocket active:", merchantSocket.id || "Connecting...");
  }, []);

  // Show review modal after 10s on homepage for logged-in users (only once)
  useEffect(() => {
    if (!mounted || !isAuthenticated || !isHomePage) return;

    const hasSeenModal = localStorage.getItem("platform_review_shown");
    if (hasSeenModal) return;

    const timer = setTimeout(() => {
      setShowReviewModal(true);
      localStorage.setItem("platform_review_shown", "true");
    }, 10000);

    return () => clearTimeout(timer);
  }, [mounted, isAuthenticated, isHomePage]);

  return (
    <div className="flex flex-col min-h-screen">
      {mounted && <ToastProvider />}
      {!isAdminRoute && !isChatRoom && (
        <Header
          authState={isAuthenticated}
          userData={user}
          logoutHandler={logout}
          balance={balance}
          cartCount={cartCount}
        />
      )}
      <main suppressHydrationWarning className="flex-1">
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </main>
      {mounted && !isAdminRoute && !isChatRoom && <FloatingChatButton />}
      {mounted && showReviewModal && (
        <PlatformReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          userName={user?.name?.split(" ")[0]}
        />
      )}
      {!isAdminRoute && !isChatRoom && <Footer />}
    </div>
  );
}



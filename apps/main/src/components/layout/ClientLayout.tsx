"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@repo/ui";
import Header from "@/features/header";
import FloatingChatButton from "../features/chat/FloatingChatButton";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChatRoom = pathname?.includes("/chat/room");
  // useEffect(() => {
  //   // setMounted(true);

  //   console.log(
  //     "🌊 [Main App] ClientLayout mounted - WebSocket active:",
  //     merchantSocket.id || "Connecting...",
  //   );
  // }, []);

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

import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "swiper/css";
import "swiper/css/navigation";

import "@repo/ui/styles/index.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { AuthInitializer } from "@/components/layout/AuthInitializer";
import { CartInitializer } from "@/components/layout/CartInitializer"; // Changed import
import { WishlistInitializer } from "@/components/layout/WishlistInitializer";
import { Metadata } from "next";
import { cookies } from "next/headers";
import QueryProvider from "@/providers/QueryProvider";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { decodeToken, getErrorMessage } from "@repo/lib";
import { ClientUser } from "@/store/useAuthStore";



export const metadata: Metadata = {
  title: "Astrology in Bharat",
  description: "Find the best experts in Bharat",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Fetch user on server
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  type TClientPayload = {
    sub: string;
    email: string;
  } | null;

  let clientUser: ClientUser | null = null;

  if (token) {
    try {
      // Pass both header and cookie to support different backend auth strategies
      const user = decodeToken(token) as TClientPayload;
      console.log("Server-side auth check user:", user);

      if (!user || !user.sub || !user.email) {
        throw new Error("user not found");
      }

      clientUser = {
        id: user.sub,
        email: user.email,
      }

    } catch (err: any) {
      const errorMsg = getErrorMessage(err);
      if (errorMsg !== "Unauthorized" && !errorMsg.includes("Unauthorized")) {
        console.error("[RootLayout] Server-side auth check failed:", errorMsg);
      }
    }
  }

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-white text-black font-sans" suppressHydrationWarning>
        <QueryProvider>
          <AuthInitializer initialUser={clientUser}>
            <CartInitializer>
              <WishlistInitializer>
                <SmoothScroll>
                  <ClientLayout>{children}</ClientLayout>
                </SmoothScroll>
              </WishlistInitializer>
            </CartInitializer>
          </AuthInitializer>
        </QueryProvider>
      </body>
    </html>
  );
}

// Helper to handle client-side conditional rendering of Header/Footer
// Actually, it's cleaner to just put Header/Footer inside ClientLayout and handle logic there.
// I will update ClientLayout in the next step to include Header/Footer logic.



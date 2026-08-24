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
import { AuthService } from "@/services/auth.service";
import QueryProvider from "@/providers/QueryProvider";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { getErrorMessage } from "@repo/lib";



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
  let user = null;

  if (token) {
    try {
      // Pass both header and cookie to support different backend auth strategies
      const [res, authError] = await AuthService.fetchProfile({
        Authorization: `Bearer ${token}`,
        Cookie: `accessToken=${token}`
      }) as any;

      if (!authError && res) {
        const raw = res?.data ?? res;
        user = raw?.user || (raw?.id ? raw : null);

        if (user) {
          // Unify the profile picture field so that Header has consistent data on SSR
          user.profile_picture = raw?.profile_picture || user.profile_picture || raw?.avatar || user.avatar;
          user.avatar = user.profile_picture;
        }
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
          {/* <AuthInitializer initialUser={user} hasToken={!!token}> */}
          <CartInitializer>
            <WishlistInitializer>
              <SmoothScroll>
                <ClientLayout>{children}</ClientLayout>
              </SmoothScroll>
            </WishlistInitializer>
          </CartInitializer>
          {/* </AuthInitializer> */}
        </QueryProvider>
      </body>
    </html>
  );
}

// Helper to handle client-side conditional rendering of Header/Footer
// Actually, it's cleaner to just put Header/Footer inside ClientLayout and handle logic there.
// I will update ClientLayout in the next step to include Header/Footer logic.



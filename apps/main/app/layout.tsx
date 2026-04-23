import "./globals.css";
import { Poppins, Outfit } from "next/font/google";
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

// Google Fonts setup
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Astrology in Bharat",
  description: "Find the best experts in Bharat",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch user on server via the better-auth session cookie
  const cookieStore = await cookies();
  const betterAuthToken = cookieStore.get("better-auth.session_token")?.value;
  let user = null;

  if (betterAuthToken) {
    try {
      const authServerUrl = process.env.AUTH_SERVER_URL || "http://localhost:3001";
      const sessionRes = await fetch(`${authServerUrl}/api/auth/get-session`, {
        headers: { Cookie: `better-auth.session_token=${betterAuthToken}` },
        cache: "no-store",
      });
      if (sessionRes.ok) {
        const session = await sessionRes.json();
        if (session?.user) {
          const su = session.user;
          user = {
            id: su.id,
            uid: su.id,
            name: su.name || "User",
            email: su.email || "",
            profile_picture: su.image || su.avatar,
            avatar: su.image || su.avatar,
            roles: su.role ? [su.role] : [],
          };
        }
      }
    } catch {
      // non-critical — session fetch failed, user will be treated as unauthenticated
    }
  }

  return (
    <html lang="en" className={`${outfit.variable} ${poppins.variable}`} data-scroll-behavior="smooth">

      <body className="min-h-screen bg-white text-black" suppressHydrationWarning>
        <QueryProvider>
          <AuthInitializer initialUser={user}>
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



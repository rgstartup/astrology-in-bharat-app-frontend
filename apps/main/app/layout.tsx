import "bootstrap/dist/css/bootstrap.min.css";
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
import { AuthService } from "@/services/auth.service";

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
  description: "Find the best astrologers in Bharat",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Fetch user on server
  const cookieStore = await cookies();
  const token = cookieStore.get("clientAccessToken")?.value;
  let user = null;

  if (token) {
    try {
      const res = await AuthService.fetchProfile({
        Authorization: `Bearer ${token}`,
      });
      // Handle the nested user object or direct object
      user = res.data.user || (res.data.id ? res.data : null);
    } catch (err) {
      console.error("Server-side auth check failed:", err);
    }
  }

  return (
    <html lang="en" className={`${outfit.variable} ${poppins.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"
        />
      </head>
      <body className="min-h-screen bg-white text-black">
        <AuthInitializer initialUser={user}>
          <CartInitializer>
            <WishlistInitializer>
              <ClientLayout>{children}</ClientLayout>
            </WishlistInitializer>
          </CartInitializer>
        </AuthInitializer>
      </body>
    </html>
  );
}

// Helper to handle client-side conditional rendering of Header/Footer
// Actually, it's cleaner to just put Header/Footer inside ClientLayout and handle logic there.
// I will update ClientLayout in the next step to include Header/Footer logic.



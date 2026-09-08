import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "swiper/css";
import "swiper/css/navigation";

import "@repo/ui/styles/index.css";
import { Metadata } from "next";
import ClientLayout from "@/components/layout/ClientLayout";
import { AuthInitializer } from "@/components/layout/AuthInitializer";
import { CartInitializer } from "@/components/layout/CartInitializer"; // Changed import
import { WishlistInitializer } from "@/components/layout/WishlistInitializer";
import ExpertStatusProvider from "@/providers/ExpertStatusProvider";
import MerchantStatusProvider from "@/providers/MerchantStatusProvider";
import NotificationProvider from "@/providers/NotificationProvider";
import SmoothScroll from "@/components/layout/SmoothScroll";
import ToastProvider from "@/components/layout/ToastProvider";
import PlatformReviewModal from "@/components/features/reviews";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import QueryProvider from "@/providers/QueryProvider";

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
  // const cookieStore = await cookies();
  const locale = await getLocale();

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen bg-white text-black font-sans"
        // suppressHydrationWarning
      >
        <NextIntlClientProvider>
          <ExpertStatusProvider>
            <MerchantStatusProvider>
              <NotificationProvider>
                <QueryProvider>
                  <AuthInitializer>
                    <CartInitializer>
                      <WishlistInitializer>
                        <SmoothScroll>
                          <ClientLayout>{children}</ClientLayout>
                        </SmoothScroll>
                      </WishlistInitializer>
                    </CartInitializer>
                    <PlatformReviewModal />
                  </AuthInitializer>
                </QueryProvider>
              </NotificationProvider>
            </MerchantStatusProvider>
          </ExpertStatusProvider>
        </NextIntlClientProvider>
        <ToastProvider />
      </body>
    </html>
  );
}

// Helper to handle client-side conditional rendering of Header/Footer
// Actually, it's cleaner to just put Header/Footer inside ClientLayout and handle logic there.
// I will update ClientLayout in the next step to include Header/Footer logic.

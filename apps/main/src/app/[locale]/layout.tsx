import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "swiper/css";
import "swiper/css/navigation";

import "@repo/ui/styles/index.css";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";

import { routing } from "@/i18n/routing";
import { AuthInitializer } from "@/components/layout/AuthInitializer";
import { CartInitializer } from "@/components/layout/CartInitializer";
import { WishlistInitializer } from "@/components/layout/WishlistInitializer";
import ExpertStatusProvider from "@/providers/ExpertStatusProvider";
import MerchantStatusProvider from "@/providers/MerchantStatusProvider";
import NotificationProvider from "@/providers/NotificationProvider";
import SmoothScroll from "@/components/layout/SmoothScroll";
import ToastProvider from "@/components/layout/ToastProvider";
import PlatformReviewModal from "@/components/features/reviews";
import QueryProvider from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Astrology in Bharat",
  description: "Find the best experts in Bharat",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

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
      <body className="min-h-screen bg-white text-black font-sans">
        <NextIntlClientProvider>
          <ExpertStatusProvider>
            <MerchantStatusProvider>
              <NotificationProvider>
                <QueryProvider>
                  <AuthInitializer>
                    <CartInitializer>
                      <WishlistInitializer>
                        <SmoothScroll>{children}</SmoothScroll>
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

import "@repo/design/styles";
import "@/styles/globals.css";
import "@repo/design/fontawesome.css";
import "@repo/design/swiper/css";
import "@repo/design/swiper/css/navigation";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";

import { routing } from "@/i18n/routing";
import { AuthInitializer } from "@/components/layout/AuthInitializer";
import { RealtimeProvider } from "@/realtime/socket.provider";
import MerchantStatusProvider from "@/providers/MerchantStatusProvider";
import NotificationProvider from "@/providers/NotificationProvider";
import { SmoothScroll, ToastProvider } from "@repo/design/components";
import PlatformReviewModal from "@/components/features/reviews";
import { ConsultationPrepHost } from "@/features/consultation-prep";
import { ConsultationPrepProvider } from "@/features/consultation-prep/stores/consultationPrepStore";
import { ConsultationRequestStateProvider } from "@/features/consultation-prep/stores/consultation-request-state.store";
import ConsultationTrackerHost from "@/features/consultation-tracker/consultation-tracker-host.component";
import QueryProvider from "@/providers/QueryProvider";
import { getMeAction } from "@/actions/auth";

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

  /**
   * get user data, and seed the auth store
   */
  const userResult = await getMeAction();
  const initialUser = userResult.ok ? userResult.data : null;

  return (
    <html lang={locale} data-theme="bharat" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Serif+Text:ital@0;1&family=Inter:wght@300;400;500;600;700;800;900&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Noto+Sans+Devanagari:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&family=Source+Code+Pro:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-black font-sans">
        <NextIntlClientProvider>
          <RealtimeProvider>
            <MerchantStatusProvider>
              <NotificationProvider>
                <QueryProvider>
                  <ConsultationPrepProvider>
                    <ConsultationRequestStateProvider>
                      <SmoothScroll>{children}</SmoothScroll>
                      <PlatformReviewModal />
                      <ConsultationPrepHost />
                      <ConsultationTrackerHost />
                    </ConsultationRequestStateProvider>
                  </ConsultationPrepProvider>
                </QueryProvider>
              </NotificationProvider>
            </MerchantStatusProvider>
          </RealtimeProvider>
          <AuthInitializer initialUser={initialUser} />
        </NextIntlClientProvider>
        <ToastProvider />
      </body>
    </html>
  );
}

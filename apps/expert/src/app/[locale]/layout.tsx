import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

import { ToastContainer } from "react-toastify";

import { AuthProvider, ReactQueryProvider } from "@/providers";
import { RealtimeProvider } from "@/realtime/socket-provider";
import { cn } from "@/lib/cn";

import "@repo/design/styles";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/index.css";

const geistSans = localFont({
  src: "../../styles/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../../styles/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn("font-sans", geistSans.variable, geistMono.variable)}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <NextIntlClientProvider>
          <ReactQueryProvider>
            <AuthProvider>
              <RealtimeProvider>
                {children}
                <ToastContainer position="top-right" />
                <ToastContainer containerId="notification" position="bottom-right" />
              </RealtimeProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

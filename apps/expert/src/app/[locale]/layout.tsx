import { Geist } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

import { ToastContainer } from "react-toastify";

import { AuthProvider } from "@/providers/AuthProvider";
import { SocketConnectionManager } from "@/components/layout/SocketConnectionManager";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { cn } from "@/lib/cn";

import "react-toastify/dist/ReactToastify.css";
import "@/styles/index.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  // const

  return (
    <html lang={locale} suppressHydrationWarning className={cn("font-sans", geist.variable)}>
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
              <SocketConnectionManager />
              {children}
              <ToastContainer position="top-right" />
              <ToastContainer containerId="notification" position="bottom-right" />
            </AuthProvider>
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

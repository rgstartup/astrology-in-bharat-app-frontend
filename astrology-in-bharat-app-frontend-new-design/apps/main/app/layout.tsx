"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import './globals.css';
import { Poppins, Outfit } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "@repo/styles";
import { Header, Footer } from "@repo/ui";
import QuotesLoader from "@/components/QuotesLoader";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // Load Bootstrap JS for modal functionality
  useEffect(() => {
    // Dynamically import Bootstrap JS only on client side
    // @ts-ignore - Bootstrap JS doesn't have type declarations
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <html lang="en" className={`${outfit.variable} ${poppins.variable}`}>
      <head>
        {/* Font Awesome CDN is optional since we already import it via npm */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"
        />
      </head>
      <body className="min-h-screen bg-white text-black">
        {/* {!isAdminRoute && <QuotesLoader />} */}
        {!isAdminRoute && <Header />}
        <main>{children}</main>
        {!isAdminRoute && <Footer />}
      </body>
    </html>
  );
}

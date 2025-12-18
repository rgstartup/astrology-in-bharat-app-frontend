"use client";
import { usePathname } from "next/navigation";
import { Poppins, Outfit } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
// import "@/styles/style.css";
import "@repo/styles";
import { Header, Footer } from "@repo/ui";
import QuotesLoader from "@/components/QuotesLoader";

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

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"
        />
      </head>
      <body className={`${outfit.variable} ${poppins.variable} `}>
        {!isAdminRoute && <QuotesLoader />}
        {!isAdminRoute && <Header />}
        {children}
        {!isAdminRoute && <Footer />}
      </body>
    </html>
  );
}
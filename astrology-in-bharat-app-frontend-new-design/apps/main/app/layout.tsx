import "./globals.css";
import { Poppins, Outfit } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "swiper/css";
import "swiper/css/navigation";

import "@repo/styles";
import ClientLayout from "@/components/ClientLayout";
import { Metadata } from "next";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // We can't use usePathname here in a Server Component for conditional rendering of Header/Footer based on path.
  // However, Header/Footer are usually client components or can be rendered always.
  // The original code used `usePathname` to hide Header/Footer on `/admin`.
  // Since we are moving to Server Component, we need a way to handle this.
  // OPTION: We can pass the logic to ClientLayout or just keep Header/Footer inside ClientLayout?
  // BUT the Header/Footer might need to be server rendered for SEO (nav links).
  // FOR NOW, to be safe and stick to the plan, I will keep Header/Footer here but I cannot use usePathname.
  // I will move the Header/Footer inside ClientLayout OR make a specific ClientWrapper for them.
  // Actually, checking standard practices:
  // If we need conditional rendering based on path in Layout, that part MUST be client side.
  // So I will move Header/Footer rendering into a ClientWrapper or just ClientLayout.
  // Let's modify ClientLayout to accept `isAdminRoute` or handle it inside.

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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

// Helper to handle client-side conditional rendering of Header/Footer
// Actually, it's cleaner to just put Header/Footer inside ClientLayout and handle logic there.
// I will update ClientLayout in the next step to include Header/Footer logic.

import type { Metadata } from "next";
import "./globals.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "Astrology in Bharat - Admin Dashboard",
  description: "Professional admin dashboard for astrology services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastContainer position="bottom-right" autoClose={5000} style={{ zIndex: 99999 }} />
        {children}
      </body>
    </html>
  );
}




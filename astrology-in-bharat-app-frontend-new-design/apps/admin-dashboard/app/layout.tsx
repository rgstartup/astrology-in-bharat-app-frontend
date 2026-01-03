import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
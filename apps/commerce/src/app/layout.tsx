import React from "react";
import { Inter, Outfit } from "next/font/google";
import { cookies } from "next/headers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { env } from "@/lib/config/env";
import { AuthInitializer } from "@/components/layout/AuthInitializer";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "Merchant Hub | Astrology in Bharat",
  description: "Manage your spiritual shop and reach millions of customers.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let initialUser = null;

  if (accessToken) {
    try {
      const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/merchant/profile`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
          Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
        },
        cache: 'no-store'
      });

      if (response.ok) {
        const data = await response.json();
        const payload = data?.data ?? data;
        
        if (payload) {
          initialUser = {
            ...payload,
            id: payload.merchantId || payload.id,
            status: payload.status,
            name: payload.shopName || payload.name
          };
        }
      }
    } catch (error) {
      console.error("Error fetching merchant profile server-side:", error);
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased bg-white overflow-x-hidden`}>
        <ReactQueryProvider>
          <AuthInitializer initialUser={initialUser}>
            <DashboardShell>
                {children}
            </DashboardShell>
            <ToastContainer 
                position="top-right" 
                autoClose={2000} 
                theme="colored" 
                hideProgressBar={false}
            />
          </AuthInitializer>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import React, { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthInitializer } from "./components/AuthInitializer";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-outfit">
        <ToastContainer position="bottom-right" autoClose={5000} style={{ zIndex: 99999 }} />
        <Suspense fallback={null}>
          <AuthInitializer>
            {children}
          </AuthInitializer>
        </Suspense>
      </body>
    </html>
  );
}

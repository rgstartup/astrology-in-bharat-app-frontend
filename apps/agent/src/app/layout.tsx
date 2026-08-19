import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import React, { Suspense } from "react";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
    title: "Agent Dashboard – AstrologyInBharat",
    description: "Manage your expert, mandir and puja shop listings and track your commissions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased font-sans bg-stone-50">
                <ToastContainer position="bottom-right" autoClose={4000} style={{ zIndex: 99999 }} />
                <Suspense fallback={null}>{children}</Suspense>
            </body>
        </html>
    );
}

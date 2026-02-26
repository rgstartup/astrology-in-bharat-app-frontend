import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import React, { Suspense } from "react";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
    title: "Agent Dashboard – AstrologyInBharat",
    description: "Manage your astrologer, mandir and puja shop listings and track your commissions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="antialiased font-outfit bg-stone-50">
                <ToastContainer position="bottom-right" autoClose={4000} style={{ zIndex: 99999 }} />
                <Suspense fallback={null}>{children}</Suspense>
            </body>
        </html>
    );
}

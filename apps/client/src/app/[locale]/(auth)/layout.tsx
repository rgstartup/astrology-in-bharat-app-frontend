import React, { Suspense } from "react";
import { Footer } from "@repo/ui";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col">
        <Suspense>{children}</Suspense>
      </main>

      <Footer />
    </div>
  );
}

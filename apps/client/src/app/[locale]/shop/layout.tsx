import React from "react";
import { ShopProvider, ShopInitializer, ShopHeader, ShopFooter } from "@/features/shop";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShopProvider>
      <ShopInitializer>
        <div className="shop-theme flex flex-col min-h-screen bg-white text-neutral-900 font-sans antialiased selection:bg-neutral-900 selection:text-white">
          <ShopHeader />
          <main className="flex-1">{children}</main>
          <ShopFooter />
        </div>
      </ShopInitializer>
    </ShopProvider>
  );
}

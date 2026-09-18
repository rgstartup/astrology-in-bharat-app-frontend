import React from "react";

interface ConsultantLayoutProps {
  children: React.ReactNode;
  profile: React.ReactNode;
  products: React.ReactNode;
}

export default function ConsultantLayout({
  children,
  profile,
  products,
}: ConsultantLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Profile Slot (Expert profile card, experience, reviews, videos, etc.) */}
      {profile}

      {/* 2. Products / Remedies Slot (Reports loaded by default, on-demand tabs for ritual, item, session) */}
      {products}

      {/* 3. Children Slot (SEO Content, Structured Schema, FAQs) */}
      {children}
    </main>
  );
}

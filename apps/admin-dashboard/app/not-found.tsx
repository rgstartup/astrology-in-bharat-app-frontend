"use client";

import { usePathname } from "next/navigation";
import { NotFound } from "../../shared/components/NotFound";

export default function AdminNotFoundPage() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <NotFound
        returnUrl="/admin/dashboard"
        returnLabel="Back to Admin Dashboard"
        title="Admin Page Not Found"
        imagePath="/images/Astrologer.png"
      />
    );
  }

  return (
    <NotFound
      returnUrl="/"
      returnLabel="Back to Home"
      imagePath="/images/Astrologer.png"
    />
  );
}
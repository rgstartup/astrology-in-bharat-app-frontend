"use client";

import { usePathname } from "next/navigation";
// 1. Original component ko kisi aur naam se import karo
import { NotFound as SharedNotFound } from "@repo/ui";

// 2. Ise 'any' cast kar do taaki React 19 types ka error chala jaye
const NotFound = SharedNotFound as any;

export default function AdminNotFoundPage() {
  const pathname = usePathname();
  
  // Pathname check safely
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <NotFound
        returnUrl="/admin/dashboard"
        returnLabel="Back to Admin Dashboard"
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




import { Suspense } from "react";
import { Footer } from "@repo/ui";
import Header from "@/features/header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header show={true} />

      <main className="flex-1">
        <Suspense>{children}</Suspense>
      </main>
      <Footer />
    </div>
  );
}

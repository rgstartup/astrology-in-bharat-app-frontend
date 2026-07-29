import VerifyEmail from "@/features/auth/components/VerifyEmail";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen bg-[#FFF9F4] flex flex-col items-center justify-center p-4">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <p className="mt-4 text-orange-600 font-bold text-xs">Loading Verification Hub...</p>
        </div>
    }>
      <VerifyEmail />
    </Suspense>
  );
}

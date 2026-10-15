"use client";

import { useRouter } from "@/i18n/navigation";
import WaitingCountdown from "../waiting-countdown.component";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from "@/components/ui/empty";

type RoomPendingBannerProps = {
  sessionStatus: string;
  expiresAt: string | null;
};

/** Waterfall: only the pending-with-expiry state renders a banner. */
export default function RoomPendingBanner({ sessionStatus, expiresAt }: RoomPendingBannerProps) {
  const router = useRouter();

  if (sessionStatus !== "pending") return null;
  if (!expiresAt) return null;

  return (
    <div className="flex shrink-0 justify-center bg-[#f5f1ec] px-4 pt-3">
      <Empty className="w-full max-w-md rounded-lg border border-[#d3cec6] bg-white p-4">
        <EmptyTitle className="text-[#111111]">Waiting for expert…</EmptyTitle>
        <EmptyDescription className="text-[#626260]">Your request is with the expert.</EmptyDescription>
        <EmptyContent>
          <WaitingCountdown expiresAt={expiresAt} onExpire={() => router.push("/")} />
          <Button
            variant="outline"
            className="rounded-lg border border-[#d3cec6] bg-white font-medium text-[#111111] hover:bg-white hover:text-[#111111]"
            onClick={() => router.push("/")}
          >
            Cancel
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}

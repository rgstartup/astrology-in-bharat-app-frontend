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

  if (sessionStatus !== "pending" || !expiresAt) return null;

  return (
    <div className="flex justify-center bg-background px-4 pt-3">
      <Empty className="p-4">
        <EmptyTitle>Waiting for expert…</EmptyTitle>
        <EmptyDescription>Your request is with the expert.</EmptyDescription>
        <EmptyContent>
          <WaitingCountdown expiresAt={expiresAt} onExpire={() => router.push("/")} />
          <Button variant="outline" onClick={() => router.push("/")}>
            Cancel
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}

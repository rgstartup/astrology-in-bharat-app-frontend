"use client";

import React from "react";
import { Button } from "@/components/ui/button";

type SummaryActionsProps = {
  status?: string;
  isDarkMode: boolean;
  router: any;
  onClose?: () => void;
};

function ExpiredActions({ router }: { router: any }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <Button className="w-full" onClick={() => router.push("/client/profile?tab=wallet")}>
        Recharge Wallet
      </Button>
      <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
        Go to Home
      </Button>
    </div>
  );
}

function TerminatedActions({ router }: { router: any }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <Button className="w-full" onClick={() => router.push("/")}>
        Back to Home
      </Button>
    </div>
  );
}

function CompletedActions({ router, onClose }: { router: any; onClose?: () => void }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <Button variant="outline" className="w-full" onClick={() => (onClose ? onClose() : router.push("/"))}>
        Close
      </Button>
      <Button variant="ghost" className="w-full" onClick={() => router.push("/")}>
        Back to Home
      </Button>
    </div>
  );
}

/** Waterfall: terminal states that need navigation get their own buttons. */
export default function SummaryActions({ status, router, onClose }: SummaryActionsProps) {
  if (status === "expired") return <ExpiredActions router={router} />;
  if (status === "terminated") return <TerminatedActions router={router} />;
  return <CompletedActions router={router} onClose={onClose} />;
}

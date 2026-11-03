"use client";

import React from "react";
import { Button } from "@repo/design/shadcn";

type Router = { push: (path: string) => void };

type SummaryActionsProps = {
  status?: string;
  isDarkMode?: boolean;
  router: Router;
  onClose?: () => void;
};

function ExpiredActions({ router }: { router: Router }) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <Button
        className="h-11 w-full rounded-xl bg-[#111111] text-sm font-medium text-white hover:bg-black cursor-pointer"
        onClick={() => router.push("/client/profile?tab=wallet")}
      >
        Recharge wallet
      </Button>
    </div>
  );
}

function TerminatedActions() {
  return null;
}

function CompletedActions({
  router,
  onClose,
}: {
  router: Router;
  onClose?: () => void;
}) {
  const handleClose = () => {
    onClose?.();
  };

  return (
    <div className="flex w-full flex-col gap-2.5">
      <Button
        variant="outline"
        className="h-11 w-full rounded-xl border-[#e3ded6] bg-white text-sm font-medium text-[#111111] hover:bg-[#f5f1ec] cursor-pointer"
        onClick={handleClose}
      >
        Close
      </Button>
    </div>
  );
}

/** Waterfall: terminal states that need navigation get their own buttons. */
export default function SummaryActions({
  status,
  router,
  onClose,
}: SummaryActionsProps) {
  if (status === "expired") return <ExpiredActions router={router} />;
  if (status === "terminated") return <TerminatedActions />;
  return <CompletedActions router={router} onClose={onClose} />;
}

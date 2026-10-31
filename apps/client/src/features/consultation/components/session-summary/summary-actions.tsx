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
      <Button
        variant="outline"
        className="h-11 w-full rounded-xl border-[#e3ded6] bg-white text-sm font-medium text-[#111111] hover:bg-[#f5f1ec] cursor-pointer"
        onClick={() => router.push("/")}
      >
        Back to home
      </Button>
    </div>
  );
}

function TerminatedActions({ router }: { router: Router }) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <Button
        className="h-11 w-full rounded-xl bg-[#111111] text-sm font-medium text-white hover:bg-black cursor-pointer"
        onClick={() => router.push("/")}
      >
        Back to home
      </Button>
    </div>
  );
}

function CompletedActions({ router, onClose }: { router: Router; onClose?: () => void }) {
  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    router.push("/");
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
      <Button
        variant="ghost"
        className="h-11 w-full rounded-xl text-sm font-medium text-[#626260] hover:bg-[#f5f1ec] hover:text-[#111111] cursor-pointer"
        onClick={() => router.push("/")}
      >
        Back to home
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

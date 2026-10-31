"use client";

import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@repo/design/shadcn";

type TerminationNoticeProps = {
  reason?: string;
  message?: string;
};

export default function TerminationNotice({ reason, message }: TerminationNoticeProps) {
  return (
    <Alert variant="destructive" className="w-full rounded-lg border-[#e3ded6]">
      <AlertTitle className="text-[15px] font-medium">Session ended by admin</AlertTitle>
      <AlertDescription className="text-sm">
        {reason ||
          message ||
          "Your session was ended by an administrator for policy or security reasons."}
      </AlertDescription>
    </Alert>
  );
}

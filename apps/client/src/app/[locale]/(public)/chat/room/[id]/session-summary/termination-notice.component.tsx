"use client";

import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type TerminationNoticeProps = {
  reason?: string;
  message?: string;
};

export default function TerminationNotice({ reason, message }: TerminationNoticeProps) {
  return (
    <Alert variant="destructive" className="w-full">
      <AlertTitle>Authorization Action</AlertTitle>
      <AlertDescription>
        {reason ||
          message ||
          "Your session was terminated by an administrator for policy violation or security reasons."}
      </AlertDescription>
    </Alert>
  );
}

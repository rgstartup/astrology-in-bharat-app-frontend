"use client";

import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

function RetryActions() {
  return (
    <div className="flex gap-3">
      <Button
        onClick={() => window.location.reload()}
        className="rounded-lg bg-[#111111] text-white hover:bg-[#111111]/90"
      >
        Retry
      </Button>
      <Button
        variant="outline"
        onClick={() => (window.location.href = "/")}
        className="rounded-lg border-[#d3cec6] bg-[#ffffff] text-[#111111] shadow-none hover:bg-[#f5f1ec] hover:text-[#111111]"
      >
        Back to home
      </Button>
    </div>
  );
}

export default function RoomErrorState() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#f5f1ec] p-6 text-center">
      <Alert className="w-full max-w-md rounded-xl border-[#d3cec6] bg-[#ffffff] p-6 shadow-none">
        <AlertTitle className="font-sans text-[#111111]">Failed to load session</AlertTitle>
        <AlertDescription className="font-sans text-[#626260]">
          We couldn&apos;t retrieve your chat details. Please try again or go back to home.
        </AlertDescription>
      </Alert>
      <RetryActions />
    </div>
  );
}

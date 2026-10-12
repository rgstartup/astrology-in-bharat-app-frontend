"use client";

import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function RoomErrorState() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <Alert variant="destructive" className="max-w-md">
        <AlertTitle>Failed to Load Session</AlertTitle>
        <AlertDescription>
          We couldn&apos;t retrieve your chat details. Please try again or go back to home.
        </AlertDescription>
      </Alert>
      <div className="flex gap-3">
        <Button onClick={() => window.location.reload()}>Retry</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}

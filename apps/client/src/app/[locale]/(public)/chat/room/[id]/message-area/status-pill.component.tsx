"use client";

import React from "react";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { Badge } from "@/components/ui/badge";

type StatusPillProps = {
  sessionStatus: string;
  sessionTerminated: boolean;
  isDarkMode?: boolean;
};

/** Waterfall: one early return per session state, no nested ternaries. */
export default function StatusPill({ sessionStatus, sessionTerminated }: StatusPillProps) {
  if (sessionStatus === "active") {
    return (
      <Marker variant="separator">
        <MarkerContent>
          <Badge>Consultation in Progress</Badge>
        </MarkerContent>
      </Marker>
    );
  }

  if (sessionStatus === "completed" && sessionTerminated) {
    return (
      <Marker variant="separator">
        <MarkerContent>
          <Badge variant="destructive">Session Terminated by Admin</Badge>
        </MarkerContent>
      </Marker>
    );
  }

  if (sessionStatus === "completed") {
    return (
      <Marker variant="separator">
        <MarkerContent>
          <Badge variant="secondary">Session Ended</Badge>
        </MarkerContent>
      </Marker>
    );
  }

  return (
    <Marker variant="separator">
      <MarkerContent>
        <Badge variant="outline">Start your celestial journey</Badge>
      </MarkerContent>
    </Marker>
  );
}

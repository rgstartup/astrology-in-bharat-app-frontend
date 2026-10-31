"use client";

import { Marker, MarkerContent } from "@repo/design/shadcn";
import { Badge } from "@repo/design/shadcn";

type StatusPillProps = {
  sessionStatus: string;
  sessionTerminated: boolean;
  /** Light-only canvas. Accepted for orchestrator compatibility, never used for styling. */
  isDarkMode?: boolean;
};

const PILL_CLASSES =
  "rounded-full border border-[#d3cec6] bg-[#ffffff] px-3 py-1 font-sans text-[11px] font-medium text-[#626260]";

function ActivePill() {
  return (
    <Marker variant="default" className="w-auto justify-center">
      <MarkerContent>
        <Badge variant="outline" className={PILL_CLASSES}>
          <span className="mr-1.5 inline-block size-1.5 rounded-full bg-[#0bdf50]" aria-hidden />
          Consultation in progress
        </Badge>
      </MarkerContent>
    </Marker>
  );
}

function TerminatedPill() {
  return (
    <Marker variant="default" className="w-auto justify-center">
      <MarkerContent>
        <Badge variant="outline" className={PILL_CLASSES}>
          Session terminated by admin
        </Badge>
      </MarkerContent>
    </Marker>
  );
}

function EndedPill() {
  return (
    <Marker variant="default" className="w-auto justify-center">
      <MarkerContent>
        <Badge variant="outline" className={PILL_CLASSES}>
          Session ended
        </Badge>
      </MarkerContent>
    </Marker>
  );
}

function IdlePill() {
  return (
    <Marker variant="default" className="w-auto justify-center">
      <MarkerContent>
        <Badge variant="outline" className={PILL_CLASSES}>
          Start your consultation
        </Badge>
      </MarkerContent>
    </Marker>
  );
}

/** Waterfall: one early return per session state, no nested ternaries. */
export default function StatusPill({ sessionStatus, sessionTerminated, isDarkMode }: StatusPillProps) {
  void isDarkMode;

  if (sessionStatus === "active") return <ActivePill />;
  if (sessionStatus === "completed" && sessionTerminated) return <TerminatedPill />;
  if (sessionStatus === "completed") return <EndedPill />;
  return <IdlePill />;
}

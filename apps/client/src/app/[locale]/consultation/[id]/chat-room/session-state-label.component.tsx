"use client";

type SessionStateLabelProps = {
  sessionStatus: string;
};

function ActiveLabel() {
  return (
    <span className="flex items-center gap-1.5">
      <span className="size-1.5 rounded-full bg-[#0bdf50]" />
      <span className="text-xs font-medium text-[#111111]">Session live</span>
    </span>
  );
}

function CompletedLabel() {
  return <span className="text-xs font-medium text-[#626260]">Finished</span>;
}

function InitializingLabel() {
  return <span className="text-xs font-medium text-[#7b7b78]">Initializing…</span>;
}

/** Waterfall: one early return per session state, no nested ternaries. */
export default function SessionStateLabel({ sessionStatus }: SessionStateLabelProps) {
  if (sessionStatus === "active") return <ActiveLabel />;
  if (sessionStatus === "completed") return <CompletedLabel />;
  return <InitializingLabel />;
}

"use client";

import { Marker, MarkerContent } from "@/components/ui/marker";

type SessionMarkerProps = {
  label: string;
  startedAt?: string;
};

function formatStartedAt(startedAt?: string): string | null {
  if (!startedAt) return null;
  const d = new Date(startedAt);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function SessionMarker({ label, startedAt }: SessionMarkerProps) {
  const time = formatStartedAt(startedAt);
  return (
    <div className="flex justify-center py-2">
      <Marker variant="separator">
        <MarkerContent>
          <span className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
            <span className="h-px w-8 bg-slate-200" aria-hidden />
            {label}
            {time ? <span className="font-normal normal-case">· {time}</span> : null}
            <span className="h-px w-8 bg-slate-200" aria-hidden />
          </span>
        </MarkerContent>
      </Marker>
    </div>
  );
}

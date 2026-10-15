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

function TimeSuffix({ time }: { time: string | null }) {
  if (!time) return null;
  return <span className="font-normal normal-case">· {time}</span>;
}

export default function SessionMarker({ label, startedAt }: SessionMarkerProps) {
  const time = formatStartedAt(startedAt);
  return (
    <div className="flex items-center gap-3 bg-[#f5f1ec] py-2">
      <span className="h-px flex-1 bg-[#d3cec6]" aria-hidden />
      <Marker variant="default" className="w-auto justify-center">
        <MarkerContent>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d3cec6] bg-[#ffffff] px-3 py-1 font-sans text-[11px] font-medium normal-case text-[#626260]">
            {label}
            <TimeSuffix time={time} />
          </span>
        </MarkerContent>
      </Marker>
      <span className="h-px flex-1 bg-[#d3cec6]" aria-hidden />
    </div>
  );
}

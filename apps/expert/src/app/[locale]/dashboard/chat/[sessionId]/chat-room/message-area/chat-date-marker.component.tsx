import { Marker, MarkerContent } from "@/components/ui/marker";

export function ChatDateMarker({ label }: { label: string }) {
  return (
    <div className="flex justify-center py-1">
      <Marker variant="separator">
        <MarkerContent>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500">
            {label}
          </span>
        </MarkerContent>
      </Marker>
    </div>
  );
}

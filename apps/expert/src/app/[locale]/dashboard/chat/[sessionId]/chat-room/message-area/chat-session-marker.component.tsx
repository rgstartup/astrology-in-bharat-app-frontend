import { Marker, MarkerContent } from "@/components/ui/marker";

export function ChatSessionMarker({ label }: { label: string }) {
  return (
    <div className="flex justify-center py-2">
      <Marker variant="separator">
        <MarkerContent>
          <span className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
            <span className="h-px w-8 bg-slate-200" aria-hidden />
            {label}
            <span className="h-px w-8 bg-slate-200" aria-hidden />
          </span>
        </MarkerContent>
      </Marker>
    </div>
  );
}

import { Marker, MarkerContent } from "@/components/ui/marker";

/**
 * Session boundary rule with a centered white pill label, sentence case.
 */
export function ChatSessionMarker({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 bg-[#f5f1ec] py-2">
      <span className="h-px flex-1 bg-[#d3cec6]" aria-hidden />
      <Marker variant="default" className="w-auto justify-center">
        <MarkerContent>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d3cec6] bg-white px-3 py-1 font-sans text-[11px] font-medium normal-case text-[#626260]">
            {label}
          </span>
        </MarkerContent>
      </Marker>
      <span className="h-px flex-1 bg-[#d3cec6]" aria-hidden />
    </div>
  );
}

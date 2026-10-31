import { Marker, MarkerContent } from "@/components/ui/marker";

/**
 * Centered date divider: white hairline pill on the cream canvas.
 */
export function ChatDateMarker({ label }: { label: string }) {
  return (
    <div className="flex justify-center bg-[#f5f1ec] py-1">
      <Marker variant="default" className="w-auto justify-center">
        <MarkerContent>
          <span className="inline-flex items-center rounded-full border border-[#d3cec6] bg-white px-3 py-1 font-sans text-[11px] font-medium normal-case text-[#626260]">
            {label}
          </span>
        </MarkerContent>
      </Marker>
    </div>
  );
}

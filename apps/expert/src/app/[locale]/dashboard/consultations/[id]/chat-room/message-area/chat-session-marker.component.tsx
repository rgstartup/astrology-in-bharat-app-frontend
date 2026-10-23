import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { MessageCircle, Phone, RefreshCw, Video } from "lucide-react";

/**
 * Session boundary rule rendered as a shadcn marker (separator variant).
 */
function badgeIcon(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes("video")) return Video;
  if (lower.includes("audio")) return Phone;
  if (lower.includes("chat")) return MessageCircle;
  return RefreshCw;
}

export function ChatSessionBadge({ label }: { label: string }) {
  const Icon = badgeIcon(label);
  return (
    <Marker variant="separator" className="bg-[#f5f1ec] py-2">
      <MarkerIcon>
        <Icon className="h-3 w-3" />
      </MarkerIcon>
      <MarkerContent>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d3cec6] bg-white px-2.5 py-0.5 font-sans text-[10px] font-medium normal-case text-[#626260] shadow-[0_1px_2px_rgba(17,17,17,0.04)]">
          {label}
        </span>
      </MarkerContent>
    </Marker>
  );
}
import { Phone, Video } from "@repo/design/lucide";
import { SessionKind } from "@repo/rtc";

/**
 * Dock icon for the addon kind.
 *
 * @param props - Session kind.
 * @returns Kind icon element.
 */
export default function DockKindIcon({ kind }: { kind: SessionKind }) {
  if (kind === "video") return <Video className="size-4" />;
  return <Phone className="size-4" />;
}

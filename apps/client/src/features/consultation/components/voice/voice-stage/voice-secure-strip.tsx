import { Phone } from "@repo/design/lucide";

/**
 * Secure-strip line shown above the voice stage.
 *
 * @returns Secure strip element.
 */
export function VoiceSecureStrip() {
  return (
    <div className="flex items-center justify-center gap-1.5 border-b border-[#d3cec6] bg-white px-4 py-2">
      <span className="size-2 rounded-full bg-[#0bdf50]" />
      <Phone className="size-3 text-[#7b7b78]" />
      <span className="text-xs font-medium text-[#626260]">
        Voice secured end to end
      </span>
    </div>
  );
}

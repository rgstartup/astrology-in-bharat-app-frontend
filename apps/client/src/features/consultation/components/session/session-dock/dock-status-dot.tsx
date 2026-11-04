import { SessionPhase } from "@/features/consultation/types/session-phase";

/**
 * Live dot for the dock status.
 *
 * @param props - Session phase.
 * @returns Status dot element.
 */
export function DockStatusDot({ phase }: { phase: SessionPhase }) {
  if (phase === "live") {
    return (
      <span
        aria-label="Session live"
        className="size-2 shrink-0 rounded-full bg-[#0bdf50]"
      />
    );
  }
  if (phase === "reconnecting") {
    return (
      <span
        aria-label="Reconnecting"
        className="size-2 shrink-0 animate-pulse rounded-full bg-[#c13515]"
      />
    );
  }
  return (
    <span
      aria-label="Connecting"
      className="size-2 shrink-0 animate-pulse rounded-full bg-[#7b7b78]"
    />
  );
}

/**
 * Domain types for Expert Voice and Video Consultation Sessions.
 *
 * Expert Domain Contract:
 * Unlike the client who is billed per minute and requests the session,
 * the expert receives incoming requests, advises devotees, monitors
 * per-minute earnings, accesses client Kundli/birth chart records,
 * and manages audio/video devices during consultation.
 */

export type ExpertSessionKind = "chat" | "voice" | "video";

export type ExpertSessionPhase = "incoming" | "connecting" | "live" | "reconnecting" | "ended";

export interface ClientIntakeProfile {
  name: string;
  avatar?: string | null;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  rashi?: string; // Moon sign / Zodiac
  nakshatra?: string; // Lunar mansion
  lagna?: string; // Ascendant
  topic?: string; // Primary question or consultation focus
  notes?: string; // Client-provided initial context
}

export interface ExpertConsultationMetrics {
  elapsedSeconds: number;
  remainingSeconds?: number;
  ratePerMinute: number;
  isFree?: boolean;
  totalEarned?: number;
  clientMuted?: boolean;
}

export interface ConsultationSummaryReport {
  durationSeconds: number;
  ratePerMinute: number;
  grossEarned: number;
  platformFee: number;
  netPayout: number;
  clientName: string;
  endedAt: string;
  sessionKind: ExpertSessionKind;
}

/**
 * Human-readable label for expert consultation phase.
 *
 * @param phase - Current expert session phase
 * @param kind - Voice or Video
 */
export function getExpertPhaseLabel(
  phase: ExpertSessionPhase,
  kind: ExpertSessionKind = "voice",
): string {
  if (phase === "incoming") return `Incoming ${kind} consultation`;
  if (phase === "connecting") return `Securing ${kind} channel`;
  if (phase === "reconnecting") return "Reconnecting with client";
  if (phase === "ended") return `${kind === "voice" ? "Voice" : "Video"} consultation ended`;
  return `Live`;
}

/**
 * Helper descriptor explaining current consultation state to the expert.
 */
export function getExpertPhaseHelper(
  phase: ExpertSessionPhase,
  kind: ExpertSessionKind = "voice",
): string {
  if (phase === "incoming") {
    return "Devotee is requesting a consultation. Accept to start billing immediately.";
  }
  if (phase === "connecting") {
    return "Establishing encrypted WebRTC connection with devotee.";
  }
  if (phase === "reconnecting") {
    return "Devotee connection unstable. Session timer and earnings paused.";
  }
  if (phase === "ended") {
    return "Session completed. Summary and earnings credited to your wallet.";
  }
  return `Consultation in progress. Earning per minute. You can consult Kundli notes below.`;
}

/**
 * Format duration helper (mm:ss or hh:mm:ss).
 */
export function formatDuration(seconds: number): string {
  const safeSecs = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(safeSecs / 3600);
  const mins = Math.floor((safeSecs % 3600) / 60);
  const secs = safeSecs % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

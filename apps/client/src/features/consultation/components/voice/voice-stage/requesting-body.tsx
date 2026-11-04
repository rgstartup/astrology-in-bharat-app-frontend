import { VoicePhase } from "@/features/consultation/types/voice-phase";
import { VoiceHero } from "../voice-hero";
import { VoiceControls } from "../voice-controls";
import { VoiceRateNote } from "../voice-rate-note";

/**
 * Requesting-phase body: hero plus cancel-oriented controls.
 *
 * @returns Requesting body element.
 */
export function RequestingBody({
  expertName,
  expertAvatar,
  phase,
  elapsedText,
  voiceRate,
  chatRate,
  muted,
  speakerMuted,
}: {
  expertName: string;
  expertAvatar: string | null;
  phase: VoicePhase;
  elapsedText: string;
  voiceRate: number;
  chatRate: number;
  muted: boolean;
  speakerMuted: boolean;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <VoiceHero
        expertName={expertName}
        expertAvatar={expertAvatar}
        phase={phase}
        elapsedText={elapsedText}
        voiceRate={voiceRate}
      />
      <VoiceControls isRequesting muted={muted} speakerMuted={speakerMuted} />
      <div className="px-4 pb-4 md:px-8">
        <VoiceRateNote
          chatRate={chatRate}
          voiceRate={voiceRate}
          entry="direct"
        />
      </div>
    </div>
  );
}

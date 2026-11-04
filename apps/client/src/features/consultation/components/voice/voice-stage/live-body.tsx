import { VoiceMode } from "@/features/consultation/providers/voice.provider";
import { VoicePhase } from "@/features/consultation/types/voice-phase";
import { ChatMessage } from "@repo/chat";
import { VoiceHero } from "../voice-hero";
import { VoiceControls } from "../voice-controls";
import { VoiceRateNote } from "../voice-rate-note";
import { VoiceTranscriptStrip } from "../voice-transcript-strip";

/**
 * Live-phase body: hero, controls, rate note, and transcript strip.
 *
 * @returns Live body element.
 */
export function LiveBody({
  expertName,
  expertAvatar,
  phase,
  elapsedText,
  voiceRate,
  chatRate,
  messages,
  entry,
  muted,
  speakerMuted,
}: {
  expertName: string;
  expertAvatar: string | null;
  phase: VoicePhase;
  elapsedText: string;
  voiceRate: number;
  chatRate: number;
  messages: ChatMessage[];
  entry: VoiceMode;
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
      <VoiceControls muted={muted} speakerMuted={speakerMuted} />
      <div className="px-4 pb-3 md:px-8">
        <VoiceRateNote
          chatRate={chatRate}
          voiceRate={voiceRate}
          entry={entry}
        />
      </div>
      <VoiceTranscriptStrip messages={messages} entry={entry} />
    </div>
  );
}

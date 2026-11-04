import { VoiceMode } from "@/features/consultation/providers/voice.provider";
import { ChatMessage } from "@repo/chat";
import { VoiceEndedPanel } from "./voice-ended-panel";
import { VoiceTranscriptStrip } from "../voice-transcript-strip";

/**
 * Ended-phase body: summary panel plus transcript strip.
 *
 * @returns Ended body element.
 */
export function EndedBody({
  messages,
  entry,
}: {
  messages: ChatMessage[];
  entry: VoiceMode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <VoiceEndedPanel />
      <VoiceTranscriptStrip messages={messages} entry={entry} />
    </div>
  );
}

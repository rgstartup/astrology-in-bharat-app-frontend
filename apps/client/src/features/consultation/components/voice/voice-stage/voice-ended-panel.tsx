import { useVoiceContext } from "@/features/consultation/providers";

/**
 * Ended-phase panel shown after voice finishes.
 *
 * @returns Ended panel element.
 */
export function VoiceEndedPanel() {
  const voice = useVoiceContext();

  return (
    <div className="flex flex-col items-center gap-2 px-6 py-6 text-center">
      <p className="font-sans text-base font-medium text-[#111111]">
        Voice session ended
      </p>
      <p className="max-w-sm text-[13px] text-[#626260]">
        Your chat history and remaining time are intact. Continue in chat
        whenever ready.
      </p>
      <button
        type="button"
        onClick={() => void voice.switchToChat()}
        className="mt-1 h-12 rounded-full bg-[#111111] px-7 text-base font-medium text-white hover:bg-black"
      >
        Return to chat
      </button>
    </div>
  );
}

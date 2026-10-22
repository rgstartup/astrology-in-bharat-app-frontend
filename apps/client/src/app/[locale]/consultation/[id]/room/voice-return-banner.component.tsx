/**
 * Minimized-voice return banner. Null when voice is not minimized.
 *
 * @returns Banner element or null.
 */
export default function VoiceReturnBanner({
  visible,
  elapsedText,
  onReturn,
}: {
  visible: boolean;
  elapsedText: string;
  onReturn: () => void;
}) {
  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={onReturn}
      className="mx-4 mt-2 flex items-center justify-center gap-2 rounded-full bg-[#111111] px-5 py-2.5 text-sm font-medium text-white hover:bg-black"
    >
      <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
      <span>Voice live · {elapsedText} · Return to voice</span>
    </button>
  );
}

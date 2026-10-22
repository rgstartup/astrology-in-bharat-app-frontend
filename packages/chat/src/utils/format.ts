/** Clock formatter for timers: seconds → `MM:SS`. Guards NaN/negative. */
export function formatClock(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds)) return "00:00";
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

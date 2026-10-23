/** Clock formatter for timers: seconds → `MM:SS`. Guards NaN/negative. */
export function formatClock(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds)) return "00:00";
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/** Human session length: `45s`, `8m`, `14m 20s`, `1h 5m`. */
export function formatSessionDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 60) return "< 1 min";
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  if (mins < 60) {
    const secs = total % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
}

/** Single session timestamp: `10:00 AM`; empty string when invalid. */
export function formatSessionTime(iso?: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/** Session window: `10:00 AM – 10:14 AM`, or the side that exists. */
export function formatSessionTimeRange(start?: string | null, end?: string | null): string {
  const from = formatSessionTime(start) || null;
  const to = formatSessionTime(end) || null;
  if (from && to) return `${from} – ${to}`;
  if (from) return `From ${from}`;
  if (to) return `Ended ${to}`;
  return "";
}

/** Wall-clock seconds between a session's start and end, when both exist. */
export function sessionDurationSeconds(meta: {
  startedAt?: string | null;
  endedAt?: string | null;
}): number | null {
  if (!meta.startedAt || !meta.endedAt) return null;
  const start = new Date(meta.startedAt).getTime();
  const end = new Date(meta.endedAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null;
  return Math.round((end - start) / 1000);
}

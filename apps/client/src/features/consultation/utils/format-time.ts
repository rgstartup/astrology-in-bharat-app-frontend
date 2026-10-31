/**
 * Formats a given number of seconds into MM:SS format.
 *
 * @param seconds - Number of seconds
 * @returns Formatted time string, e.g. "05:23"
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.abs(seconds) % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

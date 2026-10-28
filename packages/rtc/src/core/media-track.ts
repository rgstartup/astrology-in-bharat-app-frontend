/**
 * Stops a browser media track so its capture device can be released.
 *
 * @param track - Browser media track to stop, or null when the adapter has no track.
 * @returns True when the track is ended after the call; false when no track was supplied.
 * @throws An error if the browser rejects stopping the media track.
 */
export function releaseMediaStreamTrack(
  track: MediaStreamTrack | null,
): boolean {
  if (track === null) return false;
  if (track.readyState !== "ended") track.stop();
  return track.readyState === "ended";
}

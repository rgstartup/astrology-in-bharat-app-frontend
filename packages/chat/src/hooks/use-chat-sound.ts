"use client";

import { useCallback, useEffect, useRef } from "react";

interface UseChatSoundOptions {
  src: string;
  muted?: boolean;
  volume?: number;
}

/**
 * Lazily-created message-ping player. Failures are silent (autoplay
 * policies, missing asset). No dependencies beyond the DOM Audio API.
 */
export function useChatSound(options: UseChatSoundOptions) {
  const { src, muted = false, volume = 1 } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  useEffect(() => {
    const audio = new Audio(src);
    audio.volume = volume;
    audioRef.current = audio;
    return () => {
      audioRef.current = null;
      audio.pause();
    };
  }, [src, volume]);

  const play = useCallback(() => {
    if (mutedRef.current) return;
    audioRef.current?.play().catch(() => undefined);
  }, []);

  return { play };
}

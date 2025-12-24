// live-sessions/components/SessionControls.tsx
import React from "react";
import { Volume2, Play, Pause } from "lucide-react";

interface SessionControlsProps {
  volume: number;
  isPlaying: boolean;
  onVolumeChange: (volume: number) => void;
  onPlayPause: (playing: boolean) => void;
}

export function SessionControls({
  volume,
  isPlaying,
  onVolumeChange,
  onPlayPause,
}: SessionControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Volume2 className="w-5 h-5 text-gray-500" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onVolumeChange(parseInt(e.target.value))}
          className="w-32 accent-yellow-500"
        />
        <span className="text-sm text-gray-600 w-10">{volume}%</span>
      </div>
      
      <button
        onClick={() => onPlayPause(!isPlaying)}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-gray-700" />
        ) : (
          <Play className="w-5 h-5 text-gray-700" />
        )}
      </button>
    </div>
  );
}
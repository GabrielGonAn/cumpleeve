import React from 'react';
import { Volume2, VolumeX, Music, Play, Pause, Sparkles } from 'lucide-react';

export default function AudioPlayer({ audioRef, isPlaying, isMuted, togglePlay, toggleMute, audioError }) {
  return (
    <>
      <audio ref={audioRef} src="audiofondo.mp3" loop preload="auto" />

      <div className="fixed top-4 right-4 z-50 bg-[#f3e6d8]/90 backdrop-blur-md border border-[#e2cebc] rounded-full px-3 py-1.5 flex items-center gap-2 shadow-md">
        <Music className="w-4 h-4 text-[#d95d39] animate-spin" style={{ animationDuration: '4s' }} />
        <button onClick={togglePlay} className="p-1 text-[#5a4335]" aria-label="Play/Pause">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={toggleMute} className="p-1 text-[#5a4335]" aria-label="Mute/Unmute">
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {audioError && !isPlaying && (
        <div className="mb-4 mt-8 bg-[#f7dcd0] border border-[#e2a288] text-[#8a381a] text-xs px-3 py-2 rounded-lg flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Toca arriba a la derecha para reproducir la música.</span>
        </div>
      )}
    </>
  );
}
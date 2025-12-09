import React, { useState, useRef, useEffect } from 'react';

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Reliable permanent link for upbeat Christmas music
  const AUDIO_URL = "https://cdn.pixabay.com/audio/2022/10/28/audio_924ebf5012.mp3"; 

  useEffect(() => {
    // Set initial volume
    if (audioRef.current) {
        audioRef.current.volume = 0.4;
    }
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Ensure audio is ready before playing
      if (audioRef.current.readyState === 0) {
          audioRef.current.load();
      }
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Playback failed (User interaction needed):", error);
          });
      }
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start gap-2 pointer-events-auto">
       {/* Native Audio Element for better browser support */}
       <audio ref={audioRef} src={AUDIO_URL} loop preload="auto" />

       {/* Music Toggle Button */}
       <button
        onClick={toggleMusic}
        className={`
            relative w-14 h-14 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.4)] 
            flex items-center justify-center transition-all duration-300 transform active:scale-95
            border-2 border-white/20 cursor-pointer
            ${isPlaying 
                ? 'bg-gradient-to-br from-green-600 to-green-800 animate-pulse-slow scale-110' 
                : 'bg-gradient-to-br from-gray-700 to-gray-900 hover:scale-105'}
        `}
        aria-label={isPlaying ? "Mute Music" : "Play Music"}
        style={{ touchAction: 'manipulation' }}
      >
        {/* Glow Ring when playing */}
        {isPlaying && (
            <span className="absolute inset-0 rounded-full border border-green-400/50 animate-ping opacity-40"></span>
        )}
        
        {/* Icon */}
        <i className={`fa-solid text-xl text-white transition-all duration-300 ${isPlaying ? 'fa-music animate-spin-slow' : 'fa-volume-xmark'}`}></i>
      </button>
      
      {/* Simplified Label as requested */}
      {!isPlaying && (
        <span 
          onClick={toggleMusic}
          className="text-[10px] font-bold text-santa-dark bg-santa-gold/90 px-3 py-1 rounded-full shadow-lg backdrop-blur-sm animate-bounce cursor-pointer border border-white/20 whitespace-nowrap"
        >
            Play Music 🎵
        </span>
      )}
    </div>
  );
};

export default BackgroundMusic;
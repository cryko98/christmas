import React, { useState, useRef, useEffect } from 'react';

// Exporting types/props not strictly needed if self-contained, 
// but we keep it simple.
const BackgroundMusic: React.FC<{ autoStart?: boolean }> = ({ autoStart }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Stable Source: Wikimedia Commons (Kevin MacLeod - Jingle Bells)
  const AUDIO_URL = "https://upload.wikimedia.org/wikipedia/commons/e/e0/Jingle_Bells_by_Kevin_MacLeod.ogg"; 

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = 0.5;
    }
    
    // If autoStart is passed (from the Welcome Screen), try to play immediately
    if (autoStart && audioRef.current) {
        audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(e => console.log("Autoplay waiting for interaction", e));
    }
  }, [autoStart]);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Direct play call without waiting for load() prevents browser blocking
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Playback prevented:", error);
            // No alert needed, just log it. The user can try clicking again.
          });
      }
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start gap-2 pointer-events-auto">
       <audio 
         ref={audioRef} 
         src={AUDIO_URL} 
         loop 
         preload="auto"
       />

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
        {isPlaying && (
            <span className="absolute inset-0 rounded-full border border-green-400/50 animate-ping opacity-40"></span>
        )}
        
        <i className={`fa-solid text-xl text-white transition-all duration-300 ${isPlaying ? 'fa-music animate-spin-slow' : 'fa-volume-xmark'}`}></i>
      </button>
      
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
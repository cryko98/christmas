import React, { useState, useRef, useEffect } from 'react';

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // STABLE SOURCE: Wikimedia Commons (Kevin MacLeod - Jingle Bells)
  // This link will not expire.
  const AUDIO_URL = "https://upload.wikimedia.org/wikipedia/commons/e/e0/Jingle_Bells_by_Kevin_MacLeod.ogg"; 

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = 0.5;
    }
  }, []);

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      try {
        // Force load if needed
        if (audioRef.current.readyState === 0) {
            audioRef.current.load();
        }
        
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Playback failed:", error);
        setIsLoading(false);
        // Fallback alert for the user if browser blocks it completely
        alert("Music blocked by browser settings. Please try clicking again!");
      }
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start gap-2 pointer-events-auto">
       {/* Native Audio Element with generic type support */}
       <audio 
         ref={audioRef} 
         src={AUDIO_URL} 
         loop 
         preload="auto"
         onError={(e) => console.error("Audio error:", e)} 
       />

       {/* Music Toggle Button */}
       <button
        onClick={toggleMusic}
        disabled={isLoading}
        className={`
            relative w-14 h-14 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.4)] 
            flex items-center justify-center transition-all duration-300 transform active:scale-95
            border-2 border-white/20 cursor-pointer
            ${isPlaying 
                ? 'bg-gradient-to-br from-green-600 to-green-800 animate-pulse-slow scale-110' 
                : 'bg-gradient-to-br from-gray-700 to-gray-900 hover:scale-105'}
            ${isLoading ? 'opacity-80 cursor-wait' : ''}
        `}
        aria-label={isPlaying ? "Mute Music" : "Play Music"}
        style={{ touchAction: 'manipulation' }}
      >
        {/* Glow Ring when playing */}
        {isPlaying && (
            <span className="absolute inset-0 rounded-full border border-green-400/50 animate-ping opacity-40"></span>
        )}
        
        {/* Icon */}
        {isLoading ? (
             <i className="fa-solid fa-spinner fa-spin text-white text-xl"></i>
        ) : (
             <i className={`fa-solid text-xl text-white transition-all duration-300 ${isPlaying ? 'fa-music animate-spin-slow' : 'fa-volume-xmark'}`}></i>
        )}
      </button>
      
      {/* Label */}
      {!isPlaying && !isLoading && (
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
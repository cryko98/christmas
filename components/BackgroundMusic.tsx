import React, { useState, useRef, useEffect } from 'react';

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Exact Supabase URL provided
  const AUDIO_URL = "https://wkkeyyrknmnynlcefugq.supabase.co/storage/v1/object/public/jinglebells/jingle-bells-444574.mp3"; 

  // Initialize volume
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = 0.5;
    }
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Robust Promise-based play execution
      // This is strictly triggered by user click, satisfying browser policies
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Playback prevented by browser:", error);
            setIsPlaying(false);
          });
      }
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9999] pointer-events-auto">
       {/* Hidden Audio Element */}
       <audio 
         ref={audioRef} 
         src={AUDIO_URL} 
         loop 
         preload="auto"
       />

       {/* Control Button */}
       <button
        onClick={toggleMusic}
        className={`
            relative w-14 h-14 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.4)] 
            flex items-center justify-center transition-all duration-300 transform active:scale-95
            border-2 border-white/20 cursor-pointer group
            ${isPlaying 
                ? 'bg-gradient-to-br from-green-600 to-green-800 animate-pulse-slow scale-110' 
                : 'bg-gradient-to-br from-gray-700 to-gray-900 hover:scale-105'}
        `}
        aria-label={isPlaying ? "Pause Music" : "Play Music"}
        style={{ touchAction: 'manipulation' }}
      >
        {isPlaying && (
            <span className="absolute inset-0 rounded-full border border-green-400/50 animate-ping opacity-40"></span>
        )}
        
        {/* Dynamic Icon */}
        <i className={`fa-solid text-xl text-white transition-all duration-300 ${isPlaying ? 'fa-music animate-spin-slow' : 'fa-play pl-1'}`}></i>
      </button>
      
      {/* Tooltip / Call to Action (Only shows when paused) */}
      {!isPlaying && (
        <div 
          onClick={toggleMusic}
          className="absolute left-16 top-1/2 -translate-y-1/2 ml-2 cursor-pointer animate-in slide-in-from-left-2 fade-in duration-500"
        >
             <div className="bg-black/80 text-white text-[10px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap border border-white/20 shadow-lg relative flex items-center gap-2">
                <span>Play Music</span>
                <span>🎵</span>
                {/* Tiny arrow pointing to button */}
                <div className="absolute top-1/2 -left-1 w-2 h-2 bg-black/80 border-l border-b border-white/20 transform -translate-y-1/2 rotate-45"></div>
             </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundMusic;
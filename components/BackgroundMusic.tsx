import React, { useState, useRef, useEffect } from 'react';

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Classic Upbeat Jingle Bells (Royalty Free)
  const AUDIO_URL = "https://cdn.pixabay.com/audio/2022/10/28/audio_924ebf5012.mp3"; 

  useEffect(() => {
    // Create audio object
    const audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.volume = 0.5; // Set volume to 50%
    audioRef.current = audio;

    // Browser Autoplay Policy: We need a user interaction first.
    const handleFirstInteraction = () => {
        if (!hasInteracted) {
            setHasInteracted(true);
        }
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
        audio.pause();
        audio.src = "";
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Promise handling for browsers that block autoplay
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasInteracted(true);
          })
          .catch((error) => {
            console.log("Autoplay prevented by browser:", error);
          });
      }
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[110] flex flex-col items-start gap-2">
       
       {/* Music Toggle Button */}
       <button
        onClick={toggleMusic}
        className={`
            relative w-12 h-12 md:w-14 md:h-14 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.4)] 
            flex items-center justify-center transition-all duration-300 transform active:scale-95
            border-2 border-white/20 cursor-pointer pointer-events-auto
            ${isPlaying 
                ? 'bg-gradient-to-br from-green-600 to-green-800 animate-pulse-slow scale-110' 
                : 'bg-gradient-to-br from-gray-700 to-gray-900 hover:scale-105'}
        `}
        aria-label={isPlaying ? "Mute Music" : "Play Music"}
        title={isPlaying ? "Mute Jingle Bells" : "Play Jingle Bells"}
        style={{ touchAction: 'manipulation' }}
      >
        {/* Glow Ring when playing */}
        {isPlaying && (
            <span className="absolute inset-0 rounded-full border border-green-400/50 animate-ping opacity-40"></span>
        )}
        
        {/* Icon */}
        <i className={`fa-solid text-lg md:text-xl text-white transition-all duration-300 ${isPlaying ? 'fa-music animate-spin-slow' : 'fa-volume-xmark'}`}></i>
      </button>
      
      {/* Label for clarity (fades out when playing) */}
      {!isPlaying && (
        <span 
          onClick={toggleMusic}
          className="text-[10px] font-bold text-white/90 bg-black/60 px-2 py-1 rounded backdrop-blur-sm animate-bounce cursor-pointer border border-white/10"
        >
            Play Jingle Bells 🎵
        </span>
      )}
    </div>
  );
};

export default BackgroundMusic;
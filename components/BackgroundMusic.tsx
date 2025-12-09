import React, { useState, useRef, useEffect } from 'react';

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Royalty-free Christmas Lo-fi / Chill track URL
  // Using a reliable CDN source
  const AUDIO_URL = "https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=jingle-bells-lofi-126626.mp3";

  useEffect(() => {
    // Create audio object
    const audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.volume = 0.4; // Not too loud
    audioRef.current = audio;

    // Optional: Try to play on first click anywhere on the document
    const handleFirstInteraction = () => {
        if (!hasInteracted) {
            // We don't auto-play to respect user preference, 
            // but we mark interaction as available so the button works instantly
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
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start gap-2">
       
       {/* Tooltip hint that appears initially */}
       {!isPlaying && !hasInteracted && (
          <div className="bg-white/90 text-santa-dark text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg mb-2 animate-bounce pointer-events-none">
             Click for Music 🎵
          </div>
       )}

       <button
        onClick={toggleMusic}
        className={`
            relative w-14 h-14 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.4)] 
            flex items-center justify-center transition-all duration-300 transform hover:scale-110 
            border-2 border-white/20 cursor-pointer pointer-events-auto active:scale-95
            ${isPlaying 
                ? 'bg-gradient-to-br from-green-600 to-green-800 animate-pulse-slow' 
                : 'bg-gradient-to-br from-gray-700 to-gray-900'}
        `}
        aria-label="Toggle Christmas Music"
        style={{ touchAction: 'manipulation' }} // Mobile optimization
      >
        {/* Glow Ring when playing */}
        {isPlaying && (
            <span className="absolute inset-0 rounded-full border border-green-400/50 animate-ping opacity-40"></span>
        )}
        
        {/* Icon */}
        <i className={`fa-solid text-xl text-white transition-all duration-300 ${isPlaying ? 'fa-music animate-spin-slow' : 'fa-volume-xmark'}`}></i>

        {/* Equalizer Bars (Fake) */}
        {isPlaying && (
           <div className="absolute bottom-3 flex gap-0.5 h-3 items-end opacity-0 hover:opacity-100 transition-opacity">
               <div className="w-1 bg-white animate-[bounce_0.5s_infinite]"></div>
               <div className="w-1 bg-white animate-[bounce_0.7s_infinite]"></div>
               <div className="w-1 bg-white animate-[bounce_0.6s_infinite]"></div>
           </div>
        )}
      </button>
    </div>
  );
};

export default BackgroundMusic;
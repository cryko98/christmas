import React, { useState } from 'react';
import { GeneratorStatus } from '../types';
import { generateRandomGift } from '../services/geminiService';

const GiftGenerator: React.FC = () => {
  const [status, setStatus] = useState<GeneratorStatus>(GeneratorStatus.IDLE);
  const [giftImage, setGiftImage] = useState<string | null>(null);

  const handleOpenGift = async () => {
    if (status === GeneratorStatus.LOADING) return;
    
    setStatus(GeneratorStatus.LOADING);
    try {
      const imageUrl = await generateRandomGift();
      setGiftImage(imageUrl);
      setStatus(GeneratorStatus.SUCCESS);
    } catch (e) {
      console.error(e);
      setStatus(GeneratorStatus.ERROR);
    }
  };

  const reset = () => {
    setStatus(GeneratorStatus.IDLE);
    setGiftImage(null);
  };

  return (
    <section id="gift-gen" className="px-4 relative py-24 z-20">
        {/* Custom Styles for this component */}
        <style>{`
            @keyframes shake-box {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(-5deg); }
                75% { transform: rotate(5deg); }
            }
            .animate-shake-box {
                animation: shake-box 0.5s ease-in-out infinite;
            }
            @keyframes burst {
                0% { transform: scale(0); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: scale(1.5); opacity: 0; }
            }
            .animate-burst {
                animation: burst 0.8s ease-out forwards;
            }
        `}</style>

      <div className="max-w-5xl mx-auto w-full text-center">
        
        {/* Changed to glass-card-dark */}
        <div className="glass-card-dark p-12 md:p-20 relative overflow-visible min-h-[600px] flex flex-col items-center justify-center border border-white/10 z-20">
          
          {/* Header Area */}
          <div className="mb-12 relative z-10">
             <span className="inline-block py-1 px-3 border border-santa-red/30 rounded-full bg-red-900/30 text-santa-red text-[10px] font-bold tracking-[0.3em] uppercase mb-4 backdrop-blur-md">
                Ho Ho ... Huh?
             </span>
             <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight drop-shadow-md">
                Mystery <span className="text-santa-gold italic">Gift Box</span>
             </h2>
             <p className="text-gray-300 mt-4 max-w-lg mx-auto">
                Tap the box to reveal your absolutely useless but festive present.
             </p>
          </div>

          {/* Interactive Area */}
          <div className="relative w-full flex flex-col items-center justify-center z-30">
            
            {/* IDLE / LOADING STATE */}
            {(status === GeneratorStatus.IDLE || status === GeneratorStatus.LOADING) && (
              <button 
                onClick={handleOpenGift}
                className={`relative cursor-pointer group transition-all duration-500 transform active:scale-95 bg-transparent border-none outline-none appearance-none
                    ${status === GeneratorStatus.LOADING ? 'animate-shake-box scale-110' : 'hover:scale-110'}
                `}
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }} 
                type="button"
                aria-label="Open Gift"
              >
                 {/* Glow effect behind */}
                 <div className="absolute inset-0 bg-santa-gold/30 blur-3xl rounded-full scale-150 animate-pulse pointer-events-none"></div>
                 
                 {/* 3D CSS Box Representation or High Quality Emoji */}
                 <div className="relative z-10 text-[150px] md:text-[200px] leading-none filter drop-shadow-2xl select-none">
                    🎁
                 </div>
                 
                 {/* Click Hint */}
                 <div className={`mt-8 transition-opacity duration-300 ${status === GeneratorStatus.LOADING ? 'opacity-0' : 'opacity-100'}`}>
                    <span className="bg-santa-red text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm shadow-lg group-hover:bg-red-600 transition-colors pointer-events-none">
                        Tap to Unwrap
                    </span>
                 </div>

                 {/* Loading Text */}
                 {status === GeneratorStatus.LOADING && (
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
                        <span className="text-santa-red font-bold animate-pulse text-lg tracking-widest uppercase">
                            Rummaging through Santa's Sack...
                        </span>
                    </div>
                 )}
              </button>
            )}

            {/* SUCCESS STATE - REVEAL */}
            {status === GeneratorStatus.SUCCESS && giftImage && (
               <div className="animate-in fade-in zoom-in duration-700 relative z-40 w-full flex flex-col items-center">
                  
                  {/* Burst Effect Background - Added pointer-events-none to prevent blocking clicks */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-santa-gold opacity-20 blur-3xl rounded-full scale-150 pointer-events-none"></div>

                  {/* Polaroid Card */}
                  <div className="bg-white p-4 pb-12 shadow-2xl rotate-2 transform transition-transform hover:rotate-0 duration-500 max-w-md w-full mx-auto relative border border-gray-100 z-10">
                      {/* Tape Effect */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/50 backdrop-blur-sm border border-white/20 transform -rotate-1 shadow-sm z-10 pointer-events-none"></div>

                      <div className="aspect-square bg-gray-50 overflow-hidden mb-6 border-2 border-gray-100">
                          <img src={giftImage} alt="Funny Gift" className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="text-center px-4">
                          <h3 className="font-serif text-2xl text-gray-800 italic mb-2">"It's... exactly what I wanted?"</h3>
                          <div className="w-16 h-1 bg-santa-red mx-auto my-4 opacity-20"></div>
                          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                            Official $SANTACOIN Gift
                          </p>
                      </div>
                  </div>

                  {/* Action Buttons - Added relative z-20 to ensure clickability */}
                  <div className="flex flex-col md:flex-row justify-center gap-4 mt-12 relative z-50">
                      <button 
                        type="button"
                        onClick={reset}
                        className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gray-900 transition-colors shadow-lg cursor-pointer border border-white/20 active:scale-95 touch-manipulation"
                      >
                        Open Another
                      </button>
                      <a 
                        href={giftImage}
                        download="my-crappy-gift.png"
                        className="bg-white text-santa-red border border-santa-red/20 px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-red-50 transition-colors shadow-sm cursor-pointer inline-block active:scale-95 touch-manipulation"
                      >
                        Download
                      </a>
                  </div>
               </div>
            )}
            
            {/* ERROR STATE */}
             {status === GeneratorStatus.ERROR && (
                <div className="text-center relative z-20">
                    <p className="text-santa-red text-xl mb-4">The elves dropped the present. Try again.</p>
                    <button onClick={reset} className="underline text-gray-300 hover:text-white cursor-pointer p-4">Reset</button>
                </div>
             )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftGenerator;
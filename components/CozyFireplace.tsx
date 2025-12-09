import React from 'react';

const CozyFireplace: React.FC = () => {
  return (
    <section className="relative py-12 px-4 flex justify-center overflow-hidden">
      
      {/* Container simulating a room wall */}
      <div className="max-w-4xl w-full relative z-10">
        
        <div className="text-center mb-8">
            <span className="inline-block py-1 px-4 border border-santa-gold/40 rounded-full bg-black/40 text-santa-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-2 backdrop-blur-sm">
                Virtual Hearth
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-white drop-shadow-lg">
                Cozy <span className="text-santa-red italic">Quarters</span>
            </h2>
        </div>

        {/* THE FIREPLACE STRUCTURE */}
        <div className="relative mx-auto max-w-3xl">
            
            {/* Mantlepiece (Top Wood) */}
            <div className="h-4 bg-[#5D4037] rounded-t-sm shadow-lg relative z-20 flex items-end justify-center gap-12 sm:gap-24 px-8">
                {/* Stockings hanging from mantle */}
                <div className="w-8 h-12 bg-santa-red rounded-b-full relative top-8 border-t-4 border-white shadow-md transform -rotate-6 origin-top hover:rotate-3 transition-transform duration-500">
                    <div className="absolute top-0 right-0 w-2 h-4 bg-white/20"></div>
                </div>
                <div className="w-8 h-12 bg-green-700 rounded-b-full relative top-8 border-t-4 border-white shadow-md transform rotate-3 origin-top hover:-rotate-3 transition-transform duration-500">
                     <div className="absolute top-0 right-0 w-2 h-4 bg-white/20"></div>
                </div>
                <div className="w-8 h-12 bg-santa-gold rounded-b-full relative top-8 border-t-4 border-white shadow-md transform -rotate-2 origin-top hover:rotate-6 transition-transform duration-500">
                     <div className="absolute top-0 right-0 w-2 h-4 bg-white/20"></div>
                </div>
            </div>
            <div className="h-12 bg-[#3E2723] rounded-sm shadow-2xl relative z-20 flex items-center justify-center border-b-4 border-[#281815]">
                 <p className="text-[#5D4037] font-serif text-xs tracking-[0.5em] uppercase opacity-50 font-bold inset-shadow">North Pole Lodge</p>
            </div>

            {/* Brick Surround */}
            <div className="bg-[#8D6E63] p-4 md:p-8 rounded-b-lg shadow-2xl relative">
                {/* Brick Pattern Overlay using CSS gradients */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" 
                     style={{
                        backgroundImage: `linear-gradient(335deg, rgba(0,0,0,0.3) 23px, transparent 23px),
                                          linear-gradient(155deg, rgba(0,0,0,0.3) 23px, transparent 23px),
                                          linear-gradient(335deg, rgba(0,0,0,0.3) 23px, transparent 23px),
                                          linear-gradient(155deg, rgba(0,0,0,0.3) 23px, transparent 23px)`,
                        backgroundSize: '58px 58px',
                        backgroundColor: '#5D4037'
                     }}>
                </div>

                {/* The Video "Hole" */}
                <div className="bg-black rounded-t-xl overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] border-4 border-[#3E2723] relative aspect-video">
                    
                    {/* Dark Overlay to hide video title/branding interaction initially if needed, 
                        but pointer-events-none handles the interaction block */}
                    <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)]"></div>

                    {/* YouTube Embed */}
                    <div className="absolute inset-0 w-full h-full pointer-events-none scale-[1.35]"> 
                        {/* Scale 1.35 zooms in slightly to hide YouTube black bars/UI edges if any */}
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src="https://www.youtube.com/embed/Kqwn8uiatHs?autoplay=1&mute=1&controls=0&loop=1&playlist=Kqwn8uiatHs&showinfo=0&modestbranding=1&iv_load_policy=3&rel=0&disablekb=1&fs=0" 
                            title="Cozy Fireplace" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="w-full h-full"
                        ></iframe>
                    </div>

                    {/* Fire Grate (Visual Overlay) */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/4 z-20 pointer-events-none flex justify-center items-end opacity-80">
                         <div className="w-[80%] h-4 border-t-4 border-black/50 mb-2"></div>
                         <div className="absolute bottom-0 w-[90%] h-12 flex justify-around">
                             <div className="w-2 h-full bg-black/60"></div>
                             <div className="w-2 h-full bg-black/60"></div>
                             <div className="w-2 h-full bg-black/60"></div>
                             <div className="w-2 h-full bg-black/60"></div>
                         </div>
                    </div>

                </div>

                {/* Hearth (Bottom Stone) */}
                <div className="absolute -bottom-4 left-[-2%] w-[104%] h-8 bg-gray-700 rounded-sm shadow-xl border-t border-gray-600"></div>
            </div>

            {/* Decorations on the side */}
            <div className="absolute -left-12 bottom-0 hidden md:block text-6xl drop-shadow-2xl transform -rotate-12">🎁</div>
            <div className="absolute -right-10 bottom-0 hidden md:block text-5xl drop-shadow-2xl transform rotate-12">🎄</div>

        </div>
      </div>
    </section>
  );
};

export default CozyFireplace;
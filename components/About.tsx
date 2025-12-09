import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="relative px-4">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-10 md:p-16 relative overflow-hidden">
          
          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div className="text-left space-y-8">
              <div>
                <span className="text-santa-red font-bold tracking-widest text-sm uppercase mb-2 block">The Lore & Mission</span>
                <h2 className="text-4xl md:text-5xl font-serif text-gray-800 leading-tight">
                  The Official <span className="text-santa-red italic">Christmas Coin</span> of 2025
                </h2>
              </div>
              
              <div className="text-lg text-gray-600 leading-relaxed font-light space-y-4">
                <p>
                  $CHRISTMAS was born from a singular festive vision: to build the strongest, warmest community on the blockchain this holiday season. In a world of chaos, this memecoin is a digital hearth where everyone can find <strong>peace, joy, and unity</strong> through the spirit of the holidays.
                </p>
                <p>
                  As the <strong>Official Christmas Memecoin of 2025 on Solana</strong>, our ambition shines brighter than the North Star. We are uniting under one banner to build a legendary community and send this coin to a <strong>multi-million dollar market cap</strong>.
                </p>
              </div>
              
              <div className="pl-6 border-l-4 border-santa-gold">
                  <p className="text-xl text-gray-800 font-serif italic">
                    "Find peace in the pump. This isn't just a coin; it's a movement to take Christmas to the moon together."
                  </p>
              </div>

              <div className="flex gap-6 pt-4">
                 <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-santa-red">
                       <i className="fa-solid fa-rocket"></i>
                    </div>
                    <span className="font-semibold text-sm uppercase tracking-wide">Multi-Million MC</span>
                 </div>
                 <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                       <i className="fa-solid fa-peace"></i>
                    </div>
                    <span className="font-semibold text-sm uppercase tracking-wide">Holiday Peace</span>
                 </div>
              </div>
            </div>

            <div className="relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-santa-red to-santa-gold opacity-20 rounded-3xl blur-2xl transform rotate-3"></div>
               <img 
                 src="https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=1000&auto=format&fit=crop" 
                 alt="Christmas Atmosphere" 
                 className="relative z-10 w-full rounded-2xl shadow-2xl transition-all duration-700 hover:scale-[1.02]"
               />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
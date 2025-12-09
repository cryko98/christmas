import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="relative px-4">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-10 md:p-16 relative overflow-hidden">
          
          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div className="text-left space-y-8">
              <div>
                <span className="text-santa-red font-bold tracking-widest text-sm uppercase mb-2 block">The Mission 2025</span>
                <h2 className="text-4xl md:text-5xl font-serif text-gray-800 leading-tight">
                  The Official <span className="text-santa-red italic">Christmas Coin</span> of 2025
                </h2>
              </div>
              
              <p className="text-lg text-gray-600 leading-relaxed font-light">
                Forget the socks and sweaters. This year, everyone is unwrapping <strong>$CHRISTMAS</strong>. We are here to build the strongest, merriest community on Solana. 
                <br /><br />
                Our goal is clear: gather the elves, hodl through the snowstorms, and send this coin to a <strong>multi-million dollar market cap</strong> before Santa even parks his sleigh. Don't be a Grinch—join the movement.
              </p>
              
              <div className="pl-6 border-l-4 border-santa-gold">
                  <p className="text-xl text-gray-800 font-serif italic">
                    "This isn't just a memecoin; it's a holiday tradition. We are going to the moon, and we're taking Christmas with us."
                  </p>
              </div>

              <div className="flex gap-6 pt-4">
                 <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-santa-red">
                       <i className="fa-solid fa-rocket"></i>
                    </div>
                    <span className="font-semibold text-sm uppercase tracking-wide">Multi-Million Goal</span>
                 </div>
                 <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                       <i className="fa-solid fa-users"></i>
                    </div>
                    <span className="font-semibold text-sm uppercase tracking-wide">Strong Community</span>
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
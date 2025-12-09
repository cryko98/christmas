import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="relative px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Changed to glass-card-dark for better contrast with white text */}
        <div className="glass-card-dark p-10 md:p-16 relative overflow-hidden border border-white/10">
          
          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div className="text-left space-y-8">
              <div>
                <span className="text-santa-gold font-bold tracking-widest text-sm uppercase mb-2 block">The Lore & Mission</span>
                <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight drop-shadow-md">
                  The Story of <span className="text-santa-gold italic">$SANTACOIN</span>
                </h2>
              </div>
              
              <div className="text-lg text-gray-200 leading-relaxed font-light space-y-4">
                <p>
                  Deep in the snowy workshops of the North Pole, the elves realized that cookies weren't paying the bills anymore. They needed a decentralized currency to trade toys, reindeer feed, and hot cocoa. Thus, <strong>$SANTACOIN</strong> was minted on the Solana blockchain.
                </p>
                <p>
                  $SANTACOIN isn't just a memecoin; it's the digital spirit of giving. We are building a legendary community where every holder is on the "Nice List". Our goal? To send Santa's sleigh—and this coin—to a <strong>multi-million dollar market cap</strong> before Christmas morning.
                </p>
              </div>
              
              <div className="pl-6 border-l-4 border-santa-gold">
                  <p className="text-xl text-white/90 font-serif italic">
                    "This is the only currency accepted at the North Pole Gift Shop. Ho Ho HODL!"
                  </p>
              </div>

              <div className="flex gap-6 pt-4">
                 <div className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 rounded-full bg-santa-red flex items-center justify-center text-white shadow-lg">
                       <i className="fa-solid fa-rocket"></i>
                    </div>
                    <span className="font-semibold text-sm uppercase tracking-wide">To The North Pole</span>
                 </div>
                 <div className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 rounded-full bg-santa-gold flex items-center justify-center text-black shadow-lg">
                       <i className="fa-solid fa-gift"></i>
                    </div>
                    <span className="font-semibold text-sm uppercase tracking-wide">Community Rewards</span>
                 </div>
              </div>
            </div>

            <div className="relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-santa-red to-santa-gold opacity-20 rounded-3xl blur-2xl transform rotate-3"></div>
               <img 
                 src="https://pbs.twimg.com/media/G7whhgxWQAASpfP?format=jpg&name=medium" 
                 alt="Santa reading the blockchain" 
                 className="relative z-10 w-full rounded-2xl shadow-2xl transition-all duration-700 hover:scale-[1.02] border border-white/10"
               />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
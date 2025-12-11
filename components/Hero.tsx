import React, { useEffect, useState } from 'react';
import { CountDownTime } from '../types';

const Hero: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<CountDownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [copied, setCopied] = useState(false);
  const [isLoreOpen, setIsLoreOpen] = useState(false); // State for Lore Sidebar
  const caAddress = "EeaGM5p2yY916w5En64eUJha3HVi3mj6pVnD5nuhbonk";

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let christmas = new Date(currentYear, 11, 25); 

      if (now.getTime() > christmas.getTime()) {
        christmas = new Date(currentYear + 1, 11, 25);
      }

      const difference = christmas.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); 

    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(caAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="countdown" className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-16 px-4 text-center overflow-hidden">
      
      {/* --- LORE SIDEBAR --- */}
      {/* Container shifts left/right based on state. The button rides along with it. */}
      <div 
        className={`fixed top-1/3 left-0 z-[80] flex items-start transition-transform duration-500 ease-in-out ${
            isLoreOpen ? 'translate-x-0' : '-translate-x-[300px] sm:-translate-x-[350px]'
        }`}
      >
        
        {/* The Panel (Content) */}
        <div className="bg-black/90 backdrop-blur-xl border-y border-r border-santa-gold/30 rounded-br-2xl p-6 w-[300px] sm:w-[350px] shadow-[0_0_30px_rgba(0,0,0,0.5)] h-auto max-h-[60vh] overflow-y-auto custom-scrollbar text-left relative">
            <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
                <i className="fa-solid fa-scroll text-santa-gold text-2xl"></i>
                <h3 className="text-xl font-serif font-bold text-white">Origin Story</h3>
            </div>
            
            <ul className="space-y-4 text-sm text-gray-300 font-light leading-relaxed list-none">
                <li className="flex gap-3">
                    <span className="text-santa-gold mt-1">✦</span>
                    <span>Santacoin was created <strong>January 12, 2014</strong> during a Reddit altcoin-creation contest.</span>
                </li>
                <li className="flex gap-3">
                    <span className="text-santa-gold mt-1">✦</span>
                    <span>It was introduced publicly on Bitcointalk on <strong>May 25, 2014</strong>.</span>
                </li>
                <li className="flex gap-3">
                    <span className="text-santa-gold mt-1">✦</span>
                    <span>Built on Bitcoin with <strong>Scrypt-Adaptive-Nfactor</strong> mining for added security.</span>
                </li>
                <li className="flex gap-3">
                    <span className="text-santa-gold mt-1">✦</span>
                    <span>Launched with a <strong>10% premine</strong> and low coin-generation rate.</span>
                </li>
                <li className="flex gap-3">
                    <span className="text-santa-gold mt-1">✦</span>
                    <span>A third version launched <strong>December 9, 2014</strong>, listed on 40+ exchanges, peak market cap over <strong>$3.2M</strong>.</span>
                </li>
            </ul>
        </div>

        {/* The Toggle Button - Attached to the right side of the panel */}
        <button
            onClick={() => setIsLoreOpen(!isLoreOpen)}
            className="group bg-gradient-to-b from-santa-red to-[#8B0000] text-white py-6 px-2 rounded-r-xl border-y border-r border-santa-gold/50 shadow-lg hover:brightness-110 transition-all duration-300 flex flex-col items-center justify-center gap-2 -ml-[1px]"
            style={{ writingMode: 'vertical-rl' }}
        >
            <span className="text-santa-gold text-xs font-bold tracking-[0.2em] uppercase transform rotate-180 whitespace-nowrap">
                {isLoreOpen ? 'Close' : 'Lore'}
            </span>
            <i className={`fa-solid ${isLoreOpen ? 'fa-chevron-left' : 'fa-book-open'} text-sm mt-2 transition-transform ${isLoreOpen ? '' : 'animate-pulse'}`}></i>
        </button>

      </div>
      {/* --- END LORE SIDEBAR --- */}

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        
        <div className="mb-6 animate-float">
          <span className="inline-block py-1 px-4 border border-santa-gold/50 rounded-full bg-black/20 backdrop-blur-sm text-santa-gold text-xs font-bold tracking-[0.3em] uppercase mb-4">
            The Official Christmas Memecoin
          </span>
          <h1 className="text-7xl md:text-9xl font-serif text-white drop-shadow-lg leading-tight">
            Merry <span className="text-gold-gradient italic pr-2">Christmas</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
            The official currency of the North Pole on Solana. <br/>
            <span className="font-serif italic text-santa-gold">Ho Ho HODL</span> $SANTACOIN into the New Year.
          </p>
        </div>

        {/* Festive Countdown Container */}
        <div className="w-full max-w-4xl mt-12 relative">
          
          {/* Decorative Top Line/String for ornaments to hang from */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-santa-gold to-transparent opacity-50"></div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            <TimeOrnament value={timeLeft.days} label="Days" delay="0s" />
            <TimeOrnament value={timeLeft.hours} label="Hours" delay="0.5s" />
            <TimeOrnament value={timeLeft.minutes} label="Mins" delay="1s" />
            <TimeOrnament value={timeLeft.seconds} label="Secs" delay="1.5s" />
          </div>
        </div>
        
        <div className="mt-20 flex flex-col md:flex-row gap-6 z-10">
           <a 
             href="https://bonk.fun/token/EeaGM5p2yY916w5En64eUJha3HVi3mj6pVnD5nuhbonk"
             target="_blank"
             rel="noreferrer"
             className="bg-gradient-to-r from-santa-red to-santa-dark text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-glow hover:-translate-y-1 transition-all duration-300 border border-white/20 tracking-wider flex items-center justify-center"
           >
              BUY $SANTACOIN
           </a>
           <button className="bg-white text-santa-red px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 tracking-wider">
              VIEW CHART
           </button>
        </div>

        {/* Socials & Contract Address */}
        <div className="mt-10 flex flex-col items-center gap-4 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <div className="flex flex-col md:flex-row items-center gap-4">
                
                <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full border border-white/20 transition-all backdrop-blur-md group cursor-pointer shadow-lg"
                >
                    <span className="text-xs text-santa-gold font-bold tracking-widest uppercase">CA:</span>
                    <span className="text-sm text-white/90 font-mono tracking-wide">
                    {caAddress.substring(0, 6)}...{caAddress.substring(caAddress.length - 4)}
                    </span>
                    <i className={`fa-regular ${copied ? 'fa-circle-check text-green-400' : 'fa-copy text-white'} group-hover:scale-110 transition-transform`}></i>
                </button>

                <a 
                    href="https://x.com/ogsantacoin" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-12 h-12 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black transition-all border border-white/20 shadow-lg hover:-translate-y-1 group"
                >
                    <i className="fa-brands fa-x-twitter text-white text-xl group-hover:scale-110 transition-transform"></i>
                </a>

            </div>
            {copied && <span className="text-green-400 text-xs font-bold tracking-widest uppercase animate-pulse bg-black/50 px-3 py-1 rounded-full">Copied to clipboard</span>}
        </div>

      </div>
    </section>
  );
};

const TimeOrnament: React.FC<{ value: number; label: string; delay: string }> = ({ value, label, delay }) => {
  return (
    <div className="flex flex-col items-center group relative">
       {/* The String */}
       <div className="w-[1px] h-12 bg-santa-gold/60 mb-[-2px]"></div>
       
       {/* The Hanger Hook */}
       <div className="w-4 h-4 rounded-full border-2 border-santa-gold mb-[-8px] z-10 bg-transparent"></div>

       {/* The Ornament Ball */}
       <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-santa-red via-[#D42426] to-[#8B0000] shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center border border-white/10 overflow-hidden transition-transform duration-700 hover:rotate-6 hover:scale-105 hover:shadow-glow">
          
          {/* Shine/Reflection */}
          <div className="absolute top-4 left-6 w-10 h-6 bg-white/20 rounded-full blur-[2px] transform -rotate-45"></div>
          
          {/* Pattern Overlay - using CSS radial gradient for sparkle effect */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>

          <div className="text-center relative z-10">
             <span className="block text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-lg">
                {value.toString().padStart(2, '0')}
             </span>
             <span className="text-[10px] text-santa-gold uppercase tracking-[0.2em] font-bold mt-1 block border-t border-white/20 pt-1 mx-4">
                {label}
             </span>
          </div>

          {/* Golden Bottom Cap */}
          <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-santa-gold to-transparent opacity-50"></div>
       </div>
    </div>
  );
};

export default Hero;
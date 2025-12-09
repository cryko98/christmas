import React, { useEffect, useState } from 'react';
import { CountDownTime } from '../types';

const Hero: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<CountDownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  return (
    <section id="countdown" className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-16 px-4 text-center overflow-hidden">
      
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        
        <div className="mb-6 animate-float">
          <span className="inline-block py-1 px-4 border border-santa-gold/50 rounded-full bg-black/20 backdrop-blur-sm text-santa-gold text-xs font-bold tracking-[0.3em] uppercase mb-4">
            The Official Christmas Coin
          </span>
          <h1 className="text-7xl md:text-9xl font-serif text-white drop-shadow-lg leading-tight">
            Merry <span className="text-gold-gradient italic pr-2">Christmas</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
            The most festive memecoin on Solana. <br/>
            <span className="font-serif italic text-santa-gold">Ho Ho HODL</span> $CHRISTMAS into the New Year.
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
           <button className="bg-gradient-to-r from-santa-red to-santa-dark text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-glow hover:-translate-y-1 transition-all duration-300 border border-white/20 tracking-wider">
              BUY $CHRISTMAS
           </button>
           <button className="bg-white text-santa-red px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 tracking-wider">
              VIEW CHART
           </button>
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
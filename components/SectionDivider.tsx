import React from 'react';

const SectionDivider: React.FC = () => {
  return (
    <div className="relative w-full h-24 pointer-events-none z-20 overflow-hidden -my-8">
       {/* Snow Mound Effect using CSS Radial Gradients */}
       <div className="absolute top-0 left-0 w-full h-full" 
            style={{
                background: 'radial-gradient(circle at 50% -20px, rgba(255,255,255,0.1) 0%, transparent 60%)',
                filter: 'blur(5px)'
            }}>
       </div>
       
       {/* Left Pine Branch */}
       <div className="absolute top-0 left-[-50px] md:left-0 w-48 h-48 md:w-64 md:h-64 transform -rotate-45 origin-top-left drop-shadow-2xl opacity-90">
           <img 
             src="https://raw.githubusercontent.com/koehlersimon/fallback/master/pine-branch.png" 
             alt="Pine Decoration" 
             className="w-full h-full object-contain filter brightness-75 contrast-125"
             onError={(e) => {
                // Fallback using CSS if image fails
                const target = e.target as HTMLElement;
                target.style.display = 'none';
             }}
           />
       </div>

       {/* Right Pine Branch */}
       <div className="absolute top-0 right-[-50px] md:right-0 w-48 h-48 md:w-64 md:h-64 transform rotate-12 origin-top-right drop-shadow-2xl opacity-90">
           <img 
             src="https://raw.githubusercontent.com/koehlersimon/fallback/master/pine-branch.png" 
             alt="Pine Decoration" 
             className="w-full h-full object-contain filter brightness-75 contrast-125 transform scale-x-[-1]"
             onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = 'none';
             }}
           />
       </div>
       
       {/* Snowy Line */}
       <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </div>
  );
};

export default SectionDivider;
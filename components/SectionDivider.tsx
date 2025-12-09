import React from 'react';

const SectionDivider: React.FC = () => {
  return (
    <div className="relative w-full h-32 pointer-events-none z-20 overflow-hidden -my-12">
       {/* Snow Mound Effect using CSS Radial Gradients */}
       <div className="absolute top-0 left-0 w-full h-full" 
            style={{
                background: 'radial-gradient(circle at 50% -20px, rgba(255,255,255,0.15) 0%, transparent 70%)',
                filter: 'blur(8px)'
            }}>
       </div>
       
       {/* Left Pine Branch - Using reliable Wikimedia Source */}
       <div className="absolute top-0 left-[-20px] md:left-0 w-48 h-48 md:w-80 md:h-80 transform -rotate-[30deg] origin-top-left drop-shadow-2xl opacity-100 transition-transform hover:rotate-[-25deg] duration-1000">
           <img 
             src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Pine_branch_with_cones_01.png/800px-Pine_branch_with_cones_01.png" 
             alt="Pine Decoration" 
             className="w-full h-full object-contain filter brightness-90 contrast-110"
           />
       </div>

       {/* Right Pine Branch */}
       <div className="absolute top-0 right-[-20px] md:right-0 w-48 h-48 md:w-80 md:h-80 transform rotate-[30deg] origin-top-right drop-shadow-2xl opacity-100 transition-transform hover:rotate-[25deg] duration-1000">
           <img 
             src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Pine_branch_with_cones_01.png/800px-Pine_branch_with_cones_01.png" 
             alt="Pine Decoration" 
             className="w-full h-full object-contain filter brightness-90 contrast-110 transform scale-x-[-1]"
           />
       </div>
       
       {/* Snowy Line at the bottom to blend sections */}
       <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm"></div>
    </div>
  );
};

export default SectionDivider;
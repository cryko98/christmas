import React, { useState, useRef } from 'react';
import { GalleryItem } from '../types';

interface CommunityWallProps {
  items: GalleryItem[];
  onUpload: (item: GalleryItem) => void;
}

const CommunityWall: React.FC<CommunityWallProps> = ({ items, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [handle, setHandle] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload({
          url: reader.result as string,
          handle: handle || '@AnonymousElf'
        });
        setHandle(''); 
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    if (!handle) {
      const input = document.getElementById('manual-upload-handle');
      if (input) input.focus();
    }
    fileInputRef.current?.click();
  }

  return (
    <section id="gallery" className="px-4 relative mb-32 pt-12">
       
       {/* CSS for Lights and Glow */}
       <style>{`
         @keyframes flash {
           0%, 100% { opacity: 1; box-shadow: 0 0 20px currentColor; }
           50% { opacity: 0.4; box-shadow: 0 0 5px currentColor; }
         }
         .light-bulb {
           position: relative;
           display: inline-block;
           width: 16px;
           height: 16px;
           border-radius: 50%;
           z-index: 20;
           animation-duration: 2s;
           animation-iteration-count: infinite;
         }
         .light-bulb::before {
           content: '';
           position: absolute;
           top: -4px;
           left: 4px;
           width: 8px;
           height: 6px;
           background: #444;
           border-radius: 2px;
         }
         .wire {
           position: absolute;
           top: -15px;
           left: 0;
           right: 0;
           height: 20px;
           border-bottom: 2px solid #222;
           border-radius: 50%;
           z-index: 10;
           pointer-events: none;
         }
       `}</style>

       <div className="max-w-7xl mx-auto relative">
          
          {/* Christmas Lights Decoration String */}
          <div className="absolute -top-12 left-0 w-full h-16 overflow-hidden pointer-events-none z-20 hidden md:block">
             <div className="flex justify-between items-start px-12 w-full absolute top-4">
                {/* Wire curve effect is approximated by the spacing */}
                <div className="wire w-full"></div>
                {Array.from({ length: 20 }).map((_, i) => {
                   const colors = ['#ff0000', '#00ff00', '#ffff00', '#0000ff'];
                   const color = colors[i % colors.length];
                   return (
                     <div 
                        key={i} 
                        className="light-bulb"
                        style={{ 
                          backgroundColor: color,
                          color: color, 
                          marginTop: i % 2 === 0 ? '10px' : '25px',
                          animationName: 'flash',
                          animationDelay: `${Math.random() * 2}s`
                        }}
                     ></div>
                   )
                })}
             </div>
          </div>

          <div className="glass-card-dark p-12 md:p-16 min-h-[700px] border-2 border-santa-gold/30 shadow-[0_0_50px_rgba(212,36,38,0.3)] relative">
              
              {/* Decorative Corner Flourishes */}
              <div className="absolute top-4 left-4 text-4xl text-santa-gold opacity-50"><i className="fa-solid fa-holly-berry"></i></div>
              <div className="absolute top-4 right-4 text-4xl text-santa-gold opacity-50 transform scale-x-[-1]"><i className="fa-solid fa-holly-berry"></i></div>

              <div className="text-center mb-16 relative z-10">
                <span className="inline-block py-1 px-4 rounded-full bg-santa-red/20 text-santa-red border border-santa-red/50 text-xs font-bold tracking-[0.3em] uppercase mb-4 backdrop-blur-md">
                   Official Records
                </span>
                <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 drop-shadow-lg">
                    The <span className="text-santa-gold italic">Nice List</span> Gallery
                </h2>
                <p className="text-white/70 mb-10 max-w-2xl mx-auto font-light text-lg">
                    Immortalize your Santafied self on the blockchain wall of fame. <br/>
                    <span className="text-santa-gold/80 italic text-sm">Naughty elves need not apply.</span>
                </p>

                {/* Styled Input Area */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto bg-black/40 p-2 rounded-full border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center w-full px-4">
                    <span className="text-santa-gold mr-2"><i className="fa-solid fa-at"></i></span>
                    <input 
                      id="manual-upload-handle"
                      type="text" 
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      placeholder="Enter your X handle..."
                      className="bg-transparent border-none text-white placeholder-white/30 outline-none w-full font-medium"
                    />
                  </div>
                  <button
                    onClick={triggerUpload}
                    className="w-full sm:w-auto bg-gradient-to-r from-santa-red to-red-700 text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_20px_rgba(212,36,38,0.6)] transition-all transform hover:-translate-y-0.5 border border-white/10 whitespace-nowrap"
                  >
                    <i className="fa-solid fa-cloud-arrow-up mr-2"></i>
                    Add Photo
                  </button>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>

              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5 mx-auto max-w-2xl">
                   <div className="text-6xl mb-6 animate-bounce">🎅</div>
                   <h3 className="text-2xl font-serif text-white mb-2">The Wall is Empty!</h3>
                   <p className="text-white/50">Be the first to hang your stocking on the wall.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 px-4 pb-8">
                   {items.map((item, idx) => (
                      <FestiveFrame key={idx} item={item} index={idx} />
                   ))}
                </div>
              )}
          </div>
       </div>
    </section>
  );
}

const FestiveFrame: React.FC<{ item: GalleryItem; index: number }> = ({ item, index }) => {
  // Alternate rotations for a natural look
  const rotation = index % 2 === 0 ? 'rotate-1' : '-rotate-1';
  
  return (
    <div className={`group relative transform transition-all duration-500 hover:scale-105 hover:z-30 hover:rotate-0 ${rotation}`}>
       
       {/* The Ribbon/Bow */}
       <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-12 h-12 flex justify-center items-center drop-shadow-lg">
          <i className="fa-solid fa-ribbon text-santa-red text-4xl"></i>
       </div>
       
       {/* Golden String */}
       <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[2px] h-16 bg-gradient-to-b from-transparent to-yellow-600/80"></div>

       {/* The Frame Container */}
       <div className="relative bg-gradient-to-br from-[#FDB931] via-[#F5D061] to-[#C98F08] p-[6px] rounded-lg shadow-2xl">
          {/* Inner Bevel */}
          <div className="bg-[#4a0404] p-[2px] rounded-md">
             {/* Image Area */}
             <div className="aspect-[4/5] overflow-hidden bg-gray-900 rounded-sm relative">
                <img 
                  src={item.url} 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
                  alt="Member" 
                />
                
                {/* Shiny glass overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent pointer-events-none"></div>
             </div>
          </div>
       </div>
       
       {/* Name Tag */}
       <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/90 border border-santa-gold/50 px-4 py-1 rounded-full shadow-lg whitespace-nowrap z-20">
          <p className="text-[10px] font-bold text-santa-gold uppercase tracking-widest">{item.handle}</p>
       </div>
    </div>
  )
}

export default CommunityWall;
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface Ornament {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
}

const ORNAMENT_PALETTE = [
  { emoji: '⭐', label: 'Star' },
  { emoji: '🔴', label: 'Red Ball' },
  { emoji: '🔵', label: 'Blue Ball' },
  { emoji: '🟡', label: 'Gold Ball' },
  { emoji: '⚪', label: 'Pearl' },
  { emoji: '🦯', label: 'Cane' },
  { emoji: '🔔', label: 'Bell' },
  { emoji: '🎀', label: 'Bow' },
  { emoji: '🕯️', label: 'Candle' },
  { emoji: '🦌', label: 'Deer' },
  { emoji: '⛄', label: 'Snowman' },
  { emoji: '❄️', label: 'Snowflake' },
  { emoji: '🎁', label: 'Gift' },
  { emoji: '🍪', label: 'Cookie' },
  { emoji: '🧦', label: 'Sock' },
];

const TreeDecorator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ornaments, setOrnaments] = useState<Ornament[]>([]);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  // Track offset to prevent snapping to center on drag start
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); 

  // --- DRAWING LOGIC ---

  const drawTree = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 1. Background (Winter Night)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Snow floor
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(width / 2, height, width / 1.5, 60, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. The Tree (Procedural Drawing)
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    
    // Stump
    ctx.fillStyle = '#451a03';
    ctx.fillRect(width / 2 - 20, height - 100, 40, 60);

    // Levels (Bottom up)
    const drawLevel = (y: number, spread: number, levelHeight: number) => {
      ctx.beginPath();
      ctx.moveTo(width / 2, y - levelHeight); // Top point
      ctx.lineTo(width / 2 + spread, y);      // Right bottom
      ctx.quadraticCurveTo(width / 2, y + 20, width / 2 - spread, y); // Bottom curve
      ctx.closePath();
      ctx.fill();
    };

    ctx.fillStyle = '#14532d'; // Deep green
    drawLevel(height - 80, 140, 100); // Bottom
    drawLevel(height - 150, 110, 90); // Middle
    drawLevel(height - 210, 80, 80);  // Top

    ctx.shadowBlur = 0;
  };

  const drawOrnaments = (ctx: CanvasRenderingContext2D) => {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ornaments.forEach(o => {
      ctx.font = `${o.size}px sans-serif`;
      // Draw glow if selected/dragged
      if (draggedId === o.id) {
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 15;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fillText(o.emoji, o.x, o.y);
    });
    ctx.shadowBlur = 0; // Reset
  };

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset transform to identity before clearing
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawTree(ctx, canvas.width, canvas.height);
    drawOrnaments(ctx);
  }, [ornaments, draggedId]);

  // Render loop
  useEffect(() => {
    render();
  }, [render]);

  // --- INTERACTIONS ---

  const addOrnament = (emoji: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newOrnament: Ornament = {
      id: Date.now(),
      x: canvas.width / 2 + (Math.random() * 40 - 20), // Slight random jitter center
      y: canvas.height / 2 + (Math.random() * 40 - 20),
      emoji,
      size: 48
    };
    setOrnaments(prev => [...prev, newOrnament]);
  };

  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    // Account for canvas scaling CSS vs internal resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent scrolling on touch
    if ('touches' in e) {
       // e.preventDefault(); // Sometimes needed, but can block page scroll
    }
    
    const { x, y } = getPointerPos(e);

    // Check hit (iterate reverse to grab top-most item)
    for (let i = ornaments.length - 1; i >= 0; i--) {
      const o = ornaments[i];
      // Approximate Hitbox (radius ~ 24px)
      if (Math.hypot(o.x - x, o.y - y) < 30) {
        setDraggedId(o.id);
        setDragOffset({ x: x - o.x, y: y - o.y });
        return;
      }
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggedId) return;
    if ('touches' in e) e.preventDefault(); // Stop scrolling while dragging

    const { x, y } = getPointerPos(e);
    
    setOrnaments(prev => prev.map(o => {
      if (o.id === draggedId) {
        return { ...o, x: x - dragOffset.x, y: y - dragOffset.y };
      }
      return o;
    }));
  };

  const handlePointerUp = () => {
    setDraggedId(null);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const { x, y } = getPointerPos(e);
    // Remove item if double clicked
    const hitIndex = ornaments.findIndex(o => Math.hypot(o.x - x, o.y - y) < 30);
    if (hitIndex !== -1) {
      // Find the specific ID from the reversed hit check logic if needed, 
      // but findIndex finds the *first* one in the array (bottom one).
      // Let's filter carefully.
      const hitItem = ornaments.find(o => Math.hypot(o.x - x, o.y - y) < 30);
      if(hitItem) {
          setOrnaments(prev => prev.filter(o => o.id !== hitItem.id));
      }
    }
  };

  const downloadTree = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Create a temporary link
    const link = document.createElement('a');
    link.download = `My-Christmas-Tree-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <section id="decorator" className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 border border-santa-gold/50 rounded-full bg-black/20 text-santa-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-4">
             Interactive
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white drop-shadow-lg">
            Trim The <span className="text-santa-red italic">Tree</span>
          </h2>
          <p className="text-white/60 mt-2">Drag to decorate. Double-click to remove. Download to share.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
          
          {/* CANVAS AREA */}
          <div className="relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] border-4 border-santa-dark/50 bg-gray-900 mx-auto w-full max-w-[500px]">
             
             {/* Toolbar */}
             <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button 
                  onClick={() => setOrnaments([])}
                  className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-red-600 backdrop-blur-md transition-colors flex items-center justify-center border border-white/20"
                  title="Clear All"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
                <button 
                  onClick={downloadTree}
                  className="w-10 h-10 rounded-full bg-santa-gold text-black hover:bg-yellow-400 backdrop-blur-md transition-colors flex items-center justify-center shadow-glow"
                  title="Download Image"
                >
                  <i className="fa-solid fa-download"></i>
                </button>
             </div>

             <canvas
               ref={canvasRef}
               width={500}
               height={600}
               className="w-full h-auto cursor-crosshair touch-none"
               onMouseDown={handlePointerDown}
               onMouseMove={handlePointerMove}
               onMouseUp={handlePointerUp}
               onMouseLeave={handlePointerUp}
               onDoubleClick={handleDoubleClick}
               onTouchStart={handlePointerDown}
               onTouchMove={handlePointerMove}
               onTouchEnd={handlePointerUp}
             />
          </div>

          {/* PALETTE AREA */}
          <div className="glass-card p-6 w-full md:w-80 flex flex-col gap-4">
             <h3 className="text-santa-dark font-serif font-bold text-xl border-b border-gray-200 pb-2">
                Ornaments
             </h3>
             <div className="grid grid-cols-4 gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {ORNAMENT_PALETTE.map((item) => (
                   <button
                     key={item.label}
                     onClick={() => addOrnament(item.emoji)}
                     className="aspect-square flex items-center justify-center text-3xl bg-white/50 rounded-lg hover:bg-white hover:scale-110 hover:shadow-lg transition-all border border-gray-200"
                     title={item.label}
                   >
                     {item.emoji}
                   </button>
                ))}
             </div>
             <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-xs text-yellow-800">
                <p><strong>Tip:</strong> Double click an item on the tree to delete it.</p>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TreeDecorator;
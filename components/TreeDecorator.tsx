import React, { useRef, useEffect, useState, useCallback } from 'react';

// --- TYPES ---
type ToolType = 'BRUSH' | 'ERASER' | 'STICKER';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  size: number;
  tool: 'BRUSH' | 'ERASER';
}

interface PlacedSticker {
  x: number;
  y: number;
  emoji: string;
  size: number;
}

// --- CONSTANTS ---
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 800;

const COLORS = [
  '#FFFFFF', // Snow White
  '#D42426', // Santa Red
  '#FDB931', // Gold
  '#1E88E5', // Ice Blue
  '#4CAF50', // Bright Green
  '#8B4513', // Wood
  '#000000', // Black
  '#FF69B4', // Pink
  '#9C27B0', // Purple
  '#FF9800', // Orange
];

const STICKERS = [
  '⭐', '🔴', '🔵', '🟡', '🎁', 
  '🔔', '🕯️', '🍪', '🦌', '⛄', 
  '❄️', '🎀', '🦯', '🧦', '🎅'
];

const TreeDecorator: React.FC = () => {
  // We use two canvases:
  // 1. bgCanvasRef: Holds the tree and background (static).
  // 2. drawCanvasRef: Holds the user's strokes and stickers (dynamic).
  // This allows the eraser to make the drawing layer transparent, revealing the tree.
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // --- STATE ---
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [stickers, setStickers] = useState<PlacedSticker[]>([]);
  
  // Tools
  const [activeTool, setActiveTool] = useState<ToolType>('BRUSH');
  const [brushColor, setBrushColor] = useState<string>('#FDB931');
  const [brushSize, setBrushSize] = useState<number>(8); // Default thicker brush
  const [selectedSticker, setSelectedSticker] = useState<string>('⭐');

  const [isDrawing, setIsDrawing] = useState(false);

  // --- DRAWING LOGIC ---

  // Draws the static scene once
  const drawTree = useCallback((ctx: CanvasRenderingContext2D) => {
    const width = CANVAS_WIDTH;
    const height = CANVAS_HEIGHT;

    // 1. Background (Winter Night)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Snow floor
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(width / 2, height, width / 1.1, 90, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. The Tree (Procedural Drawing - HUGE VERSION)
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 15;
    
    // Stump (Wider)
    ctx.fillStyle = '#3E2723';
    ctx.fillRect(width / 2 - 40, height - 100, 80, 80);

    // Tree Layers - Adjusted to fill the canvas from top (y=50) to bottom (y=720)
    ctx.fillStyle = '#14532d'; // Deep green
    
    const drawLayer = (yBase: number, spread: number, layerHeight: number) => {
      ctx.beginPath();
      ctx.moveTo(width / 2, yBase - layerHeight); // Top point
      // Right flairs
      ctx.quadraticCurveTo(width / 2 + spread / 2, yBase - layerHeight / 2, width / 2 + spread, yBase);
      // Bottom curve
      ctx.quadraticCurveTo(width / 2, yBase + 40, width / 2 - spread, yBase); 
      // Left flairs
      ctx.quadraticCurveTo(width / 2 - spread / 2, yBase - layerHeight / 2, width / 2, yBase - layerHeight);
      ctx.fill();
    };

    // Draw from bottom to top to layer correctly
    // Base Layer - Very Wide
    drawLayer(height - 80, 280, 240); 
    
    // Mid Layers
    drawLayer(height - 260, 240, 220); 
    drawLayer(height - 420, 190, 200); 
    
    // Top Layer
    drawLayer(height - 560, 130, 180); 

    ctx.shadowBlur = 0;
  }, []);

  // Initialize Background
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawTree(ctx);
  }, [drawTree]);

  // Render User Drawings
  const renderDrawingLayer = useCallback(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous frame completely
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Stickers
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 0;
    stickers.forEach(s => {
       ctx.font = `${s.size}px sans-serif`;
       ctx.fillStyle = '#FFFFFF'; // Emoji color default (not used for emoji text but good practice)
       ctx.fillText(s.emoji, s.x, s.y);
    });

    // 2. Draw Strokes
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const drawLine = (stroke: Stroke) => {
        if (stroke.points.length < 2) {
             // If it's a single dot/click
             ctx.beginPath();
             ctx.fillStyle = stroke.color;
             
             if (stroke.tool === 'ERASER') {
                 ctx.globalCompositeOperation = 'destination-out';
                 ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.size / 2, 0, Math.PI * 2);
                 ctx.fill();
                 ctx.globalCompositeOperation = 'source-over';
             } else {
                 ctx.globalCompositeOperation = 'source-over';
                 ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.size / 2, 0, Math.PI * 2);
                 ctx.fill();
             }
             return;
        }
        
        ctx.beginPath();
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        
        if (stroke.tool === 'ERASER') {
            ctx.globalCompositeOperation = 'destination-out'; // Erase functionality - makes transparent
        } else {
            ctx.globalCompositeOperation = 'source-over';
        }

        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
            ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over'; // Reset
    };

    // Draw committed strokes
    strokes.forEach(drawLine);

    // Draw current active stroke
    if (currentStroke) {
        drawLine(currentStroke);
    }

  }, [strokes, currentStroke, stickers]);

  useEffect(() => {
    renderDrawingLayer();
  }, [renderDrawingLayer]);

  // --- INPUT HANDLERS ---

  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = drawCanvasRef.current; // Use top canvas for rect
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

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startAction = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default scrolling on touch
    if ('touches' in e) e.preventDefault(); 

    const { x, y } = getPointerPos(e);

    if (activeTool === 'STICKER') {
        // Stamp Mode
        setStickers(prev => [...prev, { x, y, emoji: selectedSticker, size: brushSize * 5 }]); 
    } else {
        // Draw Mode
        setIsDrawing(true);
        setCurrentStroke({
            points: [{ x, y }],
            color: activeTool === 'BRUSH' ? brushColor : '#000000',
            size: brushSize,
            tool: activeTool === 'BRUSH' ? 'BRUSH' : 'ERASER'
        });
    }
  };

  const moveAction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentStroke) return;
    if ('touches' in e) e.preventDefault(); 

    const { x, y } = getPointerPos(e);
    
    setCurrentStroke(prev => {
        if (!prev) return null;
        return {
            ...prev,
            points: [...prev.points, { x, y }]
        };
    });
  };

  const endAction = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) e.preventDefault();
    if (isDrawing && currentStroke) {
        setStrokes(prev => [...prev, currentStroke]);
        setCurrentStroke(null);
    }
    setIsDrawing(false);
  };

  // --- ACTIONS ---

  const handleUndo = () => {
      // Logic: undo last action regardless of type? Or separate?
      // Simple LIFO based on what arrays have
      // We don't track combined history here for simplicity, but we can prioritize strokes then stickers
      if (strokes.length > 0) {
          setStrokes(prev => prev.slice(0, -1));
      } else if (stickers.length > 0) {
          setStickers(prev => prev.slice(0, -1));
      }
  };

  const handleClear = () => {
      if(confirm("Clear your decorations? (The tree will stay)")) {
        setStrokes([]);
        setStickers([]);
      }
  };

  const handleDownload = () => {
    const bgCanvas = bgCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (!bgCanvas || !drawCanvas) return;
    
    // Create temp canvas to merge
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = CANVAS_WIDTH;
    tempCanvas.height = CANVAS_HEIGHT;
    const tCtx = tempCanvas.getContext('2d');
    if (!tCtx) return;

    // Draw Background
    tCtx.drawImage(bgCanvas, 0, 0);
    // Draw Decorations on top
    tCtx.drawImage(drawCanvas, 0, 0);

    const link = document.createElement('a');
    link.download = `Christmas-Masterpiece-${Date.now()}.png`;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
  };

  return (
    <section id="decorator" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-10">
          <span className="inline-block py-1 px-3 border border-santa-gold/50 rounded-full bg-black/20 text-santa-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-4">
             Workshop
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white drop-shadow-lg">
            Decorate <span className="text-santa-gold italic">& Draw</span>
          </h2>
          <p className="text-white/60 mt-2">Use the pro tools to paint your unique Christmas Tree.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          
          {/* TOOLBOX PANEL */}
          {/* Changed to glass-card-dark */}
          <div className="glass-card-dark p-6 w-full lg:w-80 flex flex-col gap-6 order-2 lg:order-1 h-full shadow-2xl border border-white/10">
             
             {/* Main Tool Toggle */}
             <div>
                <label className="text-santa-gold font-bold text-xs uppercase tracking-widest mb-3 block">Mode</label>
                <div className="flex bg-black/40 rounded-lg p-1 border border-white/10 shadow-inner">
                    <button 
                        onClick={() => setActiveTool('BRUSH')}
                        className={`flex-1 py-3 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTool === 'BRUSH' ? 'bg-santa-red shadow-md text-white transform scale-105' : 'text-gray-400 hover:text-white'}`}
                    >
                        <i className="fa-solid fa-paintbrush"></i> Paint
                    </button>
                    <button 
                        onClick={() => setActiveTool('STICKER')}
                        className={`flex-1 py-3 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTool === 'STICKER' ? 'bg-santa-red shadow-md text-white transform scale-105' : 'text-gray-400 hover:text-white'}`}
                    >
                        <i className="fa-solid fa-icons"></i> Stickers
                    </button>
                </div>
             </div>

             {/* Dynamic Content based on Tool */}
             {activeTool === 'BRUSH' || activeTool === 'ERASER' ? (
                 <>
                    {/* Brush Mode Controls */}
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                             <label className="text-santa-gold font-bold text-xs uppercase tracking-widest">Brush Size</label>
                             <span className="text-xs text-white font-mono bg-black/30 px-2 rounded border border-white/10">{brushSize}px</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max="40" 
                            value={brushSize} 
                            onChange={(e) => setBrushSize(parseInt(e.target.value))}
                            className="w-full accent-santa-red h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="text-santa-gold font-bold text-xs uppercase tracking-widest mb-3 block">Color Palette</label>
                        <div className="grid grid-cols-5 gap-3">
                            {COLORS.map(color => (
                                <button
                                    key={color}
                                    onClick={() => {
                                        setBrushColor(color);
                                        setActiveTool('BRUSH'); 
                                    }}
                                    className={`w-10 h-10 rounded-full shadow-md transition-all hover:scale-110 flex items-center justify-center ${brushColor === color && activeTool === 'BRUSH' ? 'ring-2 ring-offset-2 ring-santa-red scale-110' : 'ring-1 ring-white/10'}`}
                                    style={{ backgroundColor: color }}
                                >
                                  {brushColor === color && activeTool === 'BRUSH' && <i className="fa-solid fa-check text-xs mix-blend-difference text-white"></i>}
                                </button>
                            ))}
                            {/* Eraser */}
                            <button
                                onClick={() => setActiveTool('ERASER')}
                                className={`w-10 h-10 rounded-full bg-gray-700 border-2 flex items-center justify-center text-gray-300 transition-all hover:scale-110 shadow-md ${activeTool === 'ERASER' ? 'border-santa-dark ring-2 ring-offset-2 ring-santa-red/30 bg-gray-600' : 'border-gray-600'}`}
                                title="Eraser"
                            >
                                <i className="fa-solid fa-eraser"></i>
                            </button>
                        </div>
                    </div>
                 </>
             ) : (
                 <>
                    {/* Sticker Mode Controls */}
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <label className="text-santa-gold font-bold text-xs uppercase tracking-widest mb-3 block">Sticker Size</label>
                        <input 
                            type="range" 
                            min="2" 
                            max="12" 
                            value={brushSize} 
                            onChange={(e) => setBrushSize(parseInt(e.target.value))}
                            className="w-full accent-santa-gold h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="text-santa-gold font-bold text-xs uppercase tracking-widest mb-3 block">Decorations</label>
                        <div className="grid grid-cols-5 gap-2 max-h-[280px] overflow-y-auto custom-scrollbar p-1">
                            {STICKERS.map(emoji => (
                                <button
                                    key={emoji}
                                    onClick={() => setSelectedSticker(emoji)}
                                    className={`aspect-square flex items-center justify-center text-2xl bg-white/10 rounded-lg border shadow-sm hover:scale-110 transition-all ${selectedSticker === emoji ? 'border-santa-gold bg-santa-gold/20 ring-2 ring-santa-gold/50' : 'border-white/5'}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 text-center bg-black/30 py-1 rounded">Click on tree to place</p>
                    </div>
                 </>
             )}

             {/* Actions */}
             <div className="mt-auto pt-6 border-t border-white/10 grid grid-cols-2 gap-3">
                 <button 
                    onClick={handleUndo}
                    className="py-3 px-4 rounded-xl bg-black/50 text-white font-bold text-xs uppercase hover:bg-black transition-all shadow-lg active:scale-95 border border-white/10"
                 >
                    <i className="fa-solid fa-rotate-left mr-2"></i> Undo
                 </button>
                 <button 
                    onClick={handleClear}
                    className="py-3 px-4 rounded-xl bg-red-900/50 text-red-200 font-bold text-xs uppercase hover:bg-red-900/80 transition-all shadow-lg active:scale-95 border border-red-800/50"
                 >
                    <i className="fa-solid fa-trash mr-2"></i> Clear
                 </button>
             </div>
          </div>

          {/* CANVAS AREA */}
          <div className="order-1 lg:order-2 relative group touch-none">
             <div className="rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.15)] border-4 border-santa-dark/50 bg-gray-900 mx-auto transform transition-transform duration-300 relative touch-none">
                 {/* Background Canvas (Tree) - Bottom Layer */}
                 <canvas
                   ref={bgCanvasRef}
                   width={CANVAS_WIDTH}
                   height={CANVAS_HEIGHT}
                   className="w-full h-auto max-w-[500px] lg:max-w-[600px] block bg-slate-900 touch-none"
                 />
                 
                 {/* Drawing Canvas (Strokes/Stickers) - Top Layer */}
                 <canvas
                   ref={drawCanvasRef}
                   width={CANVAS_WIDTH}
                   height={CANVAS_HEIGHT}
                   className="absolute top-0 left-0 w-full h-full cursor-crosshair touch-none"
                   style={{ touchAction: 'none' }}
                   onMouseDown={startAction}
                   onMouseMove={moveAction}
                   onMouseUp={endAction}
                   onMouseLeave={endAction}
                   onTouchStart={startAction}
                   onTouchMove={moveAction}
                   onTouchEnd={endAction}
                 />
             </div>
             
             {/* Download Button Floating */}
             <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={handleDownload}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-santa-gold to-yellow-500 text-black hover:scale-110 shadow-[0_0_20px_rgba(253,185,49,0.6)] flex items-center justify-center transition-all border-2 border-white/30"
                  title="Download Image"
                >
                  <i className="fa-solid fa-download text-xl"></i>
                </button>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TreeDecorator;